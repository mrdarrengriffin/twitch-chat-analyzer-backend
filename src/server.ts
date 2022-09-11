const express = require("express");
const tmi = require('tmi.js');
const { createServer } = require("https");
const { Server } = require("socket.io");
var fs = require( 'fs' );

const app = express();
const httpServer = createServer({
  key: fs.readFileSync("/var/www/home.mrdarrengriffin.com.key"),
  cert: fs.readFileSync("/var/www/home.mrdarrengriffin.com.pem")
},app);
const io = new Server(httpServer, { cors: {
  origin: "https://sandbox.mrdarrengriffin.com"
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





















httpServer.listen(8443);




