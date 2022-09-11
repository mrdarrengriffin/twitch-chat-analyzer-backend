const express = require("express");
const dotenv = require("dotenv");
const tmi = require('tmi.js');
const { createServer } = require("https");
const { Server } = require("socket.io");
var fs = require( 'fs' );

dotenv.config();


const app = express();
const httpServer = createServer({
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert")
},app);
const io = new Server(httpServer, { cors: {
  origin: "https://localhost:8000",
} });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

function getActiveRooms(io) {

  const arr = Array.from(io.sockets.adapter.rooms);

  const filtered = arr.filter(room => !room[1].has(room[0]))

  const res = filtered.map(i => i[0]);
  return res;
}

var rooms = [];


io.on("connection", (socket) => {
  socket.on('streamer', function(streamer){
    console.log(socket.id, streamer);
    socket.join(streamer);
    if(!rooms.includes(streamer)){
      rooms.push(streamer);
      registerChat(streamer);
    }
  })
});



let chats = [];

function registerChat(streamer){
  console.log('Chat registered: ' + streamer);
  chats[streamer] = new tmi.Client({
    channels: [ streamer ]
  });
  
  chats[streamer].connect();
  
  chats[streamer].on('message', (channel, tags, message, self) => {
    io.to(channel.replace('#','')).emit('chat', {channel: channel.replace('#', ''), tags: tags, message: message});   
  });
}

httpServer.listen(3000);




