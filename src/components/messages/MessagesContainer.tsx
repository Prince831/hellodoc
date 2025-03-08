
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageList from "@/components/messages/MessageList";
import ChatArea from "@/components/messages/ChatArea";
import CollapsibleSidebar from "@/components/messages/CollapsibleSidebar";
import { useMessages } from "@/hooks/useMessages";

const MessagesContainer: React.FC = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMessageListCollapsed, setIsMessageListCollapsed] = useState(false);

  const doctorId = location.state?.doctorId;
  const initiateChat = location.state?.initiateChat;

  const {
    messages,
    loading,
    newMessage,
    setNewMessage,
    selectedMessage,
    setSelectedMessage,
    handleAppointmentResponse,
    markAsRead,
    handleSendMessage
  } = useMessages(doctorId, initiateChat);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CollapsibleSidebar 
        collapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[320px,1fr] h-full bg-background relative">
        <div className={`transition-all duration-300 ${isMessageListCollapsed ? 'lg:w-0' : 'lg:w-[320px]'} overflow-hidden`}>
          <MessageList
            messages={messages}
            selectedMessage={selectedMessage}
            onSelectMessage={setSelectedMessage}
            markAsRead={markAsRead}
            loading={loading}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex fixed left-[calc(320px+64px)] top-1/2 transform -translate-y-1/2 z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300"
          onClick={() => setIsMessageListCollapsed(!isMessageListCollapsed)}
        >
          {isMessageListCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <div className="flex flex-col h-full border-l border-border">
          <ChatArea
            messages={messages}
            selectedSenderId={selectedMessage?.sender.id || null}
            onAppointmentResponse={handleAppointmentResponse}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
};

export default MessagesContainer;
