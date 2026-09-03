import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import type { CallInvite } from "@/hooks/useCallSignaling";

interface IncomingCallDialogProps {
  invite: CallInvite | null;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallDialog = ({ invite, onAccept, onDecline }: IncomingCallDialogProps) => {
  if (!invite) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-sm rounded-2xl border border-border/40 p-6 text-center shadow-2xl">
        <Avatar className="mx-auto h-20 w-20 animate-pulse-soft">
          <AvatarImage src={invite.from.avatar} alt={invite.from.name} />
          <AvatarFallback className="text-2xl">{invite.from.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-lg font-semibold">{invite.from.name}</h2>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {invite.callType === "video" ? (
            <Video className="h-4 w-4" />
          ) : (
            <Phone className="h-4 w-4" />
          )}
          Incoming {invite.callType} call…
        </p>

        <div className="mt-6 flex justify-center gap-6">
          <Button
            size="icon"
            variant="destructive"
            className="h-14 w-14 rounded-full"
            aria-label="Decline call"
            onClick={onDecline}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full"
            aria-label="Accept call"
            onClick={onAccept}
          >
            {invite.callType === "video" ? (
              <Video className="h-6 w-6" />
            ) : (
              <Phone className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
