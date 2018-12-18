
let p = new Promise(function (resolve, reject) {
    reject('aaa')
})
p.then(res => {
    console.log(res)
}).catch(function (error) {
    console.log(2,error)
})
