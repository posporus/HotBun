import { MessageType } from './browser/message.ts'
import { Crumb } from './Crumb.ts'
import type { HotBunMessage, UpdateMessage, RemoveMessage, ErrorMessage } from './browser/message.ts'

/**
 * Sends an update message to the browser.
 * @param socket 
 * @param crumb 
 */
export const sendUpdate = (socket: WebSocket, crumb: Crumb) => {
    const file = crumb.file
    crumb.pack().then(({code,dependencies}) => {
        const message: UpdateMessage = {
            type: MessageType.UPDATE,
            file,
            code,
            dependencies
        }
        shipMessage(socket, message)
    })/* .catch(err=>{
        //
    }) */
}
/**
 * Sends a remove message to the browser.
 * @param socket 
 * @param file 
 */
export const sendRemove = (socket: WebSocket, file: string) => {
    const message: RemoveMessage = {
        type: MessageType.REMOVE,
        file
    }
    shipMessage(socket, message)
}

/**
 * Sends an error message to the browser.
 * @param socket 
 * @param error 
 */
export const sendError = (socket: WebSocket, error: Error) => {
    const message:ErrorMessage = {
        type: MessageType.ERROR,
        error
    }
    shipMessage(socket,message)
}

const shipMessage = (socket: WebSocket, obj: HotBunMessage) => {
    socket.send(JSON.stringify(obj))
}