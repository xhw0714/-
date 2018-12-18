function Promise(executor) {
    let self = this
    self.value = undefined
    self.reason = undefined
    self.status = 'pending'
    self.onResolved = []
    self.onRejected = []

    function resolved(value) {
        // console.log(self)
        if(self.status == 'pending') {
            self.value = value
            self.status = 'fulfilled'
            self.onResolved.forEach(e => e())
        }
    }
    function rejected(reason) {
        if (self.status == 'pending') {
            self.reason = reason
            self.status = 'rejected'
            self.onRejected.forEach(e => e())
        }

    }
    try {
        executor(resolved, rejected)
    } catch (e) {
        console.log(e)
    }
}

function resolvePromise(Promise2,x,resolve,reject) {
    if (Promise2 === x) {
        throw new TypeError('Chaining cycle detected for Promise #<Promise>')
    }
    let called;
    if((x != null && typeof x === 'object') || typeof x === "function") {
        try {
            let then = x.then
            if(typeof then === "function") {
                then.call(x,function (y) {
                    if(!called) {
                        called = true
                    } else {
                        return
                    }
                    resolvePromise(x,y,resolve,reject)
                },function (r) {
                    if(!called) {
                        called = true
                    } else {
                        return
                    }
                    reject(r)
                })

            } else {
                resolve(x)
            }
        } catch (e) {
            if(!called) {
                called = true
            } else {
                return
            }
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.prototype.then = function (onfulfilled, onrejected) {
    // console.log(this)
    onfulfilled =typeof onfulfilled === "function"?onfulfilled: function (data) {
        return data
    }
    onrejected = typeof onrejected === "function" ?onrejected: function (err) {
        throw err
    }
    let self = this
    let Promise2
    Promise2 = new Promise(function (resolved, rejected) {
        if (self.status == 'fulfilled') {
            setTimeout(function () {
                try {
                    let x = onfulfilled(self.value)
                    resolvePromise(Promise2,x,resolved,rejected)
                } catch (e) {
                    rejected(e)
                }
            },0)
        }
        if(self.status == 'rejected') {
            setTimeout(function () {
               try{
                   let x = onrejected(self.reason)
                   resolvePromise(Promise2,x,resolved,rejected)
               } catch (e) {
                   rejected(e)
               }
            },0)
        }
        if (self.status == 'pending') {
            self.onResolved.push(function () {
                setTimeout(function () {
                   try{
                       let x = onfulfilled(self.value)
                       resolvePromise(Promise2,x,resolved,rejected)
                   }catch (e) {
                       rejected(e)
                   }
                },0)
            })
            self.onRejected.push(function () {
                setTimeout(function () {
                    try{
                        let x = onrejected(self.reason)
                        resolvePromise(Promise2,x,resolved,rejected)
                    } catch (e) {
                        rejected(e)
                    }
                },0)
            })
        }
    })
    return Promise2
}

Promise.deferred = Promise.defer = function () {
    let dfd = {}
    dfd.promise = new Promise((resolved,rejected) => {
        dfd.resolve = resolved
        dfd.reject = rejected
    })
    return dfd
}


module.exports = Promise
