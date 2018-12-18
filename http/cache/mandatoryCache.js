let fs = require('fs')
let path = require('path')
let http = require('http');
let url = require('url');
let mime = require('mime')

http.createServer((request, response)=>{
    response.setHeader("Cache-Control",'max-age=10')
    response.setHeader('Exipres',new Date(Date.now() + 10 * 1000).toLocaleString())
    let {pathname } = url.parse(request.url)
    let realPath = path.join(__dirname,pathname)

    fs.stat(realPath,(err,stats)=>{
        if (err){
            response.statusCode = 404
            response.end("Not Fount")
            return
        }
        if (stats.isFile()) {
            response.setHeader('Content-Type', mime.getType(realPath) + ';charset=utf-8')
            fs.createReadStream(realPath).pipe(response)
        }
    })

}).listen(3002)
