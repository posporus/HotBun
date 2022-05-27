const normalizePath = (file: string) => {
    const base = './test/haha'
    const urlString = 'file://'+file
    const url= new URL(urlString)
    return url.pathname
}


const file = '/hello.ts'

const normal =normalizePath(file)
normal