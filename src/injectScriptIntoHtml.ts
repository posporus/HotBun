import { DOMParser, initParser } from '../dist.ts'

await initParser()


/**
 * injects javascript string into html string
 * @param html 
 * @param script 
 * @returns 
 */

//TODO: make it work without manually adding <!DOCTYPE [...] /html>
const injectScriptIntoHtml = (html: string, script: string) => {
    //const entry = await Deno.readTextFile(this.options.entry)
    const document = new DOMParser().parseFromString(html, 'text/html')
    if (!document) throw new Error("Document is null")
    //console.log('inject',html,script)
    const scriptElement = document.createElement("script")
    scriptElement.setAttribute('type','module')
    scriptElement.textContent = script
    document.head.appendChild(scriptElement)
    //console.log(document.documentElement?.innerHTML)


    return `
<!DOCTYPE html>
<html>
    ${document.documentElement?.innerHTML}
</html>`

}

export {
    injectScriptIntoHtml
}