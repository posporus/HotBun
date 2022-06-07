import { esbuild } from '../dist.ts'
export const bundleFromFile = async (file: string): Promise<string> => {
    const { outputFiles: [code] } = await esbuild.build({
        entryPoints: [file],
        //sourcemap: 'inline',
        write: false,
        minify: true,
        bundle: true,
        //format: 'iife'

    })
    return code.text
}