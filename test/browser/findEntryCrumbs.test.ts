import { assertEquals } from "https://deno.land/std@0.142.0/testing/asserts.ts";
import { findEntryCrumbs } from '../../src/browser/findEntryCrumbs.ts'
import { CrumbData } from '../../src/browser/script.ts'

Deno.test({
    name: 'findEntryCrumbs:',
    fn: async t => {
        const testCrumbs: Record<string, CrumbData> = {
            'bundle.ts': {
                dependencies: ['test1.ts', 'test2.ts', 'test3.ts'],
                code: '',
            },
            'test1.ts': {
                dependencies: ['test1.1.ts', 'test1.2.ts', 'test1.3.ts'],
                code: '',
            },
            'test1.2.ts': {
                dependencies: ['test1.2.1.ts', 'test1.2.2.ts', 'test1.2.3.ts'],
                code: '',
            },
            'test2.ts': {
                dependencies: ['test2.1.ts', 'test2.2.ts'],
                code: '',
            }
        }
        await t.step({
            name: 'test1.ts should return bundle.ts', fn: t => {
                const res = findEntryCrumbs(testCrumbs,'test1.ts')
                const exp = 'bundle.ts'
                console.log(res)
                assertEquals(res[0],exp)
            }
        })
    }
})