export const isUrlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const test = isUrlRegEx.test('https://cdn.skypack.dev/preact')
test

const test2 = isUrlRegEx.test('https://cdn.skypack.dev/preact')
test2