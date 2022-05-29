/// <reference lib="dom" />

//import {test} from './src/bundle.ts'



/* const script = document.createElement('script')
script.setAttribute('type', 'module')
document.body.appendChild(script) */

//const updateBun = (b: string) => {
    //script.innerHTML = `${b}`
    //}
    
    const f = await fetch('http://localhost:8000/bun')
    const bun = await f.text()
    
    //console.log('BUN', bun)
    import("data:text/javascript;base64," + btoa(bun))
    //updateBun(bun)
    
    const ws = new WebSocket('ws://localhost:8000/hot')
    ws.addEventListener('message', (e) => {
        console.log('message', e.data)
        const data = e.data
        console.log('json data',data)
        import("data:text/javascript;base64," + btoa(data))
        
    })
    console.log(ws)