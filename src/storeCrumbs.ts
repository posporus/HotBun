import { Crumb } from './Crumb.ts'
import type { Pack } from './Crumb.ts'

export const crumbStorage:Map<string, Crumb> = new Map()/* {
    get: window.crumbs.get,
    set: window.crumbs.set,
    has:(file:string) => window.crumbs.has(file)
} */

/* const getCrumbData = async (entry:string):Promise<Record<string,string>> => {
    const data:Record<string,string> = {}
    crumbStorage.get(entry)
    for(const [f,c] of crumbStorage) {
        data[f] = await c.code()
    }
    return data
} */

export const getTreeData = async (entry: string, dataObject?: Record<string, Pack>) => {
    const data = dataObject || {}
    const meCrumb = crumbStorage.get(entry)
    //console.log('TREE:', entry)
    if (!meCrumb) return
    data[meCrumb.file] = await meCrumb.pack()
    await Promise.all(meCrumb.dependencies.map(async dep => {
        await getTreeData(dep, data)
    }))
    return data
}