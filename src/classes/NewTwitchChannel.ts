import { ITwitchChannel } from "../interfaces/TwitchChannel";
import axios from "axios";
import {
    INewTwitchChannel,
    INewTwitchChannelStreamerIdentifiers,
    TwitchChannel,
} from "../interfaces/NewTwitchChannel";
import { URLHelper } from "../helpers/URLHelper";
const TwitchChannelSchema = require("../models/TwitchChannel");

// Params used for the API requests. All of the endpoints
// below allow upto 100 user identifiers in a single request
// ====================================
// Get Channel (ID Only)
// Get Stream (ID and Username)
// Get User (ID and Username)

export class NewTwitchChannel {
    private channel: INewTwitchChannel | any;

    async byUsername(username: INewTwitchChannel["login"]) {
        // Check to see if user exists in DB
        console.log(`[ID] Will try and find ${username} in database`);
        const result = await TwitchChannelSchema.findOne({
            login: username,
        }).exec();

        // If found, store in class
        if (result) {
            console.log(`[ID] Found ${username} in database`);
            this.channel = result;
            this.refreshLiveStatus();
            return;
        }

        console.log(`[ID] Could not find ${username}. Will query API`);
        const apiResult = await this.getUserInformation(null, username);

        if (!apiResult) {
            console.log(
                `[ID] Unable to find ${username} via the API. Please check the spelling`
            );
        }
        console.log(`[ID] ${username} found via API. Updating database`);
        const newStreamer = await TwitchChannelSchema.create(apiResult);
        this.channel = newStreamer;

        // If not found
        this.refreshLiveStatus();
    }
    byId(id: INewTwitchChannel["id"]) {
        // Check to see if user exists in DB
    }

    async refreshLiveStatus() {
        const apiResult = await this.getStreamInformation(this.channel.login);
        if (!!apiResult !== this.channel.is_live) {
            console.log(
                this.channel.display_name +
                    " has " +
                    (apiResult ? "started" : "stopped") +
                    " streaming"
            );
        }
        this.channel.is_live = !!apiResult;
        this.channel.save();
    }

    async getChannelInformation() {}
    private async getStreamInformation(username?: string) {
        const params = URLHelper.objectToURLParams({ user_login: username });
        return await axios
            .get("https://api.twitch.tv/helix/streams?" + params, {
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                    Authorization: "Bearer " + process.env.TWITCH_CLIENT_SECRET,
                },
            })
            .then((response) => {
                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.length > 0
                ) {
                    return response.data.data[0];
                }
                return false;
            })
            .catch((err) => {
                return false;
            });
    }

    private async getUserInformation(id?: number, username?: string) {
        const params = URLHelper.objectToURLParams({ id: id, login: username });
        return await axios
            .get("https://api.twitch.tv/helix/users?" + params, {
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                    Authorization: "Bearer " + process.env.TWITCH_CLIENT_SECRET,
                },
            })
            .then((response) => {
                if (!response.data.data.length) {
                    return false;
                }
                return response.data.data[0];
            })
            .catch((err) => {
                return false;
            });
    }
}
