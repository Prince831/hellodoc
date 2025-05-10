
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, Mic, MicOff, Camera, CameraOff, 
  Phone, MessageSquare, FileText, Clock, 
  Calendar, Settings, Send, User
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: string;
}

interface CallPatient {
  id: string;
  name: string;
  avatar?: string;
  reason: string;
  scheduledTime: string;
}

const DoctorVideoConsultation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [upcomingCalls, setUpcomingCalls] = useState<CallPatient[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentPatient: CallPatient | null = isInCall ? 
    {
      id: "p1",
      name: "John Smith",
      avatar: "https://i.pravatar.cc/150?img=1",
      reason: "Follow-up consultation for medication adjustment",
      scheduledTime: "10:00 AM - 10:30 AM"
    } : null;

  useEffect(() => {
    // Fetch upcoming calls
    setUpcomingCalls([
      {
        id: "p1",
        name: "John Smith",
        avatar: "https://i.pravatar.cc/150?img=1",
        reason: "Follow-up consultation for medication adjustment",
        scheduledTime: "10:00 AM - 10:30 AM"
      },
      {
        id: "p2",
        name: "Maria Garcia",
        avatar: "https://i.pravatar.cc/150?img=3",
        reason: "Initial consultation - recurring headaches",
        scheduledTime: "11:15 AM - 11:45 AM"
      },
      {
        id: "p3",
        name: "Robert Johnson",
        reason: "Prescription renewal discussion",
        scheduledTime: "2:30 PM - 3:00 PM"
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isInCall) {
      // Initialize camera when in call
      const setupCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: isCameraOn, 
            audio: isMicOn 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          toast({
            title: "Video consultation started",
            description: "You are now connected with your patient"
          });
        } catch (err) {
          console.error("Error accessing media devices:", err);
          toast({
            title: "Camera access error",
            description: "Could not access your camera or microphone",
            variant: "destructive"
          });
        }
      };
      
      setupCamera();
      
      // Add some initial messages
      if (messages.length === 0) {
        setMessages([
          {
            id: "1",
            sender: 'doctor',
            text: 'Hello John, how are you feeling today?',
            timestamp: '10:01 AM'
          },
          {
            id: "2",
            sender: 'patient',
            text: 'Hello Dr. Johnson. I\'ve been feeling better since the medication change, but still have occasional headaches.',
            timestamp: '10:02 AM'
          }
        ]);
      }
      
      return () => {
        // Cleanup camera
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [isInCall, isCameraOn, isMicOn, toast, messages.length]);

  const toggleMicrophone = () => {
    setIsMicOn(!isMicOn);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicOn;
      });
    }
    
    toast({
      title: isMicOn ? "Microphone off" : "Microphone on",
      description: isMicOn ? "Your microphone has been muted" : "Your microphone is now active"
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn;
      });
    }
    
    toast({
      title: isCameraOn ? "Camera off" : "Camera on",
      description: isCameraOn ? "Your camera has been turned off" : "Your camera is now active"
    });
  };

  const startCall = (patient: CallPatient) => {
    setIsInCall(true);
    toast({
      title: "Starting consultation",
      description: `Connecting with ${patient.name}...`
    });
  };

  const endCall = () => {
    setIsInCall(false);
    toast({
      title: "Call ended",
      description: "The video consultation has been completed"
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const saveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your consultation notes have been saved"
    });
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Video Consultations</h1>
        <p className="text-muted-foreground">Conduct virtual appointments with your patients</p>
      </div>

      {isInCall ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          {/* Main video area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="border-0 shadow-md flex-1">
              <CardHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {currentPatient?.avatar ? (
                        <AvatarImage src={currentPatient.avatar} alt={currentPatient.name} />
                      ) : (
                        <AvatarFallback>{currentPatient?.name.charAt(0) || 'P'}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle>{currentPatient?.name}</CardTitle>
                      <CardDescription>{currentPatient?.reason}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Started at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 border-2 border-white rounded overflow-hidden">
                  {/* This would be the patient's video in a real app */}
                  <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white/70 text-xs">
                    Patient's camera
                  </div>
                </div>
              </CardContent>
              <div className="p-4 bg-card border-t flex items-center justify-center gap-2">
                <Button
                  variant={isMicOn ? "outline" : "destructive"}
                  size="icon"
                  onClick={toggleMicrophone}
                  className="h-12 w-12 rounded-full"
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isCameraOn ? "outline" : "destructive"}
                  size="icon"
                  onClick={toggleCamera}
                  className="h-12 w-12 rounded-full"
                >
                  {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                  className="h-12 w-12 rounded-full"
                >
                  <Phone className="h-5 w-5 rotate-225" />
                </Button>
                <Separator orientation="vertical" className="h-10" />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Appointment Type</p>
                    <p>Follow-up Consultation</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                    <p>30 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Last Visit</p>
                    <p>2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md h-full flex flex-col">
              <CardHeader className="p-4 border-b">
                <Tabs
                  defaultValue="chat"
                  onValueChange={(value) => setActiveTab(value as 'chat' | 'notes')}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="chat" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Notes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-0 flex-1 flex flex-col">
                {activeTab === 'chat' ? (
                  <>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`rounded-lg p-3 max-w-[80%] ${
                                message.sender === 'doctor' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1 text-right">
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full p-4">
                    <Textarea
                      placeholder="Enter consultation notes here..."
                      className="flex-1 min-h-[200px] resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button className="mt-4 self-end" onClick={saveNotes}>
                      Save Notes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Video Consultations</CardTitle>
              <CardDescription>Scheduled virtual appointments with your patients</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingCalls.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Consultations</h3>
                  <p className="text-sm text-muted-foreground mb-4">You don't have any video consultations scheduled.</p>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Check Your Schedule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingCalls.map((patient) => (
                    <Card key={patient.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <Avatar className="h-12 w-12 mr-4">
                          {patient.avatar ? (
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                          ) : (
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{patient.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{patient.scheduledTime}</span>
                          </div>
                          <p className="text-sm mt-1">{patient.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4 mr-1" />
                            Patient Info
                          </Button>
                          <Button size="sm" onClick={() => startCall(patient)}>
                            <Video className="h-4 w-4 mr-1" />
                            Start Call
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Consultation Templates
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Video Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>System Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-green-500" />
                    <span>Camera</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Connected
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Mic className="h-4 w-4 mr-2 text-green-500" />
                    <span>Microphone</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Connected
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.5 12.5a.5.5 0 0 1 1 0v3a.5.5 0 0 1-1 0v-3zm0-5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0v-1zm4.5 4c0 3.04-2.46 5.5-5.5 5.5S5 14.54 5 11.5 7.46 6 10.5 6s5.5 2.46 5.5 5.5zm-5.5-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm8.5 4.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"/>
                    </svg>
                    <span>Internet</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Stable
                  </Badge>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  Run System Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorVideoConsultation;
