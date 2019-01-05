let koa = require('koa');
let fs = require('fs');
let uuid = require('uuid');
let path = require('path')
let app = new koa()

Buffer.prototype.split = function (seq) {
    let arr = []
    let len = Buffer.from(seq).length;
    let offset = 0;
    let cur;
    while ((cur = this.indexOf(seq,offset)) != -1) {
        arr.push(this.slice(offset,cur));
        offset = cur + len
    }
    arr.push(this.slice(offset))
    return arr
}
function bodyParse (dir) {
    return async (ctx,next) => {
        await new Promise(((resolve, reject) => {
            let arr = []
            ctx.req.on('data',function (chunk) {
                arr.push(chunk)
            })

            ctx.req.on('end',function () {
                let bf = Buffer.concat(arr);
                let contentType = ctx.get('Content-Type').split('; ');
                if (contentType[0] == 'multipart/form-data') {
                    let boundary = '--' + contentType[1].split('=')[1];
                    console.log(bf.split(boundary).slice(1,-1))
                }
            })

        }))
        await next()
    }
}

app.use(bodyParse('./upload'))

app.use(async (ctx,next)=>{
    if((ctx.path === '/') && (ctx.method === 'GET')){
        ctx.set('Content-Type','text/html;charset=utf8');
        ctx.body = fs.createReadStream(path.resolve(__dirname,'index.html'));
    }else{
        return next();
    }
});

app.use(async (ctx) => {
    if (ctx.path == '/login' && ctx.method == 'POST') {
        ctx.body = ctx.request.body
    }
})

app.listen(3000)
