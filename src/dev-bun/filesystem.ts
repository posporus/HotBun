const loadTree = async (entry: string) => {
    const entryDep = loadDependency(entry)
}

const loadDependency = async (file: string) => {
    const data = await Deno.readTextFile(file)
    return prepareCode(data)
}

const loadImports = async (imports:Import[]) => {
    
}