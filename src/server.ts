import { createEvalAwarePartialHost } from "ts-node/dist/repl";
import { NewTwitchChannel } from "./classes/NewTwitchChannel";
import { TwitchChannels } from "./classes/old/TwitchChannels";
const TwitchChannelSchema = require("./models/TwitchChannel");

// Dependencies
const axios = require("axios");
const express = require("express");
const tmi = require("tmi.js");
const { createServer } = require("https");
const { Server } = require("socket.io");
var fs = require("fs");
const mongoose = require("mongoose");

// Initialize MongoDB connection
mongoose
    .connect(
        "mongodb://" +
            process.env.DB_HOST +
            ":" +
            process.env.DB_PORT +
            "/" +
            process.env.DB_NAME
    )
    .catch((e) => {
        console.log(e);
    });

// Initialize express
const app = express();

// Intialize web server with certificate
const httpServer = createServer(
    {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.cert"),
    },
    app
);

// Allow any origin with SocketIO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// Allow any origin with express
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, DELETE, OPTIONS"
    );
    next();
});

setInterval(() => {
    const allStreamers = TwitchChannelSchema.find().then((result) => {
        result.forEach((item) => {
            const a = new NewTwitchChannel();
            a.byUsername(item.login);
        });
    });
}, 5000);

// For every channel, check live status once every 3 seconds
// console.log('Starting regular stream state changes');
// setInterval(async () => {
//     const channels = await TwitchChannel.getAllChannels();
//     channels.forEach(async (channel) => {
//         const twitchChannel = new TwitchChannel('');
//         twitchChannel.channel = channel;

//         const previousLiveState = channel.is_live;
//         const newLiveState = await twitchChannel.isChannelLive();
//         if(previousLiveState !== newLiveState){
//             console.log(channel.display_name + ' has ' + (newLiveState ? 'started' : 'stopped') + ' streaming');
//         }
//     });
// },3000);

app.get("/streamer/:streamer", async (req, res) => {
    //const channel = new TwitchChannel(req.params.streamer);
    //await channel.loadStreamer();
    //res.send(JSON.stringify(channel.channel));
});

httpServer.listen(2083);
