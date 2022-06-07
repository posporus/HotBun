# HotBun


- vite like hot es module replacement but different
- only one request per bundle
- zero requests on updating module
- no build step
- dev == prod
- using esbuild

![hotbun_demo](https://user-images.githubusercontent.com/2838229/172371696-089fcccd-c09b-4886-a49b-4bc84bb23834.gif)

## ToDo
[] making css work
[] SSR

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
