import { ITwitchChannel } from "../../interfaces/TwitchChannel";
import axios from "axios";
import { TwitchChannel } from "../classes/TwitchChannel";
const TwitchChannelSchema = require("../models/TwitchChannel");

export class TwitchChannels {
  
    constructor(){

    }

    async refreshStreamers(){
        const dbChannels = await TwitchChannelSchema.find().exec();
        dbChannels.forEach(dbChannel => {
            const channel = new TwitchChannel(dbChannel);
            
        })
    }



    getAll(){
        return TwitchChannelSchema.find().exec();
    }
}
