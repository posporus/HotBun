/// <reference lib="dom" />
import type { HotBunMessage, UpdateMessage, RemoveMessage, ErrorMassage } from './message.ts'
import { MessageType } from './message.ts'

declare global {
    interface Window {
        crumbs: Record<string, string>
    }

}

const socket = new WebSocket('ws://localhost:8000')
socket.addEventListener('message', e => {
    const message: HotBunMessage = JSON.parse(e.data)
    if (isUpdate(message)) {
        console.log('update', message)
        window.crumbs[message.file] = message.data
        window.eval(message.file)
    }

    if (isError(message)) {
        console.error(message.error)
        //window.crumbs[message.file] = message.data
    }

    if (isRemove(message)) {
        console.info('remove ', message.file)
    }

})

const isUpdate = (message: HotBunMessage): message is UpdateMessage => {
    return message.type === MessageType.UPDATE
}

const isError = (message: HotBunMessage): message is ErrorMassage => {
    return message.type === MessageType.ERROR
}

const isRemove = (message: HotBunMessage): message is RemoveMessage => {
    return message.type === MessageType.REMOVE
}