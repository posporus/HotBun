
/**
 * default CrumbTypes
 */
const defaultTypes = {
    'script': ['js', 'ts', 'jsx', 'tsx'],
    'markup': ['html', 'htm'],
    'style': ['css', 'scss', 'sass']
}

/**
 * It guesses the CrumbType from a file extension. You can pass a definition object optionally.
 * @param file
 * @returns 
 */
export const guessType = (file: string, types:Record<string,string[]> = defaultTypes):keyof typeof defaultTypes | null => {
    let type: string | null = null

    const ext = file.split('.').pop()

    const extArray = Object.values(types)
    const typeStrings = Object.keys(types)

    extArray.forEach((extensions, i) => {
        const found = extensions.find(e => e === ext)
        found
        if (found) {
            type = typeStrings[i]
        }
    })

    return type
}