import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Video as VideoIcon,
  VideoOff,
  Wifi,
  WifiOff,
} from "lucide-react";

export interface PreJoinResult {
  audioDeviceId?: string;
  videoDeviceId?: string;
  startMuted: boolean;
  startCameraOff: boolean;
}

interface PreJoinCheckProps {
  peerName: string;
  onJoin: (result: PreJoinResult) => void;
  onCancel: () => void;
}

type CheckState = "pending" | "ok" | "warn" | "fail";

const TROUBLESHOOT: Record<string, string> = {
  NotAllowedError:
    "Permission was blocked. Click the camera icon in your browser's address bar, allow camera and microphone, then retry.",
  NotFoundError:
    "No camera or microphone was found. Plug in a device, or join with audio only from another device.",
  NotReadableError:
    "Another app (Zoom, Teams, FaceTime) is using your camera. Close it and retry.",
  OverconstrainedError:
    "The selected device is unavailable. Pick a different camera or microphone below.",
  SecurityError:
    "Your browser blocked media on an insecure page. Make sure you are on an https:// address.",
};

const StatusRow = ({
  state,
  icon,
  label,
  detail,
}: {
  state: CheckState;
  icon: React.ReactNode;
  label: string;
  detail: string;
}) => (
  <div className="flex items-start gap-3 rounded-lg border border-border p-3">
    <span className="mt-0.5 text-muted-foreground">{icon}</span>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="font-medium">{label}</p>
        <Badge
          variant={
            state === "ok" ? "default" : state === "fail" ? "destructive" : "secondary"
          }
        >
          {state === "pending" ? "Checking…" : state === "ok" ? "Ready" : state === "warn" ? "Limited" : "Blocked"}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
    {state === "pending" ? (
      <Loader2 className="mt-1 h-4 w-4 animate-spin text-muted-foreground" />
    ) : state === "ok" ? (
      <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
    ) : (
      <AlertTriangle className="mt-1 h-4 w-4 text-destructive" />
    )}
  </div>
);

const PreJoinCheck = ({ peerName, onJoin, onCancel }: PreJoinCheckProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [mediaState, setMediaState] = useState<CheckState>("pending");
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [cams, setCams] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [audioDeviceId, setAudioDeviceId] = useState<string>();
  const [level, setLevel] = useState(0);
  const [startMuted, setStartMuted] = useState(false);
  const [startCameraOff, setStartCameraOff] = useState(false);

  const [netState, setNetState] = useState<CheckState>("pending");
  const [netDetail, setNetDetail] = useState("Testing connectivity to the media servers…");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
  }, []);

  const startPreview = useCallback(async () => {
    stopStream();
    setMediaState("pending");
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
        audio: audioDeviceId
          ? { deviceId: { exact: audioDeviceId }, echoCancellation: true, noiseSuppression: true }
          : { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const devices = await navigator.mediaDevices.enumerateDevices();
      setCams(devices.filter((d) => d.kind === "videoinput"));
      setMics(devices.filter((d) => d.kind === "audioinput"));
      setVideoDeviceId((id) => id ?? stream.getVideoTracks()[0]?.getSettings().deviceId);
      setAudioDeviceId((id) => id ?? stream.getAudioTracks()[0]?.getSettings().deviceId);

      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;
      setMediaState(hasVideo && hasAudio ? "ok" : "warn");
      if (!hasVideo) setStartCameraOff(true);

      if (hasAudio) {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const buffer = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(buffer);
          let peak = 0;
          for (const v of buffer) peak = Math.max(peak, Math.abs(v - 128) / 128);
          setLevel(Math.min(100, Math.round(peak * 180)));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    } catch (err) {
      const name = (err as DOMException)?.name ?? "Error";
      setMediaState("fail");
      setMediaError(
        TROUBLESHOOT[name] ??
          "We could not start your camera and microphone. Check your browser permissions and retry.",
      );
    }
  }, [audioDeviceId, videoDeviceId, stopStream]);

  const runNetworkCheck = useCallback(async () => {
    setNetState("pending");
    setNetDetail("Testing connectivity to the media servers…");

    if (!navigator.onLine) {
      setNetState("fail");
      setNetDetail("You appear to be offline. Reconnect to the internet and retry.");
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    let srflx = false;
    let host = false;
    const started = performance.now();

    await new Promise<void>((resolve) => {
      const done = () => resolve();
      const timer = setTimeout(done, 6000);
      pc.onicecandidate = ({ candidate }) => {
        if (!candidate) {
          clearTimeout(timer);
          done();
          return;
        }
        if (candidate.candidate.includes("typ srflx")) srflx = true;
        if (candidate.candidate.includes("typ host")) host = true;
      };
      pc.createDataChannel("probe");
      pc.createOffer()
        .then((o) => pc.setLocalDescription(o))
        .catch(() => {
          clearTimeout(timer);
          done();
        });
    });

    const ms = Math.round(performance.now() - started);
    pc.close();

    if (srflx) {
      setNetState("ok");
      setNetDetail(`Media path confirmed in ${ms} ms. Your network allows peer-to-peer video.`);
    } else if (host) {
      setNetState("warn");
      setNetDetail(
        "Only local network candidates were found. A firewall or VPN may block the call — try disabling the VPN or switching to another Wi-Fi or mobile network.",
      );
    } else {
      setNetState("fail");
      setNetDetail(
        "No connection candidates were found. Your network is blocking video calls — switch network, or disable the VPN/firewall and retry.",
      );
    }
  }, []);

  useEffect(() => {
    startPreview();
    return stopStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDeviceId, audioDeviceId]);

  useEffect(() => {
    runNetworkCheck();
  }, [runNetworkCheck]);

  const handleJoin = () => {
    stopStream();
    onJoin({ audioDeviceId, videoDeviceId, startMuted, startCameraOff });
  };

  const canJoin = mediaState === "ok" || mediaState === "warn";

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
      <Card className="overflow-hidden p-4">
        <h1 className="mb-1 text-lg font-semibold">Ready to meet {peerName}?</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          We run a quick camera, microphone and network check before you join.
        </p>

        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${startCameraOff || mediaState === "fail" ? "hidden" : ""}`}
          />
          {(startCameraOff || mediaState === "fail") && (
            <div className="flex h-full w-full items-center justify-center">
              <VideoOff className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Mic className="h-4 w-4 text-muted-foreground" />
          <Progress value={level} className="h-2 flex-1" aria-label="Microphone level" />
          <span className="w-24 text-right text-xs text-muted-foreground">
            {level > 4 ? "Mic working" : "Say something"}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant={startMuted ? "secondary" : "outline"}
            size="sm"
            onClick={() => setStartMuted((v) => !v)}
          >
            {startMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {startMuted ? "Join muted" : "Mic on"}
          </Button>
          <Button
            variant={startCameraOff ? "secondary" : "outline"}
            size="sm"
            onClick={() => setStartCameraOff((v) => !v)}
          >
            {startCameraOff ? (
              <VideoOff className="mr-2 h-4 w-4" />
            ) : (
              <VideoIcon className="mr-2 h-4 w-4" />
            )}
            {startCameraOff ? "Camera off" : "Camera on"}
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-4">
        <StatusRow
          state={mediaState}
          icon={<VideoIcon className="h-4 w-4" />}
          label="Camera & microphone"
          detail={
            mediaError ??
            (mediaState === "ok"
              ? "Devices are working and permission is granted."
              : mediaState === "warn"
                ? "Only part of your devices is available — you can still join."
                : "Requesting access…")
          }
        />

        <StatusRow
          state={netState}
          icon={netState === "fail" ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          label="Network"
          detail={netDetail}
        />

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Camera</label>
            <Select value={videoDeviceId} onValueChange={setVideoDeviceId}>
              <SelectTrigger>
                <SelectValue placeholder={cams.length ? "Select camera" : "No camera found"} />
              </SelectTrigger>
              <SelectContent>
                {cams.map((d, i) => (
                  <SelectItem key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Microphone</label>
            <Select value={audioDeviceId} onValueChange={setAudioDeviceId}>
              <SelectTrigger>
                <SelectValue placeholder={mics.length ? "Select microphone" : "No microphone found"} />
              </SelectTrigger>
              <SelectContent>
                {mics.map((d, i) => (
                  <SelectItem key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(mediaState === "fail" || netState !== "ok") && (
          <Alert variant={mediaState === "fail" ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Troubleshooting</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>Allow camera and microphone in the browser address bar, then retry.</li>
                <li>Close other apps or tabs that may be holding the camera.</li>
                <li>Turn off any VPN and prefer Wi-Fi or a stable mobile connection.</li>
                <li>If it still fails, join muted with the camera off — audio-only still works.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              startPreview();
              runNetworkCheck();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry checks
          </Button>
          <Button className="flex-1" onClick={handleJoin} disabled={!canJoin}>
            Join consultation
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PreJoinCheck;
