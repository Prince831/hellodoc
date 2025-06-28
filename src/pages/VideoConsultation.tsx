
import Navbar from "@/components/Navbar";
import VideoConsultationContainer from "@/components/video-consultation/VideoConsultationContainer";

const VideoConsultation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <VideoConsultationContainer />
      </div>
    </div>
  );
};

export default VideoConsultation;
