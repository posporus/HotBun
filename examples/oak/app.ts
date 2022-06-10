import { HotBun, Application, Router } from './dist.ts'

const hotbun = HotBun.init()

//prebundle
const bundle = await hotbun.bundle('./my-bundle.ts')

const router = new Router()

router
    .get("/", async (context) => {
        //call watcher if in devmode and upgrade to websocket
        if (context.isUpgradable && hotbun.dev)
            hotbun.watch(context.upgrade())
        //otherwise return entry
        context.response.body = await hotbun.entry('./index.html')
    })
    //route script
    .get("/my-bundle.ts", (context) => {
        context.response.body = bundle
        context.response.type = 'text/javascript'
    })

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

const port = 8000
console.info(`%cServer listening on http://localhost:${port}`,'font-weight:bold;')

await app.listen({ port })
