const { Server } = require("socket.io");

function setupSocket(server) {
  console.log("🔥 setupSocket called");

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5176",
      credentials: true,
    },
  });

 io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join-space", ({ spaceId, user }) => {
    console.log("👥 join-space:", spaceId, user?.name);
    socket.join(spaceId);
  });

  socket.on("content-change", ({ spaceId, content }) => {
    console.log("✍️ content-change:", spaceId, content);
    socket.to(spaceId).emit("content-update", content);
  });
});
}

module.exports = setupSocket;
