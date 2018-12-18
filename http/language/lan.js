let fs = require('fs')
let path = require('path')
let http = require('http');
let url = require('url');

let obj = {
    'zh-CN':{
        data:'你好,世界'
    },
    en:{
        data:'hello,world'
    },
    ja:{
        data:'こんにちは、世界'
    }
}
let defaultLanguage = 'en';

http.createServer((request, response)=>{
    //  Accept-Language: zh-CN;q=0.3,zh;q=0.9,en;q=1
    let lan = request.headers['accept-language']
    response.setHeader('Content-Type','text/plain;charset=utf-8');
    if (lan) {
        let arr = lan.split(',')
        arr = arr.map(e=>{
            let lans = e.split(';')
            lans[1] = lan[1] || 'q=1'
            return {
                'lan':lans[0],
                'q': Number(lans[1].split('=')[1])
            }
        }).sort((a,b)=>{
            return b.q-a.q
        })
        for (let i=0;i<arr.length;i++){
            if(obj[arr[i].lan]) {
                response.end(obj[arr[i].lan].data)
            }
        }

        response.end(obj[defaultLanguage].data)

    } else {
        response.end(obj[defaultLanguage].data)
    }

}).listen(3001)
