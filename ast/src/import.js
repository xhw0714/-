

let bable = require('@babel/core')
let t = require('@babel/types')
let code = `import {Component} from 'react'`


let importPlugin = {
    visitor: {
        ImportDeclaration (path) {
            console.log(path.node.specifiers)
        }
    }
}

let r = bable.transform(code, {
    plugins:[
        [importPlugin,{libraryName:'react'}]
    ]
})
console.log(r.code)
