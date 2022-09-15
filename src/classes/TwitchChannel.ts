import { ITwitchChannel } from "../interfaces/TwitchChannel";
import axios from "axios";
const TwitchChannelSchema = require("../models/TwitchChannel");

export class TwitchChannel {
    private loginLookup: string;
    channel;
    private channelId = 1;

    constructor(channel: string | ITwitchChannel) {
        console.log(typeof channel);
        this.channel = channel;
    }

    async loadStreamer(login: string) {
        // Try and find the streamer info in the DB
        const dbStreamer = await TwitchChannelSchema.findOne({
            login: login,
        }).exec();

        if (dbStreamer) {
            console.log("Streamer found in DB");
            this.channel = dbStreamer;
            await this.getStreamInfo();
            return true;
        }

        console.log("Streamer missing in DB. Will populate");
        // Get the streamer by name
        let streamerInfo = await this.getBroadcasterID(login);
        if (!streamerInfo.data.length) {
            // Streamer lookup failed
            console.log(
                `Streamer '${login}' is not a valid Twitch username`
            );
            return false;
        }

        streamerInfo = streamerInfo.data[0];

        const channel = new TwitchChannelSchema({
            id: streamerInfo.id,
            login: streamerInfo.login,
            display_name: streamerInfo.display_name,
        });

        // Get the streamer stream info
        const streamerStream = await this.getChannelFromAPI(streamerInfo.id);

        if (!streamerStream.data.length) {
            console.log("Unable to find stream information");
            return false;
        }
        
        channel.stream_title = streamerStream.data[0].title;
        channel.stream_game = streamerStream.data[0].game_name;
        await channel.save();

        this.channel = channel;

        await this.getStreamInfo();
    }

    byChannel(channel: ITwitchChannel){
        this.channel = channel;
    }

    async byName(channelName: String) {
        const dbStreamer = await TwitchChannelSchema.findOne({
            name: channelName,
        }).exec();
        return dbStreamer;
    }

    async getBroadcasterID(channelName: string) {
        return await axios
            .get("https://api.twitch.tv/helix/users?login=" + channelName, {
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                    Authorization: "Bearer " + process.env.TWITCH_CLIENT_SECRET,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                return err;
            });
    }

    async getChannelFromAPI(broadcasterId) {
        const responseData = await axios
            .get(
                "https://api.twitch.tv/helix/channels?broadcaster_id=" +
                    broadcasterId,
                {
                    headers: {
                        "Client-Id": process.env.TWITCH_CLIENT_ID,
                        Authorization:
                            "Bearer " + process.env.TWITCH_CLIENT_SECRET,
                    },
                }
            )
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                return err;
            });

        return responseData;
    }

    static async getAllChannels(){
        return await TwitchChannelSchema.find({}).exec();
    }
  

    async getStreamInfo() {
        return await axios
            .get(
                "https://api.twitch.tv/helix/streams?user_id=" +
                    this.channel.id,
                {
                    headers: {
                        "Client-Id": process.env.TWITCH_CLIENT_ID,
                        Authorization:
                            "Bearer " + process.env.TWITCH_CLIENT_SECRET,
                    },
                }
            )
            .then((response) => {
                const responseData = response.data;
                const isLive = responseData.data.length > 0;
                this.channel.is_live = isLive;
                this.channel.save();
                return isLive;
            })
            .catch((err) => {
                return false;
            });
    }
}
