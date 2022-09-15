import { ITwitchChannel } from "../interfaces/TwitchChannel";
import axios from "axios";
import { INewTwitchChannelStreamerIdentifiers } from "../interfaces/NewTwitchChannel";
const TwitchChannelSchema = require("../models/TwitchChannel");

// Params used for the API requests. All of the endpoints
// below allow upto 100 user identifiers in a single request
// ====================================
// Get Channel (ID Only)
// Get Stream (ID and Username)
// Get User (ID and Username)

export class TwitchChannel {
   constructor(streamer: INewTwitchChannelStreamerIdentifiers){
    // If ID is provided, 
    if(!streamer.id){
        
    }


   }

   getChannelInformation(){}
   getStreamInformation(){}
   getUser(username: string){

   }
}
