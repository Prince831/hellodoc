import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

/**
 * Ephemeral in-call chat. Messages travel over the same Realtime infrastructure
 * as the call signalling and live only for the duration of the session.
 */
export function useRoomChat(roomId: string | null, peerId: string | null, senderName: string) {
  const [messages, setMessages] = useState<RoomChatMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const nameRef = useRef(senderName);
  nameRef.current = senderName;

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);

    const channel = supabase
      .channel(`room-chat:${roomId}`, { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "message" }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as RoomChatMessage]);
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId]);

  const send = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !peerId) return;

      const message: RoomChatMessage = {
        id: `${peerId}-${Date.now()}`,
        senderId: peerId,
        senderName: nameRef.current,
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
      channelRef.current?.send({ type: "broadcast", event: "message", payload: message });
    },
    [peerId],
  );

  return { messages, send };
}
