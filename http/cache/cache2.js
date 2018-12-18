let fs = require('fs')
let path = require('path')
let http = require('http');
let url = require('url');
let mime = require('mime')

http.createServer((request, response)=>{
    console.log(request.headers)
    let {pathname} = url.parse(request.url)
    let realpath = path.join(__dirname,pathname);
    response.setHeader('Cache-Control','no-cache')
    fs.stat(realpath,(err, stats) => {
        if (err){
            return response.statusCode = 404,response.end()
        }
         if (stats.isFile()){
             let prev = request.headers['if-modified-since']
             console.log(stats.ctime)
             let ctime = stats.ctime
            if(prev == ctime) {
                response.statusCode = 304
                response.end()
            } else {
                response.setHeader('Last-Modified',ctime)
                response.setHeader('Content-Type',mime.getType(realpath) + ';charset=utf8')
                fs.createReadStream(realpath).pipe(response)
            }

         }
    })

}).listen(3002)
