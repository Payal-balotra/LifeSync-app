import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

export default function useSpaceSocket({
  spaceId,
  events = {},
  enabled = true,
}) {
  useEffect(() => {
    if (!spaceId || !enabled) return;

    // join space room
    socket.emit("join-space", { spaceId });

    // register events
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [spaceId, enabled, events]);

  return socket;
}
