
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, Clock, Phone, Video, Calendar, User, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: string;
  senderType: 'doctor' | 'patient';
  avatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  patient: {
    id: string;
    name: string;
    avatar?: string;
    lastSeen?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    isFromDoctor: boolean;
  };
  unreadCount: number;
  messages: Message[];
}

const DoctorMessages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading conversations from an API
    const mockConversations: Conversation[] = [
      {
        id: '1',
        patient: {
          id: 'p1',
          name: 'John Smith',
          avatar: 'https://i.pravatar.cc/150?img=1',
          lastSeen: '5 minutes ago'
        },
        lastMessage: {
          content: 'Thank you doctor, I appreciate your help',
          timestamp: '10:30 AM',
          isFromDoctor: false
        },
        unreadCount: 2,
        messages: [
          {
            id: 'm1',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'Hello John, how can I help you today?',
            timestamp: '10:05 AM',
            isRead: true
          },
          {
            id: 'm2',
            sender: 'John Smith',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'I\'ve been experiencing headaches recently, especially in the morning',
            timestamp: '10:10 AM',
            isRead: true
          },
          {
            id: 'm3',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'I see. How long has this been going on? And do you notice any triggers?',
            timestamp: '10:15 AM',
            isRead: true
          },
          {
            id: 'm4',
            sender: 'John Smith',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'About a week now. It seems worse when I don\'t get enough sleep.',
            timestamp: '10:20 AM',
            isRead: true
          },
          {
            id: 'm5',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'Let\'s schedule an appointment to discuss this further. I recommend you track your sleep patterns and headache occurrences in the meantime.',
            timestamp: '10:25 AM',
            isRead: true
          },
          {
            id: 'm6',
            sender: 'John Smith',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'Thank you doctor, I appreciate your help',
            timestamp: '10:30 AM',
            isRead: false
          },
        ]
      },
      {
        id: '2',
        patient: {
          id: 'p2',
          name: 'Emily Wilson',
          avatar: 'https://i.pravatar.cc/150?img=5',
          lastSeen: 'Online'
        },
        lastMessage: {
          content: 'When should I take the medication?',
          timestamp: 'Yesterday',
          isFromDoctor: false
        },
        unreadCount: 1,
        messages: [
          {
            id: 'm7',
            sender: 'Emily Wilson',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=5',
            content: 'Hello Dr. Johnson, I have a question about my prescription',
            timestamp: 'Yesterday, 4:30 PM',
            isRead: true
          },
          {
            id: 'm8',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'Hello Emily, what would you like to know?',
            timestamp: 'Yesterday, 5:00 PM',
            isRead: true
          },
          {
            id: 'm9',
            sender: 'Emily Wilson',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=5',
            content: 'When should I take the medication?',
            timestamp: 'Yesterday, 5:15 PM',
            isRead: false
          },
        ]
      },
      {
        id: '3',
        patient: {
          id: 'p3',
          name: 'Michael Chen',
          lastSeen: '2 hours ago'
        },
        lastMessage: {
          content: 'Your lab results look normal.',
          timestamp: '2 days ago',
          isFromDoctor: true
        },
        unreadCount: 0,
        messages: [
          {
            id: 'm10',
            sender: 'Michael Chen',
            senderType: 'patient',
            content: 'Dr. Johnson, have my lab results arrived?',
            timestamp: '2 days ago, 10:00 AM',
            isRead: true
          },
          {
            id: 'm11',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'Yes, I received them this morning. I\'ll review them and get back to you.',
            timestamp: '2 days ago, 10:45 AM',
            isRead: true
          },
          {
            id: 'm12',
            sender: 'Dr. Sarah Johnson',
            senderType: 'doctor',
            content: 'Your lab results look normal. We should continue with the current treatment plan.',
            timestamp: '2 days ago, 3:20 PM',
            isRead: true
          },
        ]
      },
      {
        id: '4',
        patient: {
          id: 'p4',
          name: 'Sarah Thompson',
          avatar: 'https://i.pravatar.cc/150?img=9',
          lastSeen: '3 days ago'
        },
        lastMessage: {
          content: 'Thank you for the prescription',
          timestamp: '1 week ago',
          isFromDoctor: false
        },
        unreadCount: 0,
        messages: [
          {
            id: 'm13',
            sender: 'Sarah Thompson',
            senderType: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=9',
            content: 'Thank you for the prescription',
            timestamp: '1 week ago',
            isRead: true
          },
        ]
      }
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const updatedMessage: Message = {
      id: `new-${Date.now()}`,
      sender: 'Dr. Sarah Johnson',
      senderType: 'doctor',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    // Update the active conversation with the new message
    const updatedConversation = {
      ...activeConversation,
      lastMessage: {
        content: newMessage,
        timestamp: 'Just now',
        isFromDoctor: true
      },
      messages: [...activeConversation.messages, updatedMessage]
    };

    // Update the conversations list
    setConversations(conversations.map(conv => 
      conv.id === activeConversation.id ? updatedConversation : conv
    ));
    
    // Update the active conversation
    setActiveConversation(updatedConversation);
    setNewMessage('');

    toast({
      title: "Message sent",
      description: `Your message to ${activeConversation.patient.name} has been sent`
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = (conversation: Conversation) => {
    // Mark all messages as read
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map(msg => ({ ...msg, isRead: true }))
    };

    // Update the conversations list
    setConversations(conversations.map(conv => 
      conv.id === conversation.id ? updatedConversation : conv
    ));
    
    // Set the active conversation
    setActiveConversation(updatedConversation);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (!activeConversation) return;
    
    toast({
      title: `Starting ${type} call`,
      description: `Connecting with ${activeConversation.patient.name}...`
    });
    
    if (type === 'video') {
      navigate('/video-consultation');
    }
  };

  const handleSchedule = () => {
    if (!activeConversation) return;
    
    toast({
      title: "Schedule appointment",
      description: `Opening scheduler for ${activeConversation.patient.name}`
    });
    
    navigate('/doctor/appointments');
  };

  const handleViewProfile = () => {
    if (!activeConversation) return;
    
    toast({
      title: "Patient profile",
      description: `Viewing ${activeConversation.patient.name}'s profile`
    });
    
    navigate('/doctor/health-records');
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your patients securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations list */}
        <Card className="border-0 shadow-md lg:col-span-1">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b px-2">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1 relative">
                    Unread
                    {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0) > 0 && (
                      <Badge className="ml-1 bg-primary text-primary-foreground">
                        {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Clock className="h-8 w-8 animate-pulse text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <p className="text-muted-foreground">No conversations found</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredConversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                          onClick={() => selectConversation(conversation)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                {conversation.patient.avatar ? (
                                  <AvatarImage src={conversation.patient.avatar} alt={conversation.patient.name} />
                                ) : (
                                  <AvatarFallback>{conversation.patient.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              {conversation.patient.lastSeen === 'Online' && (
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <p className="font-medium truncate">{conversation.patient.name}</p>
                                {conversation.lastMessage && (
                                  <p className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</p>
                                )}
                              </div>
                              {conversation.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage.isFromDoctor && 'You: '}
                                  {conversation.lastMessage.content}
                                </p>
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="ml-1">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="unread" className="m-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Clock className="h-8 w-8 animate-pulse text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                  ) : filteredConversations.filter(c => c.unreadCount > 0).length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <p className="text-muted-foreground">No unread messages</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredConversations
                        .filter(c => c.unreadCount > 0)
                        .map((conversation) => (
                          <div 
                            key={conversation.id}
                            className={`p-4 cursor-pointer hover:bg-muted/50 ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                            onClick={() => selectConversation(conversation)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  {conversation.patient.avatar ? (
                                    <AvatarImage src={conversation.patient.avatar} alt={conversation.patient.name} />
                                  ) : (
                                    <AvatarFallback>{conversation.patient.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                {conversation.patient.lastSeen === 'Online' && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <p className="font-medium truncate">{conversation.patient.name}</p>
                                  {conversation.lastMessage && (
                                    <p className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</p>
                                  )}
                                </div>
                                {conversation.lastMessage && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.lastMessage.isFromDoctor && 'You: '}
                                    {conversation.lastMessage.content}
                                  </p>
                                )}
                              </div>
                              <Badge>{conversation.unreadCount}</Badge>
                            </div>
                          </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Chat area */}
        <Card className="border-0 shadow-md lg:col-span-2 flex flex-col">
          {!activeConversation ? (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a patient conversation from the list to start messaging
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {activeConversation.patient.avatar ? (
                      <AvatarImage src={activeConversation.patient.avatar} alt={activeConversation.patient.name} />
                    ) : (
                      <AvatarFallback>{activeConversation.patient.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{activeConversation.patient.name}</CardTitle>
                    <CardDescription>
                      {activeConversation.patient.lastSeen && (
                        <span className="flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full ${activeConversation.patient.lastSeen === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {activeConversation.patient.lastSeen}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleStartCall('audio')}>
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleStartCall('video')}>
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleSchedule}>
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleViewProfile}>
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderType === 'doctor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.senderType === 'doctor' ? 'flex-row-reverse' : ''}`}>
                        {message.senderType === 'patient' && (
                          <Avatar className="h-8 w-8">
                            {message.avatar ? (
                              <AvatarImage src={message.avatar} alt={message.sender} />
                            ) : (
                              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                        )}
                        <div>
                          <div 
                            className={`rounded-lg p-3 ${
                              message.senderType === 'doctor' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-center">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <CardFooter className="border-t p-4">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend} 
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DoctorMessages;
