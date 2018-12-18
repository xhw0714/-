const {EventEmitter} = require('events')
const fs = require('fs')

class WriteStream extends EventEmitter{
    constructor(path,options){
        super()
        this.path = path
        this.flags = options.flags || 'w'
        this.encoding = options.encoding || null
        this.mode = options.mode || 0o666
        this.autoClose = options.autoClose || true
        this.start = options.start || 0
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.cache = []
        this.open()
        this.len = 0
        this.writing = false
        this.position = this.start
        this.needDrain = false
    }
    open() {
        fs.open(this.path,this.flags,this.mode,(err,fd) => {
            if (err) return this.emit('error',err)
            this.fd = fd
            this.emit('open')
        })
    }
    write (chunk,encodeing = this.encoding,callback = () => {}) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        this.len += chunk.length
        this.needDrain = this.len >= this.highWaterMark
        if (this.writing) {
            this.cache.push({
                chunk,
                encodeing,
                callback
            })
        } else {
            this.writing = true
            this._write(chunk,encodeing,callback)
        }
        return !this.needDrain
    }
    _write (chunk,encodeing,callback) {
        if (!this.fd) {
            this.once('open',()=> {
                this._write(chunk,encodeing,callback)
            })
            return
        }
        fs.write(this.fd,chunk,0,chunk.length,this.position,(err, written) => {
            if(err)return this.emit('error',err)
            this.len -= written
            this.position += written
            callback()
            this.clearBuffer()
        })
    }
    clearBuffer () {
        let obj = this.cache.shift()
        if(obj) {
            this._write(obj.chunk,obj.encodeing,obj.callback)
        } else {
            this.writing = false
            if (this.needDrain) {

                this.needDrain = false
                this.emit('drain')
            }
        }
    }
}
module.exports = WriteStream
