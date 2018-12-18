function Promise(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolved = []
    this.onRejected = []
    let self = this
    function resolved(value) {
        if (self.status === 'pending') {
            self.status = 'fulfilled'
            self.value = value
            self.onResolved.forEach(e => e())
        }
    }
    function rejected(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected'
            self.reason = reason
            self.onRejected.forEach(e => e())
        }
    }

    try{
        executor(resolved,rejected)
    }catch (e) {
        console.log(e)
    }

}

function resolvePromise (promise2,x,resolved,rejected) {
    if (promise2 === x){
        throw new TypeError('发生错误了')
    }
    let called
    if ((x != null && typeof x === 'object') || typeof x === 'function'){
        try{
            let then = x.then
            if(typeof then === "function") {
                then.call(x,function (y) {
                    if(!called){called = true} else {return}
                    resolvePromise(x, y,resolved,rejected)
                },function (r) {
                    if(!called){called = true} else {return}
                    rejected(r)
                })
            }else {
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

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (data){
        return data
    }
    onRejected = typeof onRejected === "function" ? onRejected : function (err) {
        throw err
    }
    let self = this
    let promise2 ;
    promise2 = new Promise(function (resolved, rejected) {
        if(self.status === 'fulfilled') {
            setTimeout(function () {
                try{
                    let x = onFulfilled(self.value)
                    resolvePromise (promise2,x,resolved,rejected)
                }catch (e) {
                    rejected(e)
                }
            },0)
        }
        if(self.status === 'rejected') {
            setTimeout(function () {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise (promise2,x,resolved,rejected)
                } catch (e) {
                    rejected(e)
                }
            },0)
        }
        if(self.status === 'pending') {
            self.onResolved.push(function () {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise (promise2,x,resolved,rejected)
                    } catch (e) {
                        rejected(e)
                    }
                },0)
            })
            self.onRejected.push(function () {
                setTimeout(function () {
                    try {
                        let x = onRejected(self.reason)
                        resolvePromise (promise2,x,resolved,rejected)
                    }catch (e) {
                        rejected(e)
                    }
                },0)
            })
        }
    })
    return promise2
}

Promise.reject = function (error) {
    return new Promise(function (resolved,reject) {
        reject(error)
    })
}
Promise.resolve = function (value) {
    return new Promise(function (resolved,reject) {
        resolved(value)
    })
}
Promise.prototype.catch = function (reject) {
    return this.then(null,reject)
}

Promise.prototype.finally = function (cb) {
    return this.then(function (data) {
        cb()
        return data
    },function (reason) {
        cb()
        throw reason
    })
}
Promise.all = function (promises) {
    return new Promise(function (resolved,rejected) {
        let arr = []
        let i = 0
        function processData(index, data) {
            i++
            arr[index] = data
            if(i === promises.length){
                resolved(arr)
            }
        }
        for (let i = 0;i<promises.length;i++) {
            let p = promises[i];
            if (p.then && typeof p.then === "function") {
                p.then(function (res) {
                    processData(i,res)
                },rejected)
            }else {
                processData(i,promises[i])
            }
        }
    })
}

Promise.race = function(promises){
    return new Promise(function (resolved, rejected) {
        for (let i = 0;i<promises.length;i++){
            let p = promises[i]
            if (p.then && typeof p.then === "function"){
                p.then(resolved,rejected)
            } else {
                resolved(p)
            }
        }
    })
}

Promise.deferred = Promise.defer = function() {
    let dfd = {}
    dfd.promise = new Promise(function (resolved, rejected) {
        dfd.resolve  = resolved
        dfd.reject = rejected
    })
    return dfd
}

module.exports = Promise
