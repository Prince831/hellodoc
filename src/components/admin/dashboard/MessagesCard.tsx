
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Check, X } from "lucide-react";

interface Message {
  id: number;
  from: string;
  to: string;
  message: string;
  time: string;
  read: boolean;
}

interface MessagesCardProps {
  messages: Message[];
}

export const MessagesCard = ({ messages }: MessagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Recent Messages
        </CardTitle>
        <CardDescription>
          Recent communications between patients and doctors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start p-3 rounded-lg ${
                msg.read ? "bg-muted/50" : "bg-muted"
              }`}
            >
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${msg.from}`} alt={msg.from} />
                <AvatarFallback>{msg.from.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-medium">
                    {msg.from}
                    <span className="text-muted-foreground ml-2 text-xs">to {msg.to}</span>
                  </h4>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{msg.message}</p>
                <div className="mt-2 flex">
                  <Badge
                    variant={msg.read ? "outline" : "default"}
                    className="text-xs"
                  >
                    {msg.read ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                    {msg.read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
