import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { watcher } from './watcher.ts'
import * as path from 'https://deno.land/std@0.139.0/path/mod.ts'

const app = new Application();

const { files } = (await Deno.emit('./browser.ts', {
    bundle: "module"
}))

const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title></title>
        <link rel="stylesheet" href="css/main.css" />
        <link rel="icon" href="images/favicon.png" />
    </head>

    <body>
        <script type="module">
            ${files['deno:///bundle.js']}
        </script>
    </body>
</html>
`


/* const bun = async (file: string, sources?:Record<string,string>) => {
    //const data = await Deno.readTextFile(file)
    const { files } = (await Deno.emit(file, {
        bundle: "module",
        sources
    }))
    //return { file, data }
    return files['deno:///bundle.js']
} */

//const dist = await bun('./src/dist.ts')

const router = new Router()
router.get('/', ctx => {
    ctx.response.body = html
})
router.get('/bun', async ctx => {
    console.log('bun requested.')
    ctx.response.body = await bun('./src/bundle.ts',{
        'dist.ts':dist
    })
    console.log('bun sent.')
})
router.get('/hot', ctx => {
    const ws = ctx.upgrade()
    ws.addEventListener('open', (e) => {
        console.log('hot bun connection.')
        //ws.send('hello. i will send you file changes.')
    })
    ws.addEventListener('message', (e) => {
        console.log('message', e.data)
    })

    watcher('./src', async (file) => {
        if (!file) return false
        //const data = await Deno.readTextFile(file)
        ws.send(
            JSON.stringify(
                await bun(file)
            )
        )
    })

})


app.use(router.routes());

/* watcher('./',(e)=>{
    console.log('file changed.', e)
}) */
await app.listen({ port: 8000 });

