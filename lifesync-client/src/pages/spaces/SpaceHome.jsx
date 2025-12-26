import React,{ useEffect, useState } from "react";
import { socket } from "../../services/socket";
import useAuthStore from "../../store/authStore";
import { useParams } from "react-router";
const SpaceHome = () => {
    const { spaceId } = useParams();
  console.log("spaceID",spaceId)
  const { user } = useAuthStore();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!spaceId || !user) return;
  console.log("🚪 emitting join-space", spaceId);
    // join space room
    socket.emit("join-space", {
      spaceId,
      user: {
        id: user._id,
        name: user.name,
      },
    });

    // listen for content updates
    socket.on("content-update", (newContent) => {
      console.log("socket connected")
      setContent(newContent);
    });

    return () => {
      socket.off("content-update");
    };
  }, [spaceId, user]);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
  console.log("✍️ emitting content-change", value);

    socket.emit("content-change", {
      spaceId,
      content: value,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Shared Notes</h1>
      <p className="text-sm text-slate-500 mb-4">
        Start collaborating in real time.
      </p>

      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Start typing…"
        className="border rounded-xl h-[400px] w-full p-4 resize-none outline-none"
      />
    </div>
  );
};

export default SpaceHome;
