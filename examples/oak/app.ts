import { HotBun, Application, Router } from './dist.ts'

const hotbun = HotBun.init()

const router = new Router()
router
    .get("/", async (context) => {
        if (context.isUpgradable && hotbun.dev)
            hotbun.watch(context.upgrade())

        context.response.body = await hotbun.entry('./index.html')
    })
    .get("/test.ts", async (context) => {
        context.response.body = await hotbun.bundle('./test.ts')
        context.response.type = 'text/javascript'
    })

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })