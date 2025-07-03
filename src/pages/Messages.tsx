
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MessagesContainer from "@/components/messages/MessagesContainer";
import { useMessages } from "@/hooks/useMessages";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const location = useLocation();
  const { toast } = useToast();
  const doctorId = location.state?.doctorId;
  const initiateChat = location.state?.initiateChat;

  useEffect(() => {
    if (doctorId && initiateChat) {
      toast({
        title: "Chat Ready",
        description: "You can now start chatting with the doctor.",
      });
    }
  }, [doctorId, initiateChat, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <MessagesContainer />
      </div>
    </div>
  );
};

export default Messages;
