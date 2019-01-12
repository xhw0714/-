let babel = require('@babel/core')
let babelType = require('@babel/types')

let code = `
    let ast = (a,b) => a+b;
`
let transformArrow = {
    visitor: {
        ArrowFunctionExpression (path) {
            console.log(path.node)
            let node = path.node
            if (!babelType.isBlockStatement(node.body)) {
                node.body = babelType.blockStatement([babelType.returnStatement(node.body)])
            }
            let obj = babelType.functionExpression(null,node.params,node.body)
            path.replaceWith(obj)
        }
    }
}

let r = babel.transform(code, {
    plugins: [transformArrow]
})

console.log(r.code)
