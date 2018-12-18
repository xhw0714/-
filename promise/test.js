const promise = require('./promise3')
console.log(require)
// let p = new promise(function (resolved, rejected) {
//     setTimeout(() => {
//         resolved('xx')
//     },3000)
// })
// p.then(function (res) {
//     console.log(res)
// })

// let p = new promise(function (resolve, reject) {
//     resolve('xx')
//     resolve('xxss')
//     reject('xxxx')
// })
//
// p.then(res => {
//     console.log(res,'xxx')
// },(err) => {
//     console.log(err)
// })

// promise.resolve('abs').then(res=>{
//     console.log(res)
//     return 123
// }).finally(function () {
//
// }).then(function (res) {
//     console.log(res)
// })

function read() {
    return new promise(function (resolved,rejected) {
        setTimeout(()=>{
            resolved('asd')
        },2000)
    })
}
function read2() {
    return new promise(function (resolved,rejected) {
        setTimeout(()=>{
            resolved('abc')
        },1000)
    })
}

promise.race([read(),read2()]).then(res=>{
    console.log(res)
})
