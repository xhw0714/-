let babel = require('@babel/core')
let t = require('@babel/types')

let code = `
class Person {
    constructor(name){
        this.name = name
    }
    getName () {
        return this.name
    }
}`

let classTransfrom = {
    visitor: {
        ClassDeclaration (path) {
            let node = path.node
            let body = node.body.body
            let methods = body.map(method => {
                console.log(method)
                if (method.kind === 'constructor') {
                    return t.functionExpression(t.identifier(node.id.name), method.params, method.body)
                } else if (method.kind === 'method') {
                    let left = t.memberExpression(t.memberExpression(t.identifier(node.id.name),t.identifier('prototype')),method.key)
                    let right = t.functionExpression(null,method.params,method.body)
                    return t.assignmentExpression('=',left,right)
                }
            })
            path.replaceWithMultiple(methods)
        }
    }
}

let r = babel.transform(code,{
    plugins:[
        classTransfrom
    ]
})
console.log(r.code)

