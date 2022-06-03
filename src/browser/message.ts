export enum MessageType {
    UPDATE,
    REMOVE,
    ERROR
}
export interface HotBunMessage {
    type: MessageType
    //message: MessageType extends MessageType.UPDATE ? UpdateMessage | string// UpdateMessage  | ErrorMassage | RemoveMessage
}

export interface UpdateMessage extends HotBunMessage {
    type: MessageType.UPDATE
    file: string
    data: string
}
export interface ErrorMassage extends HotBunMessage {
    type: MessageType.ERROR
    error: string
}
export interface RemoveMessage extends HotBunMessage {
    type: MessageType.REMOVE
    file: string
}