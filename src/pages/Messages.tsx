
import Navbar from "@/components/Navbar";
import MessagesContainer from "@/components/messages/MessagesContainer";

const Messages = () => {
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
