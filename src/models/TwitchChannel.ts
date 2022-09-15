const mongoose = require('mongoose');
import { ITwitchChannel } from "../interfaces/TwitchChannel";
import { Schema } from 'mongoose';

const TwitchChannelSchema = new Schema({
    id: Number,
    login: String,
    display_name: String,
    type: String,
    is_live: Boolean,
    broadcaster_type: String,
    description: String,
    profile_image_url: String,
    offline_image_url: String,
    view_count: Number,
    email: String,
    created_at: Date
});

const TwitchChannel = mongoose.model('twitch_channel', TwitchChannelSchema);
module.exports = TwitchChannel;