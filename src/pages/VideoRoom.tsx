import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import VideoInterface from "@/components/video-consultation/VideoInterface";
import {
  useEndVideoConsultation,
  useVideoConsultationByRoom,
} from "@/hooks/useVideoConsultations";

const VideoRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, doctorId } = useAuth();
  const { toast } = useToast();
  const { data: consultation, isLoading } = useVideoConsultationByRoom(roomId);
  const endCall = useEndVideoConsultation();

  const appointment = consultation?.appointment ?? null;
  const isDoctorSide = !!doctorId && appointment?.doctor_id === doctorId;
  const peerName = isDoctorSide
    ? appointment?.patient?.full_name ?? "Patient"
    : `Dr. ${appointment?.doctor?.name ?? "Doctor"}`;

  const handleEnd = () => {
    if (consultation) endCall.mutate(consultation.id);
    toast({
      title: "Consultation ended",
      description: "The video room has been closed.",
    });
    navigate(isDoctorSide ? "/doctor" : "/video-consultation");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        {isLoading || !user ? (
          <Skeleton className="h-[60vh] w-full" />
        ) : !consultation || !appointment ? (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-bold">Consultation room unavailable</h1>
            <p className="mt-2 text-muted-foreground">
              This room does not exist, or you are not a participant in it.
            </p>
            <Button className="mt-6" onClick={() => navigate("/video-consultation")}>
              Back to consultations
            </Button>
          </div>
        ) : (
          <VideoInterface
            roomId={consultation.room_id}
            peerId={user.id}
            peerName={peerName}
            polite={!isDoctorSide}
            appointmentId={appointment.id}
            canWriteClinicalNote={isDoctorSide}
            onEndCall={handleEnd}
          />
        )}
      </main>
    </div>
  );
};

export default VideoRoom;
