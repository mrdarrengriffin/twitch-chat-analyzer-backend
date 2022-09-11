export interface IChatMessage {
    channel: string;
    tags:    IChatMessageTags;
    message: string;
}

export interface IChatMessageTags {
    "badge-info": {
        subscribers: string;
    };
    badges:             {
        subscribers: string;
    };
    color:               string;
    "display-name":      string;
    emotes:              null;
    "first-msg":         boolean;
    flags:               null;
    id:                  string;
    mod:                 boolean;
    "returning-chatter": boolean;
    "room-id":           string;
    subscriber:          boolean;
    "tmi-sent-ts":       string;
    turbo:               boolean;
    "user-id":           string;
    "user-type":         null;
    "emotes-raw":        null;
    "badge-info-raw":    string;
    "badges-raw":        string;
    username:            string;
    "message-type":      string;
}
