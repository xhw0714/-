const Promise = require('./Promise3')

function read(val,ms,type) {
    return new Promise((resolved,rejected)=>{
        if (type === "success") {
            setTimeout(()=>{
                resolved(val)
            },ms)
        } else {
            setTimeout(()=>{
                rejected(val)
            },ms)
        }
    })
}

async function readResult(value) {
    let r1 = await read(value,0,"success")
    console.log(r1)
    let r2 = await read("你好",1000,"success")
    console.log(r2)
    let r3 = await read("中国",2000,"success")
    console.log(r3)
    return r3
}

readResult("嗨").then(res=>{
    console.log(res)
})


