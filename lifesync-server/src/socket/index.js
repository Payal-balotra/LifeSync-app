// const { Server } = require("socket.io");

// const spaceUsers = {}; // { spaceId: Map<userId, { socketId, name }> }

//  const  setupSocket=(server)=>
//    {
//   console.log("🔥 setupSocket called");

//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5176",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("🟢 Socket connected:", socket.id);

//     // ---------------- JOIN SPACE ----------------
//     socket.on("join-space", ({ spaceId, user }) => {
//        if (socket.rooms.has(spaceId)) return;
//       console.log("👥 join-space:", spaceId, user.name);
//       socket.join(spaceId);

//       if (!spaceUsers[spaceId]) {
//         spaceUsers[spaceId] = new Map();
//       }

//       // dedupe by userId
//       spaceUsers[spaceId].set(socket.id, {
//         socketId: socket.id,
//         userId: user.id,
//         name: user.name,
//       });

//       io.to(spaceId).emit(
//         "presence-update",
//         Array.from(spaceUsers[spaceId].values())
//       );
//     });

//     // ---------------- CONTENT ----------------
//    socket.on("content-change", ({ spaceId, content, senderId }) => {
//   socket.to(spaceId).emit("content-update", {
//     content,
//     senderId,
//   });
// })

//     // ---------------- TYPING ----------------
//     socket.on("typing:start", ({ spaceId, user }) => {
//       socket.to(spaceId).emit("typing:update", {
//         userId: user.id,
//         name: user.name,
//         isTyping: true,
//       });
//     });

//     socket.on("typing:stop", ({ spaceId, user }) => {
//       socket.to(spaceId).emit("typing:update", {
//         userId: user.id,
//         name: user.name,
//         isTyping: false,
//       });
//     });

//   // ---------------- CURSOR ----------------
//   socket.on("cursor:update", ({ spaceId, cursor, user }) => {
//     console.log("🖥️ server received cursor:update", {
//       spaceId,
//       cursor,
//       user,
//     });
//     socket.to(spaceId).emit("cursor:update", {
//       userId: user.id,
//       name: user.name,
//       cursor,
//     });
//   });

//   // ---------------- DISCONNECT ----------------
//     socket.on("disconnect", () => {
//   Object.keys(spaceUsers).forEach((spaceId) => {
//     const usersMap = spaceUsers[spaceId];

//     if (usersMap.has(socket.id)) {
//       usersMap.delete(socket.id);

//       io.to(spaceId).emit(
//         "presence-update",
//         Array.from(usersMap.values())
//       );
//     }
//   });

//   console.log("🔴 Socket disconnected:", socket.id);
// });
//   });
// }

// module.exports = setupSocket