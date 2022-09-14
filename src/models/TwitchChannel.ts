const mongoose = require('mongoose');
import { ITwitchChannel } from "../interfaces/TwitchChannel";
import { Schema } from 'mongoose';

const TwitchChannelSchema = new Schema<ITwitchChannel>({
    id: Number,
    login: String,
    display_name: String,
    is_live: Boolean,
    stream_title: String,
    stream_game: String,
});

const TwitchChannel = mongoose.model('twitch_channel', TwitchChannelSchema);
module.exports = TwitchChannel;