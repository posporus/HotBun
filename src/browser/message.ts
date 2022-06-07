export enum MessageType {
    UPDATE,
    REMOVE,
    ERROR
}
export interface HotBunMessage {
    type: MessageType
}

export interface UpdateMessage extends HotBunMessage {
    type: MessageType.UPDATE
    file: string
    dependencies:string[]
    code: string
}
export interface ErrorMessage extends HotBunMessage {
    type: MessageType.ERROR
    error: Error
}
export interface RemoveMessage extends HotBunMessage {
    type: MessageType.REMOVE
    file: string
}