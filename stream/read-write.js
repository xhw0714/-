const fs = require('fs')
const ReadStream = require('./ReadStream')
const WriteStream = require('./WriteStream')

let rs = new ReadStream('a.txt',{highWaterMark:4});
let ws = new WriteStream('b.txt',{highWaterMark:1});
rs.pipe(ws);

// function copy(source,target,cb) {
//     fs.open(source,'r',function (err,fd) {
//         fs.open(target,'w',function (err,wfd) {
//             let buffer = Buffer.alloc(5)
//             let pos = 0
//             function next() {
//                 fs.read(fd,buffer,0,5,pos,function (err,bytesRead) {
//                     if(bytesRead > 0){
//                         fs.write(wfd,buffer,0,bytesRead,pos,function () {
//                             pos += bytesRead
//                             next()
//                         })
//                     } else {
//                         cb()
//                         fs.close(fd,()=>{})
//                         fs.close(wfd,()=>{})
//                     }
//
//                 })
//             }
//             next()
//         })
//     })
// }
//
// copy('a.txt','b.txt',function () {
//     console.log("复制成功")
// })

// let rs = new ReadStream('a.txt',{
//     flags:'r',
//     encoding:null,
//     mode:0o666,
//     autoClose:true,
//     start:0,
//     end:5,
//     highWaterMark:1024
// })
// let arr = []
// rs.on('open',function (fd) {
//     console.log(fd)
// })
//
// rs.on('data',function (data) {
//     console.log(data)
//     arr.push(data)
// })
// rs.on('end',function () {
//     console.log(arr)
//     console.log(Buffer.concat(arr).toString())
// })
// rs.on('close',function () {
//     console.log('close')
// })
// rs.on('error',function (err) {
//     console.log(err)
// })

// const ws = new WriteStream('b.txt',{
//     flags:'w',
//     encoding:null,
//     mode:0o666,
//     autoClose:true,
//     start:0,
//     highWaterMark:4
// })
// let i = 9;
// let flag;
// function write() {
//     flag = true;
//     while (flag&&i>=0) {
//         flag = ws.write(i-- + '') // flag = false了
//     }
// }
//
// ws.on("drain",function () {
//     console.log('抽干')
//     // write()
// })
// write()
