
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Video, MoreVertical } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, loading, handleAppointmentResponse, markAsRead, sendMessage } = useMessages();
  
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);

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

  // Group messages into conversations
  useEffect(() => {
    if (messages.length > 0 && user) {
      const conversationMap = new Map();
      
      messages.forEach(message => {
        const isFromCurrentUser = message.sender_id === user.id;
        const otherUserId = isFromCurrentUser ? message.receiver_id : message.sender_id;
        const otherUser = isFromCurrentUser 
          ? { id: message.receiver_id, name: 'Doctor', avatar: undefined }
          : message.sender;
        
        if (conversationMap.has(otherUserId)) {
          const existing = conversationMap.get(otherUserId);
          existing.messages.push(message);
          if (new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
            existing.lastMessage = {
              content: message.content,
              timestamp: message.timestamp,
              fromCurrentUser: isFromCurrentUser
            };
          }
          if (!message.read && !isFromCurrentUser) {
            existing.unreadCount++;
          }
        } else {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            participant: otherUser,
            messages: [message],
            lastMessage: {
              content: message.content,
              timestamp: message.timestamp,
              fromCurrentUser: isFromCurrentUser
            },
            unreadCount: (!message.read && !isFromCurrentUser) ? 1 : 0
          });
        }
      });
      
      const conversationList = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
      
      setConversations(conversationList);
      
      // Auto-select first conversation if none selected
      if (!selectedConversation && conversationList.length > 0) {
        setSelectedConversation(conversationList[0]);
      }
    }
  }, [messages, user, selectedConversation]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    
    // Mark unread messages as read
    if (conversation.unreadCount > 0) {
      conversation.messages.forEach((message: any) => {
        if (!message.read && message.sender_id !== user?.id) {
          markAsRead(message.id);
        }
      });
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !user) return;
    
    sendMessage({
      receiverId: selectedConversation.id,
      content,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                    <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.participant.name}</h2>
                    {selectedConversation.participant.role && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedConversation.participant.role}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {selectedConversation.messages.map((message: any) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender_id === user?.id}
                      onAppointmentResponse={handleAppointmentResponse}
                    />
                  ))}
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
