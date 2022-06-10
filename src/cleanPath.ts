import { path } from '../dist.ts'

export const cleanPath = (file: string) => {
    file = path.relative(Deno.cwd(), file)
    file = path.normalize(file)
    const isExtendedLengthPath = /^\\\\\?\\/.test(file)
    const hasNonAscii = /[^\u0000-\u0080]+/.test(file)
    if (isExtendedLengthPath || hasNonAscii) {
        return file;
    }

    file = file.replace(/\\/g, "/")
    return file

}