
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
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      <CollapsibleSidebar 
        collapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main className="flex-1 flex h-full overflow-hidden" style={{ marginLeft: isSidebarCollapsed ? '4rem' : '16rem' }}>
        <div className={`transition-all duration-300 border-r border-border bg-background ${isMessageListCollapsed ? 'w-0' : 'w-80'} overflow-hidden flex-shrink-0`}>
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
          className="absolute z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300 border border-border shadow-sm"
          style={{ 
            left: isSidebarCollapsed ? (isMessageListCollapsed ? '4rem' : '24rem') : (isMessageListCollapsed ? '16rem' : '36rem'),
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          onClick={() => setIsMessageListCollapsed(!isMessageListCollapsed)}
        >
          {isMessageListCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
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
