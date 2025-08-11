import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  Phone
} from "lucide-react";

interface CallInterfaceProps {
  isActive: boolean;
  callType: 'voice' | 'video';
  doctorName: string;
  doctorAvatar?: string;
  onEndCall: () => void;
  onToggleMute?: (muted: boolean) => void;
  onToggleVideo?: (enabled: boolean) => void;
  onToggleSpeaker?: (enabled: boolean) => void;
}

const CallInterface = ({
  isActive,
  callType,
  doctorName,
  doctorAvatar,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker
}: CallInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  useEffect(() => {
    if (!isActive) {
      setCallStatus('ended');
      return;
    }

    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    onToggleMute?.(newMuted);
  };

  const handleToggleVideo = () => {
    const newEnabled = !isVideoEnabled;
    setIsVideoEnabled(newEnabled);
    onToggleVideo?.(newEnabled);
  };

  const handleToggleSpeaker = () => {
    const newEnabled = !isSpeakerEnabled;
    setIsSpeakerEnabled(newEnabled);
    onToggleSpeaker?.(newEnabled);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctorAvatar} alt={doctorName} />
              <AvatarFallback className="text-2xl">
                {doctorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">Dr. {doctorName}</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant={callType === 'video' ? 'default' : 'secondary'}>
              {callType === 'video' ? (
                <Video className="h-3 w-3 mr-1" />
              ) : (
                <Phone className="h-3 w-3 mr-1" />
              )}
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </Badge>
            {callStatus === 'connected' && (
              <Badge variant="outline">
                {formatDuration(callDuration)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Call Status */}
          <div className="text-center">
            {callStatus === 'connecting' && (
              <p className="text-muted-foreground animate-pulse">Connecting...</p>
            )}
            {callStatus === 'connected' && (
              <p className="text-green-600 font-medium">Connected</p>
            )}
          </div>

          {/* Video Display Area (for video calls) */}
          {callType === 'video' && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {isVideoEnabled ? (
                <div className="text-center">
                  <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Video feed would appear here</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera is off</p>
                </div>
              )}
            </div>
          )}

          {/* Call Controls */}
          <div className="flex justify-center gap-4">
            {/* Mute Button */}
            <Button
              size="icon"
              variant={isMuted ? "destructive" : "outline"}
              onClick={handleToggleMute}
              className="h-12 w-12 rounded-full"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Video Toggle (only for video calls) */}
            {callType === 'video' && (
              <Button
                size="icon"
                variant={isVideoEnabled ? "outline" : "destructive"}
                onClick={handleToggleVideo}
                className="h-12 w-12 rounded-full"
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            )}

            {/* Speaker Toggle (only for voice calls) */}
            {callType === 'voice' && (
              <Button
                size="icon"
                variant={isSpeakerEnabled ? "default" : "outline"}
                onClick={handleToggleSpeaker}
                className="h-12 w-12 rounded-full"
              >
                {isSpeakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            )}

            {/* End Call Button */}
            <Button
              size="icon"
              variant="destructive"
              onClick={onEndCall}
              className="h-12 w-12 rounded-full"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallInterface;