import {normalize} from 'https://deno.land/std@0.139.0/path/mod.ts'
import slash from "https://deno.land/x/slash@v0.3.0/mod.ts";

export const cleanPath = (file:string) => {
    file = slash(file)
    file = normalize(file)
    return file
}