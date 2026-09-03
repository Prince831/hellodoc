import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { useRoomChat } from "@/hooks/useRoomChat";

interface VideoChatProps {
  /** Display name of the remote participant. */
  doctorName: string;
  /** Shared consultation room id — chat rides the same room. */
  roomId: string;
  /** Auth user id of the local participant. */
  peerId: string;
  /** Display name used for messages this user sends. */
  selfName?: string;
}

const VideoChat = ({ doctorName, roomId, peerId, selfName = "You" }: VideoChatProps) => {
  const { messages, send } = useRoomChat(roomId, peerId, selfName);
  const [newMessage, setNewMessage] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    send(newMessage);
    setNewMessage("");
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="pt-6 text-center text-sm text-muted-foreground">
            Messages sent here stay in this consultation only.
          </p>
        )}
        <AnimatePresence>
          {messages.map((message) => {
            const isSelf = message.senderId === peerId;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[75%] items-start gap-2 ${isSelf ? "flex-row-reverse" : ""}`}
                >
                  {!isSelf && (
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {doctorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p
                      className={`mt-1 text-xs text-muted-foreground ${isSelf ? "text-right" : "text-left"}`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 border-t p-4">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default VideoChat;
