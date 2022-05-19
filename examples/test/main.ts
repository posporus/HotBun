import { HotBun } from '../../mod.ts'
import { serve } from "https://deno.land/std@0.140.0/http/server.ts"

const bun = new HotBun()

const handler = async (request: Request) => {
    return new Response(await bun.bundle(), { status: 200 })
}

await serve(handler, { port: 8000 })