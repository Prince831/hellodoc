import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import MessageBubble from "@/components/messages/MessageBubble";
import EnhancedMessageInput from "@/components/messages/EnhancedMessageInput";
import CallInterface from "@/components/messages/CallInterface";
import EmptyState from "@/components/messages/EmptyState";
import LoadingState from "@/components/messages/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Phone, Video, MoreVertical, ArrowLeft, Menu } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const location = useLocation();
  const user = null; // No authentication
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    conversations, 
    loading, 
    selectedConversation,
    setSelectedConversation,
    handleAppointmentResponse, 
    markAsRead, 
    handleSendMessage,
    startConversation,
    isLoading
  } = useMessages();
  
  // Mobile state management
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] = useState(false);
  
  // Call state management
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    doctorName: string;
    doctorAvatar?: string;
  } | null>(null);

  const doctorId = location.state?.doctorId;
  const initiateChat = location.state?.initiateChat;

  useEffect(() => {
    if (doctorId && initiateChat) {
      // Start conversation with the doctor
      startConversation(doctorId, "Hello, I would like to schedule a consultation.");
      toast({
        title: "Chat Ready",
        description: "You can now start chatting with the doctor.",
      });
    }
  }, [doctorId, initiateChat, startConversation, toast]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    
    // Close mobile conversation list when selecting a conversation
    if (isMobile) {
      setIsMobileConversationListOpen(false);
    }
    
    // Mark unread messages as read
    if (conversation.unreadCount > 0) {
      conversation.messages.forEach((message: any) => {
        if (!message.read && message.sender_id !== 'demo-user') {
          markAsRead(message.id);
        }
      });
    }
  };

  const handleBackToConversations = () => {
    if (isMobile) {
      setSelectedConversation(null);
    }
  };

  const handleSendMessageWithAttachments = (content: string, attachments?: File[]) => {
    // Handle file attachments (mock implementation)
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        toast({
          title: "File Attached",
          description: `${file.name} will be sent with your message`,
        });
      });
    }
    
    handleSendMessage(content);
  };

  const handleStartVoiceCall = () => {
    if (!selectedConversation) return;
    
    setActiveCall({
      type: 'voice',
      doctorName: selectedConversation.participant.full_name,
      doctorAvatar: selectedConversation.participant.avatar_url
    });
    
    toast({
      title: "Voice Call Started",
      description: `Connecting voice call with ${selectedConversation.participant.full_name}...`,
    });
  };

  const handleStartVideoCall = () => {
    if (!selectedConversation) return;
    
    setActiveCall({
      type: 'video',
      doctorName: selectedConversation.participant.full_name,
      doctorAvatar: selectedConversation.participant.avatar_url
    });
    
    toast({
      title: "Video Call Started",
      description: `Connecting video call with ${selectedConversation.participant.full_name}...`,
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
    toast({
      title: "Call Ended",
      description: "The call has been disconnected.",
    });
  };

  const ConversationListComponent = () => (
    <ConversationList
      conversations={conversations}
      selectedConversationId={selectedConversation?.id}
      onSelectConversation={handleSelectConversation}
      loading={loading}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Desktop Conversation List */}
        {!isMobile && (
          <div className="w-80 border-r">
            <ConversationListComponent />
          </div>
        )}
        
        {/* Mobile Conversation List Sheet */}
        {isMobile && (
          <Sheet open={isMobileConversationListOpen} onOpenChange={setIsMobileConversationListOpen}>
            <SheetContent side="left" className="w-80 p-0">
              <ConversationListComponent />
            </SheetContent>
          </Sheet>
        )}
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  {isMobile && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleBackToConversations}
                      className="mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar_url} alt={selectedConversation.participant.full_name} />
                    <AvatarFallback>{selectedConversation.participant.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base">{selectedConversation.participant.full_name}</h2>
                    {selectedConversation.participant.role && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedConversation.participant.role}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={handleStartVoiceCall}
                    title="Start voice call"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={handleStartVideoCall}
                    title="Start video call"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  {!isMobile && (
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {selectedConversation.messages.length === 0 ? (
                  <EmptyState type="no-messages" />
                ) : (
                  <div className="space-y-2">
                    {selectedConversation.messages.map((message: any) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isCurrentUser={message.sender_id === 'demo-user'}
                        onAppointmentResponse={handleAppointmentResponse}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {/* Enhanced Message Input */}
              <EnhancedMessageInput 
                onSendMessage={handleSendMessageWithAttachments}
                onStartVoiceCall={handleStartVoiceCall}
                onStartVideoCall={handleStartVideoCall}
                disabled={isLoading}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col relative">
              {isMobile && (
                <div className="absolute top-4 left-4 z-10">
                  <Sheet open={isMobileConversationListOpen} onOpenChange={setIsMobileConversationListOpen}>
                    <SheetTrigger asChild>
                      <Button size="icon" variant="ghost" className="bg-background/95 backdrop-blur">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </Sheet>
                </div>
              )}
              <EmptyState 
                type="select-conversation" 
                onStartConversation={() => {
                  // Could navigate to doctors page or show doctor selector
                  toast({
                    title: "Find a Doctor",
                    description: "Visit the Doctors page to find and chat with healthcare providers.",
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Call Interface Overlay */}
      <CallInterface
        isActive={!!activeCall}
        callType={activeCall?.type || 'voice'}
        doctorName={activeCall?.doctorName || ''}
        doctorAvatar={activeCall?.doctorAvatar}
        onEndCall={handleEndCall}
        onToggleMute={(muted) => console.log('Mute toggled:', muted)}
        onToggleVideo={(enabled) => console.log('Video toggled:', enabled)}
        onToggleSpeaker={(enabled) => console.log('Speaker toggled:', enabled)}
      />
    </div>
  );
};

export default Messages;