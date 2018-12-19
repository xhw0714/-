
let http = require('http')
let path = require('path')
let url = require('url')
let mime = require('mime')
let fs = require('mz/fs')
let ejs = require('ejs')
let zlib = require('zlib')
let chalk = require('chalk')
let temp = fs.readFileSync(path.resolve(__dirname,'./template.html'),'utf8')
class server {
    constructor(config){
        this.dir = config.dir
        this.port = config.port
        this.address = config.address
        this.temp = temp
    }
    async handleServer (req,res) {
        let {pathname} = url.parse(req.url)
        if (pathname ==='/favicon.ico') return res.end()
        let realpath = path.join(this.dir,pathname)

        try {
            let stats = await fs.stat(realpath)
            if (stats.isFile()) {
                this.sendFile(realpath,req,res,stats)
            } else {
                this.sendDir(realpath,pathname,res)
            }
        }catch (e) {
            this.sendNotFound(e,res)
        }
    }
    async sendDir (realpath,pathname,res) {
        let dirs = await fs.readdir(realpath)
        dirs = dirs.map(e=> {
            return {
                url:path.join(pathname,e),
                dir:e
            }
        })
        let renderStr = ejs.render(this.temp,{dirs})
        res.setHeader('Content-Type','text/html;charset=utf8')
        res.end(renderStr)
    }

    sendFile (realpath,req,res,stats) {
        if (this.cache(req,res,realpath,stats)){
            return res.statusCode = 304,res.end()
        }
        res.setHeader('Content-Type',mime.getType(realpath) + ';charset=utf-8')
        let zip
        if (zip = this.gzip(req,res)) {
            // console.log(zip)
            return fs.createReadStream(realpath).pipe(zip).pipe(res)
        }
        fs.createReadStream(realpath).pipe(res)
    }
    gzip (req,res) {
        let encoding = req.headers['accept-encoding']
        if (encoding.includes('gzip')) {
            res.setHeader('Content-Encoding','gzip')
            return zlib.createGzip()
        }
        if(encoding.includes('deflate')) {
            res.setHeader('Content-Encoding', 'deflate')
            return zlib.createDeflate()
        }
        return false
    }

    cache (req,res,realpath,stats) {
        res.setHeader('Cache-Control','max-age=30')
        res.setHeader('Expires',new Date(Date.now()+5*1000).toGMTString())
        let ctime = stats.ctime
        let Etag = ctime + '_' + stats.size
        res.setHeader('Last-Modified',ctime)
        res.setHeader('Etag',Etag)
        let ifModifiedSince = req.headers['if-modified-since']
        let ifNoneMatch = req.headers['if-none-match']

        if (ifModifiedSince && ifNoneMatch) {
            if (ifModifiedSince == ctime && ifNoneMatch == Etag) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    sendNotFound (e,res) {
        res.statusCode = 404
        res.end('Not Fount')
    }
    start () {
        http.createServer(this.handleServer.bind(this)).listen(this.port,this.address,()=>{
            console.log('server start at : ' + chalk.green(this.address + ':' + this.port))
        })
    }
}

module.exports = server
