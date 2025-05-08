
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  Clock,
  Eye,
  MessageSquare,
  Search,
  Shield,
  Trash2,
  User,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  flagged: boolean;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    role: string;
  };
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [messageToFlag, setMessageToFlag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from the messages table with sender and receiver details
      // For now, we'll use mock data
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hello Dr. Johnson, I've been experiencing headaches lately. Can I schedule an appointment?",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          flagged: false,
          sender: {
            id: "p1",
            name: "John Smith",
            role: "patient",
          },
          receiver: {
            id: "d1",
            name: "Dr. Sarah Johnson",
            role: "doctor",
          },
        },
        {
          id: "2",
          content: "Hi John, I'm available tomorrow at 2 PM. Would that work for you?",
          created_at: new Date(Date.now() - 3500000).toISOString(),
          read: true,
          flagged: false,
          sender: {
            id: "d1",
            name: "Dr. Sarah Johnson",
            role: "doctor",
          },
          receiver: {
            id: "p1",
            name: "John Smith",
            role: "patient",
          },
        },
        {
          id: "3",
          content: "Dr. Chen, my medication doesn't seem to be helping. I'm still experiencing the same symptoms.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read: false,
          flagged: true,
          sender: {
            id: "p2",
            name: "Emma Wilson",
            role: "patient",
          },
          receiver: {
            id: "d2",
            name: "Dr. Michael Chen",
            role: "doctor",
          },
        },
        {
          id: "4",
          content: "Hello Dr. Wong, I need a refill for my prescription. Can you help me with that?",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          flagged: false,
          sender: {
            id: "p3",
            name: "Robert Brown",
            role: "patient",
          },
          receiver: {
            id: "d3",
            name: "Dr. Lisa Wong",
            role: "doctor",
          },
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message: Message) => {
    setViewingMessage(message);
    setDialogOpen(true);
  };

  const confirmFlagMessage = (messageId: string) => {
    setMessageToFlag(messageId);
    setConfirmationDialogOpen(true);
  };

  const handleFlagMessage = async () => {
    if (!messageToFlag) return;
    
    try {
      // In a real application, this would update the message's flagged status in the database
      setMessages(
        messages.map(m => 
          m.id === messageToFlag ? { ...m, flagged: !m.flagged } : m
        )
      );
      
      const message = messages.find(m => m.id === messageToFlag);
      const action = message?.flagged ? "unflagged" : "flagged";
      
      toast({
        title: "Success",
        description: `Message ${action} successfully.`,
      });
      
      setConfirmationDialogOpen(false);
      setMessageToFlag(null);
    } catch (error) {
      console.error("Error flagging message:", error);
      toast({
        title: "Error",
        description: "Failed to flag message.",
        variant: "destructive",
      });
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "doctor":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            Doctor
          </Badge>
        );
      case "patient":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Patient
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {role}
          </Badge>
        );
    }
  };

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Message Monitoring</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages by content or user..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading messages...
                  </TableCell>
                </TableRow>
              ) : filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message.id} className={message.flagged ? "bg-red-50/10" : ""}>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{message.sender.name}</div>
                          <div className="text-xs">{getUserRoleBadge(message.sender.role)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{message.receiver.name}</div>
                          <div className="text-xs">{getUserRoleBadge(message.receiver.role)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{message.content}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {message.read ? (
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        )}
                        <span>
                          {message.read ? "Read" : "Unread"}
                        </span>
                        {message.flagged && (
                          <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => confirmFlagMessage(message.id)}
                        >
                          {message.flagged ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {message.flagged ? "Unflag" : "Flag"}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Message Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          
          {viewingMessage && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                <div className="flex items-center mt-1">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(viewingMessage.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">From</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingMessage.sender.name}</div>
                    <div className="text-xs">{getUserRoleBadge(viewingMessage.sender.role)}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">To</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingMessage.receiver.name}</div>
                    <div className="text-xs">{getUserRoleBadge(viewingMessage.receiver.role)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Message</div>
                <div className="mt-1 rounded-md border p-4">
                  {viewingMessage.content}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1 flex items-center">
                    {viewingMessage.read ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>Read</span>
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Unread</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Flag Status</div>
                  <div className="mt-1 flex items-center">
                    {viewingMessage.flagged ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Flagged</span>
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>Not Flagged</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {viewingMessage && (
              <Button
                variant={viewingMessage.flagged ? "outline" : "destructive"}
                onClick={() => {
                  setDialogOpen(false);
                  confirmFlagMessage(viewingMessage.id);
                }}
              >
                {viewingMessage.flagged ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Remove Flag
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Flag Message
                  </>
                )}
              </Button>
            )}
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {messages.find(m => m.id === messageToFlag)?.flagged
                ? "Are you sure you want to remove the flag from this message?"
                : "Are you sure you want to flag this message for review?"}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={messages.find(m => m.id === messageToFlag)?.flagged ? "outline" : "destructive"}
              onClick={handleFlagMessage}
            >
              {messages.find(m => m.id === messageToFlag)?.flagged ? "Remove Flag" : "Flag Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MessagesPage;
