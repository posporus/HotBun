import { createHash } from "https://deno.land/std@0.139.0/hash/mod.ts";


export const checksum =async (file: string) => {
    const hash = createHash("md5");
    const text = await Deno.readTextFile(file)
    //console.log(text)
    hash.update(text);
    
    return hash.toString()
}

