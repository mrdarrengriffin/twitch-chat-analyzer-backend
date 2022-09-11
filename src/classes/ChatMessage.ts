import { IChatMessage } from "../interfaces/ChatMessage";

class ChatMessage {

    private messageInstance: IChatMessage;

    constructor(messageInstance: IChatMessage){
        this.messageInstance = messageInstance;
    }


    getUserName() : string {
        return this.messageInstance.message;
    }
    getMessage(){}
    getTimestamp(){}
}