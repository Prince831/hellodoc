import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CallType = "voice" | "video";

export interface CallInvite {
  roomId: string;
  callType: CallType;
  conversationId?: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
}

type CallEvent = "invite" | "accept" | "decline" | "cancel";

const userChannel = (userId: string) => `calls:${userId}`;

/**
 * Send a one-off call-control event to another user's personal call channel.
 * A short-lived channel is used because Supabase only allows broadcasting on a
 * channel this client is subscribed to.
 */
async function emit(toUserId: string, event: CallEvent, payload: unknown) {
  const channel = supabase.channel(userChannel(toUserId), {
    config: { broadcast: { self: false, ack: true } },
  });

  await new Promise<void>((resolve) => {
    channel.subscribe((state) => {
      if (state === "SUBSCRIBED") resolve();
      if (state === "CHANNEL_ERROR" || state === "TIMED_OUT" || state === "CLOSED") resolve();
    });
  });

  await channel.send({ type: "broadcast", event, payload });
  supabase.removeChannel(channel);
}

interface Handlers {
  /** The remote party picked up. */
  onAccept?: (roomId: string) => void;
  /** The remote party rejected the call. */
  onDecline?: (roomId: string) => void;
  /** The caller gave up before we answered. */
  onCancel?: (roomId: string) => void;
}

/**
 * Ringing / call-control signalling. Each user listens on their own channel and
 * receives invites, accepts, declines and cancels from the other participant.
 */
export function useCallSignaling(currentUserId: string | null, handlers: Handlers = {}) {
  const [incoming, setIncoming] = useState<CallInvite | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(userChannel(currentUserId), { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "invite" }, ({ payload }) => {
        setIncoming(payload as CallInvite);
      })
      .on("broadcast", { event: "cancel" }, ({ payload }) => {
        const { roomId } = payload as { roomId: string };
        setIncoming((cur) => (cur?.roomId === roomId ? null : cur));
        handlersRef.current.onCancel?.(roomId);
      })
      .on("broadcast", { event: "accept" }, ({ payload }) => {
        handlersRef.current.onAccept?.((payload as { roomId: string }).roomId);
      })
      .on("broadcast", { event: "decline" }, ({ payload }) => {
        handlersRef.current.onDecline?.((payload as { roomId: string }).roomId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const ring = useCallback((toUserId: string, invite: CallInvite) => {
    void emit(toUserId, "invite", invite);
  }, []);

  const cancel = useCallback((toUserId: string, roomId: string) => {
    void emit(toUserId, "cancel", { roomId });
  }, []);

  const accept = useCallback((toUserId: string, roomId: string) => {
    setIncoming(null);
    void emit(toUserId, "accept", { roomId });
  }, []);

  const decline = useCallback((toUserId: string, roomId: string) => {
    setIncoming(null);
    void emit(toUserId, "decline", { roomId });
  }, []);

  const dismiss = useCallback(() => setIncoming(null), []);

  return { incoming, ring, cancel, accept, decline, dismiss };
}
