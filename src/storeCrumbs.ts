import { Crumb } from './Crumb.ts'
import type { Pack } from './Crumb.ts'

export const crumbStorage:Map<string, Crumb> = new Map()

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