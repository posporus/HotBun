# HotBun

- vite like hot es module replacement but different
- only one request per bundle
- zero requests on updating module
- no build step
- dev == prod
- using esbuild

## Running the Example

The example uses the oak as server framework.
```sh
cd ./examples/oak
# dev mode
deno run -A ./app.ts --dev
# producion mode
deno run --allow-read ./app.ts
```
In dev mode HotBun will watch for file changes and imidiately send them to the browser. Additionally it will inject a script for handling requests into the served html file.