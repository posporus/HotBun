import type { CrumbData } from './script.ts'
/**
 * recursively determines the crumbs that have no more importers (no other crumbs are importing this crumb)
 * aka the entry points
 * @param crumbs 
 * @param name 
 * @returns 
 */
export const findEntryCrumbs = (crumbs: Record<string, CrumbData>, name: string): string[] => {

    //reformat as array
    const crumbsArray = Object.entries(crumbs).map(([file, { dependencies }]) => ({ file, dependencies }))

    const getImporters = (crumbName: string) => getImportersFromCrumblist(crumbsArray, crumbName)

    const entries: string[] = []

    const loop = (crumbName: string) => {
        //push crumb name
        entries.push(crumbName)
        const importers = getImporters(crumbName)
        //remove again if there are importers
        if (importers.length) {
            entries.splice(entries.indexOf(crumbName), 1)
            importers.forEach(( file ) => loop(file))
        }
    }

    loop(name)

    return entries
}

const getImportersFromCrumblist = (crumbsArray: { file: string, dependencies: string[] }[], crumbName: string) => {
    const importers:string[] = []
    crumbsArray.forEach(({ dependencies,file }) => {
        if(dependencies.find(d => d === crumbName)) importers.push(file)
    })
    return importers
}