/// <reference lib="dom" />
import type { HotBunMessage, UpdateMessage, RemoveMessage, ErrorMessage } from './message.ts'
import { MessageType } from './message.ts'
import { findEntryCrumbs } from './findEntryCrumbs.ts'

declare global {
    interface Window {
        crumbs: Record<string, CrumbData>
        //TODO: Rename method
        eval: (file: string) => any
    }

}

export interface CrumbData {
    code: string,
    dependencies: string[]
}

const socket = new WebSocket('ws://localhost:8000')

socket.addEventListener('message', e => {
    const message: HotBunMessage = JSON.parse(e.data)
    if (isUpdate(message)) {
        console.log('update', message.file)

        const { file, code, dependencies } = message

        window.crumbs[file] = { code, dependencies }
        findEntryCrumbs(window.crumbs,file).forEach(f=>{
            window.eval(f)
        })
        
    }

    if (isError(message)) {
        console.error(message.error)
    }

    if (isRemove(message)) {
        console.info('remove ', message.file)
    }

})

const isUpdate = (message: HotBunMessage): message is UpdateMessage => {
    return message.type === MessageType.UPDATE
}

const isError = (message: HotBunMessage): message is ErrorMessage => {
    return message.type === MessageType.ERROR
}

const isRemove = (message: HotBunMessage): message is RemoveMessage => {
    return message.type === MessageType.REMOVE
}