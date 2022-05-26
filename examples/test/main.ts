import { Bun } from '../../mod.ts'
import { serve } from "https://deno.land/std@0.140.0/http/server.ts"

const hotbun = await Bun.init()
// const html = await hotbun.inject()

const handler = async (request: Request) => {
    return new Response(await hotbun.dummy(), {
        status: 200, headers: {
            "content-type": "text/html; charset=utf-8",
        },
    })
}

await serve(handler, { port: 8000 })