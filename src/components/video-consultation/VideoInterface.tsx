import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoDisplay from "./VideoDisplay";
import VideoControls from "./VideoControls";
import VideoChat from "./VideoChat";

interface VideoInterfaceProps {
  roomId: string;
  /** Auth user id of the local participant. */
  peerId: string;
  peerName: string;
  /** Patients are the polite peer in perfect negotiation. */
  polite: boolean;
  appointmentId: string;
  /** Doctors can write a clinical note straight into the patient chart. */
  canWriteClinicalNote: boolean;
  /** Devices and preferences chosen in the pre-join check. */
  audioDeviceId?: string;
  videoDeviceId?: string;
  startMuted?: boolean;
  startCameraOff?: boolean;
  onEndCall: () => void;
}

const VideoInterface = ({
  roomId,
  peerId,
  peerName,
  polite,
  appointmentId,
  canWriteClinicalNote,
  audioDeviceId,
  videoDeviceId,
  startMuted,
  startCameraOff,
  onEndCall,
}: VideoInterfaceProps) => {
  const [notes, setNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const { toast } = useToast();

  const {
    status,
    error,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
  } = useWebRTC({
    roomId,
    peerId,
    polite,
    audioDeviceId,
    videoDeviceId,
    startMuted,
    startCameraOff,
  });

  const handleSaveNotes = async () => {
    if (!notes.trim()) return;

    if (!canWriteClinicalNote) {
      toast({
        title: "Notes saved locally",
        description: "Personal notes are kept in this session only.",
      });
      return;
    }

    setSavingNote(true);
    const { error: saveError } = await supabase.from("appointment_notes").insert({
      appointment_id: appointmentId,
      author_id: peerId,
      note_type: "consultation",
      content: notes.trim(),
    });
    setSavingNote(false);

    if (saveError) {
      toast({
        title: "Could not save note",
        description: saveError.message,
        variant: "destructive",
      });
      return;
    }

    setNotes("");
    toast({ title: "Note saved to the patient chart" });
  };

  return (
    <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex flex-col md:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Consultation with {peerName}</h1>
          <Badge
            variant={
              status === "connected"
                ? "default"
                : status === "failed"
                  ? "destructive"
                  : "secondary"
            }
          >
            {status === "connected"
              ? "Live"
              : status === "reconnecting"
                ? `Reconnecting${reconnectAttempt ? ` (${reconnectAttempt}/${maxReconnectAttempts})` : ""}`
                : status.replace("-", " ")}
          </Badge>
        </div>

        {status === "reconnecting" && (
          <Alert className="mb-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {error ??
                  "The connection dropped. We are restoring it automatically — stay on this page."}
              </span>
              <Button size="sm" variant="outline" onClick={reconnect}>
                Reconnect now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && status !== "reconnecting" && (
          <Alert variant="destructive" className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              <span>{error}</span>
              {status === "failed" && (
                <Button size="sm" variant="outline" onClick={reconnect}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}


        <VideoDisplay
          peerName={peerName}
          localStream={localStream}
          remoteStream={remoteStream}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          status={status}
        />

        <VideoControls
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          onEndCall={onEndCall}
        />
      </div>

      <div className="md:col-span-1">
        <Tabs defaultValue="chat" className="flex h-full flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex flex-1 flex-col">
            <VideoChat doctorName={peerName} />
          </TabsContent>
          <TabsContent value="notes" className="flex-1">
            <Card className="flex h-full flex-col p-4">
              <h2 className="mb-2 font-medium">Consultation notes</h2>
              <Textarea
                className="mb-4 flex-1 resize-none p-2"
                placeholder="Take notes during the consultation…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button onClick={handleSaveNotes} disabled={savingNote || !notes.trim()}>
                {savingNote ? "Saving…" : "Save notes"}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoInterface;
