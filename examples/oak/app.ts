import { Application, Router } from './dist.ts'
import { Bun } from '../../mod.ts'

const hotbun = await Bun.init()

const router = new Router();
router
    .get("/", async (context) => {
        context.response.body = await hotbun.inject('./www/index.html')//"Hello world!";
    })
    /* .get("/book", (context) => {
        context.response.body = Array.from(books.values());
    })
    .get("/book/:id", (context) => {
        if (books.has(context?.params?.id)) {
            context.response.body = books.get(context.params.id);
        } 
    });*/

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });