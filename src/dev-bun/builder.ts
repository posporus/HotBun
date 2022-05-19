
import { esbuild } from './dist.ts'
interface Bun {
    imports: Record<string, string>
    code: string
}

const prebuild = async (entry: string) => {
    

}

const importIterate = async (entry:string) => {

}

const openTs = async (file:string) => {
    const data = await Deno.readTextFile(file)


}

export const build = async (ts: string) => {
    const { code, warnings, map } = await esbuild.transform(ts, { loader: 'ts', })
    /* const dataUri = 'data:text/javascript;charset=utf-8,'
        + ts;
    const code = await Deno.emit(dataUri, {
        check: false
    }) */
    if (warnings.length) throw warnings
    return code
}

/* const ts = await Deno.readTextFile('./src/bundle.ts')


const bundle = await builder(
    prepareCode(
)

console.log(bundle) */