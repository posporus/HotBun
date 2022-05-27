import {path} from '../dist.ts'

export const cleanPath = (file: string) => {
    const normalized = path.normalize(file)
    const relative = path.relative(Deno.cwd(),normalized)
    const isExtendedLengthPath = /^\\\\\?\\/.test(relative);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(relative);

    if (isExtendedLengthPath || hasNonAscii) {
        return relative;
    }

    const clean  = relative.replace(/\\/g, "/");
    return clean

}