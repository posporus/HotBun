export const importStatementRegEx = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/gm

export const betweenQuotesRegEx = /([\'\"\`])(.*)\1/g

export const importObjectRegEx =  /(?<=import).*(?=from)/g


export const findStyleExtensionRegEx = /\.(css|scss|sass)$/g
export const findMarkupExtensionRegEx = /\.(html|htm)$/g
export const findScriptExtensionRegEx = /\.(js|ts|jsx|tsx)$/g

export const scriptTagSrcRegEx = /<script.*?src="(.*?)"/gmi