const {EventEmitter} = require('events')
const fs = require('fs')
class ReadStream extends EventEmitter{
    constructor(path,options){
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null
        this.mode = options.mode || 0o666
        this.autoClose = options.autoClose || true
        this.start = options.start || 0
        this.end = options.end || 0
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.flowing = false
        this.open()
        this.on('newListener', (type)=>{
            if (type == 'data') {
                this.flowing = true
                this.read()
            }
        })
        this.position = this.start || 0
    }
    open() {
        fs.open(this.path,this.flags,this.mode,(err,fd)=>{
            if(err) return this.emit('error',err)
            this.fd = fd
            this.emit('open',fd)
        })
    }
    read () {
        if (typeof this.fd !== "number") {
            return this.once('open',()=>{
                this.read()
            })
        }
        let buffer = Buffer.alloc(this.highWaterMark)
        let howMuchToRead = this.end ? Math.min(this.highWaterMark,this.end - this.position + 1) : this.highWaterMark
        fs.read(this.fd,buffer,0,howMuchToRead,this.position,(err,bytesRead) => {
            if (bytesRead > 0) {
                this.position += bytesRead
                this.emit('data',this.encoding ? buffer.slice(0,bytesRead).toString(this.encoding) : buffer.slice(0,bytesRead))
                if (this.flowing) {
                    this.read()
                }
            } else{
                this.emit('end')
                this.emit('close')
                if (this.autoClose) fs.close(this.fd,()=>{})
            }
        })
    }
    pause () {
        this.flowing = false
    }
    resume () {
        this.flowing = true
        this.read()
    }
    pipe (dest) {
        this.on('data',(data)=>{
            let flag = dest.write(data)
            if (!flag) {
                this.pause()
            }
        })
        dest.on('drain',()=>{
            this.resume()
        })
    }
}
module.exports = ReadStream
