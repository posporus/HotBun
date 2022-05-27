import { Bun } from '../../mod.ts'
import { serve } from "https://deno.land/std@0.140.0/http/server.ts"

const hotbun = await Bun.init()
// const html = await hotbun.inject()

const handler = async (req: Request) => {
    const upgrade = req.headers.get("upgrade") || "";
    //console.log('req', request, 'upgrade', upgrade)

    if (upgrade === 'websocket') {
        let response, socket: WebSocket;
        try {
            ({ response, socket } = Deno.upgradeWebSocket(req));
        } catch {
            return new Response("request isn't trying to upgrade to websocket.");
        }

        socket.onopen = () => hotbun.watcher((crumb)=>{
            crumb?.send(socket)
        })
        
        socket.onerror = (e) => console.log("socket errored:", e);
        socket.onclose = () => console.log("socket closed");
        return response;
    }

    return new Response(await hotbun.dummy(), {
        status: 200, headers: {
            "content-type": "text/html; charset=utf-8",
        },
    })
}

await serve(handler, { port: 8000 })