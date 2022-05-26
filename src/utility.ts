import {CrumbType} from './types.ts'

export const toDataUrl = (text: string) =>
    "data:text/javascript;base64," + btoa(text)