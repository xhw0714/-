// let buf = Buffer.from("你好");
Buffer.prototype.copy = function (targetBuffer,targetStart,soureStart = 0,sourceEnd = this.length) {
    for (let i = 0;i<sourceEnd - soureStart;i++) {
        targetBuffer[targetStart + i] = this[soureStart + i]
    }
}

Buffer.concat = function (bufferArray,totalLength = bufferArray.reduce((a,b) => a + b.length , 0)) {
    let buf = Buffer.alloc(totalLength)
    let offset = 0;
    bufferArray.forEach(e => {
        e.copy(buf,offset);
        offset += e.length
    })
    return buf
}
// let buf1 = Buffer.from("你")
// let buf2 = Buffer.from("好")
// let buf3 = Buffer.from("世界")
//
// let result = Buffer.concat([buf1,buf2,buf3])

Buffer.prototype.split = function (seq) {
    let arr = []
    let cur = 0
    let offset = 0
    let len = Buffer.from(seq).length;
    while((cur = this.indexOf(seq,offset)) != -1) {
        arr.push(this.slice(offset,cur))
        offset = cur + len
    }
    arr.push(this.slice(offset))
    return arr
}

let buf = Buffer.from('weweafwenweinoasdedasd')
console.log(buf.split('a'))
