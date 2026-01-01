// server.js
const http = require("http");
const app = require("./src/app");
const setupSocket = require("./src/socket/index")
const PORT = process.env.PORT || 5000;

//  create HTTP server
const server = http.createServer(app);

//  attach socket.io
setupSocket(server);

//  listen on server (NOT app)
server.listen(PORT, () => {
  console.log(` LifeSync server running on port ${PORT}`);
});
