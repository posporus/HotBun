import { assertEquals } from "https://deno.land/std@0.142.0/testing/asserts.ts";
import { CrumbPath } from '../src/CrumbPath.ts'
import { Crumb } from '../src/Crumb.ts'

Deno.test({
    name: 'crumb path test',
    fn: t => {
        Crumb.root = './www/'
        const testFile = './script.ts'
        const testPath = new CrumbPath(testFile)
        console.log(testPath.absolute)
    }
})