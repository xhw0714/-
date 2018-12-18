const http = require("http");
const fs = require('fs')
const path = require('path')
const url = require('url')
const mime = require('mime')
//中文
http.createServer((req, res)=>{
    let {pathname} = url.parse(req.url)
    if( pathname == '/favicon.ico')return res.end()
    let realPath = path.join(__dirname,pathname)
    if (pathname === '/') realPath = path.join(__dirname,'index.html')
    fs.stat(realPath,(err,stats) => {
        if (err) {
            res.statusCode = 404
            res.end('Not found')
        }
        if (stats.isFile()) {
            res.setHeader('Content-Type',mime.getType(realPath) + ';charset=utf-8')
            fs.createReadStream(realPath).pipe(res)
        }
    })

}).listen(3000)
