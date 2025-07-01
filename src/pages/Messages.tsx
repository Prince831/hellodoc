
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Send, Search, Plus, MessageCircle, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversations, useMessages, useSendMessage, useMessageRealtime } from "@/hooks/useMessages";
import { useDoctors } from "@/hooks/useDoctors";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { LoadingScreen } from "@/components/ui/loading";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [subject, setSubject] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation || undefined);
  const { data: doctors = [] } = useDoctors();
  const sendMessage = useSendMessage();

  // Set up real-time messaging
  useMessageRealtime(selectedConversation || undefined);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedConversation) return;

    // Find the conversation to get the doctor ID
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    await sendMessage.mutateAsync({
      doctorId: conversation.doctor_id,
      content: messageContent
    });

    setMessageContent("");
  };

  const handleSendNewMessage = async () => {
    if (!newMessageContent.trim() || !selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor and enter a message.",
        variant: "destructive",
      });
      return;
    }

    await sendMessage.mutateAsync({
      doctorId: selectedDoctor,
      content: newMessageContent,
      subject: subject || undefined
    });

    setNewMessageContent("");
    setSubject("");
    setSelectedDoctor("");
    setIsNewMessageDialogOpen(false);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (conversationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Navbar />
        <LoadingScreen message="Loading your messages..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Messages
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Communicate with your healthcare providers
                </p>
              </div>
              
              <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Message subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        placeholder="Type your message here..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button 
                      onClick={handleSendNewMessage}
                      disabled={sendMessage.isPending}
                      className="w-full"
                    >
                      {sendMessage.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full">
                    {filteredConversations.length === 0 ? (
                      <div className="p-6 text-center">
                        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Conversations</h3>
                        <p className="text-muted-foreground mb-4">
                          Start a conversation with a doctor.
                        </p>
                        <Button 
                          size="sm"
                          onClick={() => setIsNewMessageDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Message
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                              selectedConversation === conversation.id ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={conversation.doctor?.image_url || ""} />
                                <AvatarFallback>
                                  {getInitials(conversation.doctor?.name || "")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium truncate">
                                    {conversation.doctor?.name}
                                  </h4>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(conversation.last_message_at), 'MMM d')}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {conversation.doctor?.specialization}
                                </p>
                                {conversation.subject && (
                                  <p className="text-xs text-slate-600 truncate mt-1">
                                    {conversation.subject}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                {selectedConversation ? (
                  <>
                    <CardHeader className="pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={conversations.find(c => c.id === selectedConversation)?.doctor?.image_url || ""} 
                          />
                          <AvatarFallback>
                            {getInitials(conversations.find(c => c.id === selectedConversation)?.doctor?.name || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {conversations.find(c => c.id === selectedConversation)?.doctor?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {conversations.find(c => c.id === selectedConversation)?.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col p-0">
                      <ScrollArea className="flex-1 p-4">
                        {messagesLoading ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No messages yet</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.sender_id === user?.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                      
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className="min-h-[60px] resize-none"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!messageContent.trim() || sendMessage.isPending}
                            size="sm"
                            className="self-end"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose a conversation to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
