let esprima = require('esprima')
let escodegen = require('escodegen')
let estraverse = require('estraverse')
let code = `
    function ast (){}
 `

let ast = esprima.parseScript(code)

estraverse.traverse(ast,{
    enter (node) {
        console.log('enter', node.type)
    },
    leave(node){
        console.log('leave',node)
    }
})

let r = escodegen.generate(ast)
console.log(r)
