
import Navbar from "@/components/Navbar";
import MessagesContainer from "@/components/messages/MessagesContainer";

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MessagesContainer />
    </div>
  );
};

export default Messages;
