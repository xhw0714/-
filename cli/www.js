#! /usr/bin/env node
let program = require('commander')
let package = require('./package')

program
    .version(package.version)
    .option('-d, --dir <n>','Perform directory')
    .option('-p, --port <n>','Add port')
    .option('-a, --address <n>','Add address')
    .parse(process.argv)

let config = Object.assign({
    dir:process.cwd(),
    port:3000,
    address:'localhost'
},program)


let server = require('./src/server')
let app = new server(config)
app.start()
