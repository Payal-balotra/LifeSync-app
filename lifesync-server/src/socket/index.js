const { setSocketInstance } = require("../utils/activityLogger");
const {Server} = require("socket.io")
function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  setSocketInstance(io); 

  io.on("connection", (socket) => {
    socket.on("join-space", ({ spaceId }) => {
      socket.join(spaceId);
    });
  });
}

module.exports = setupSocket;
