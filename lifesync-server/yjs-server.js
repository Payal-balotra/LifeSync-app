const http =  require("http");
const WebSocket = require("ws");
const utils = require("y-websocket/bin/utils");


const server = http.createServer();
const wss = new WebSocket.Server({server});


wss.on("connection",(conn,req)=>{
    utils.setupWSConnection(conn,req);
})

server.listen(1234,()=>{
    console.log(" Yjs WebSocket server running on ws://localhost:1234");
})