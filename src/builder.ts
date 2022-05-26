import { esbuild } from '../dist.ts'
import type { Typescript, Javascript } from './types.ts'

export const build = async (ts: Typescript): Promise<Javascript> => {
    const { code, warnings, map } = await esbuild.transform(ts, { loader: 'ts' })
    /* const dataUri = 'data:text/javascript;charset=utf-8,'
        + ts;
    const code = await Deno.emit(dataUri, {
        check: false
    }) */
    if (warnings.length) throw warnings
    return code
}

export const bundle = async (file:string)=> {
    const {files} =  await Deno.emit(file,{
        bundle: 'module',
        check:false
    })
    return files['deno:///bundle.js']
}