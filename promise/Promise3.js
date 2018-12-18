class Promise {
    constructor (executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onRejected = []
        this.onResolved = []
        const resolved = (value) => {
            if (this.status === "pending") {
                this.status = 'fulfilled'
                this.value = value
                this.onResolved.forEach(e => e())
            }
        }
        const rejected = (reason) => {
            if(this.status === 'pending') {
                this.status = 'rejected'
                this.reason = reason
                this.onRejected.forEach(e => e())
            }
        }
        try {
            executor(resolved,rejected)
        }catch (e) {
            console.log(e)
        }
    }

    resolvePromise (promise2,x,resolved,rejected) {
        if (promise2 === x) {
            throw new TypeError('出现错误了')
        }
        let called;
        if ((x !== null && typeof x === "object") || typeof x === "function") {
            try {
                let then = x.then
                if(typeof then === "function") {
                    then.call(x,(y) => {
                        if(!called){called = true} else {return}
                        this.resolvePromise(x,y,resolved,rejected)
                    },(r) => {
                        if(!called){called = true} else {return}
                        rejected(r)
                    })
                } else {
                    resolved(x)
                }
            }catch (e) {
                if(!called){called = true} else {return}
                rejected(e)
            }
        } else {
            resolved(x)
        }
    }

    then(onFulfilled,onRejected){
        onFulfilled = typeof onFulfilled === "function"?onFulfilled:function(data){
            return data
        }
        onRejected = typeof onRejected === "function"?onRejected:function(err){
            throw err
        }
        let promise2;
        promise2 = new Promise((resolved,rejected) => {
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        this.resolvePromise(promise2,x,resolved,rejected)
                    } catch (e) {
                        rejected(e)
                    }
                },0)
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        this.resolvePromise(promise2,x,resolved,rejected)
                    } catch (e) {
                        rejected(e)
                    }
                },0)
            }
            if (this.status === 'pending') {
               this.onResolved.push(()=>{
                   setTimeout(()=>{
                       try {
                           let x = onFulfilled(this.value)
                           this.resolvePromise(promise2,x,resolved,rejected)
                       }catch (e) {
                           rejected(e)
                       }
                   })
               })
                this.onRejected.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onRejected(this.reason)
                            this.resolvePromise(promise2,x,resolved,rejected)
                        }catch (e) {
                            rejected(e)
                        }
                    })
                })
            }
        })
        return promise2
    }

    finally (cb) {
        return this.then((data)=>{
            cb()
            return data
        },(err)=>{
            cb()
            throw err
        })
    }

    static all (promises) {
        return new Promise((resolved,rejected)=>{
            let arr = []
            let i = 0
            const processData = (index, data) => {
                i++
                arr[index] = data
                if(i === promises.length) {
                    resolved(arr)
                }
            }
            for (let i = 0;i<promises.length;i++) {
                let p = promises[i]
                if (p.then && typeof p.then === "function") {
                    p.then((res)=>{
                        processData(i,res)
                    },rejected)
                } else {
                    processData(i,p)
                }
            }
        })
    }

    static race (promises) {
        return new Promise((resolved,rejected)=>{
            for (let i = 0;i<promises.length;i++) {
                let p = promises[i]
                if (p.then && typeof p.then === "function") {
                    p.then(resolved,rejected)
                } else {
                    resolved(p)
                }
            }
        })
    }

    static resolve (value) {
        return new Promise((resolved, rejected)=>{
            resolved(value)
        })
    }

    static reject (reason) {
        return new Promise((resolved, rejected)=>{
            rejected(reason)
        })
    }

    static deferred () {
        let dfd = {}
        dfd.promise = new Promise((resolved,rejected)=>{
            dfd.resolve = resolved
            dfd.reject = rejected
        })
        return dfd
    }

}

module.exports = Promise
