function sum(a, b) {
    return a + b;
}
function toUpper(str) {
    return str.toUpperCase();
}
function add(str) {
    return 'zf' + str
}

// let compose = (...fns) => fns.reduce(function(a, b){
//     // console.log("p",a,"n", b)
//     return function(...args){
//         // console.log(...args)
//         return a(b(...args))
//     }
// });


Array.prototype.reduce = function (callback,prev) {
    if (this.length > 1) {
        for (let i =0;i<this.length;i++) {
            if (prev == null) {
                prev = callback(this[i],this[i + 1])
            } else {
                prev = callback(prev,this[i])
            }
        }
        return prev
    } else if (this.length === 1 && prev == null) {
        return this[0]
    } else if (this.length === 1 && prev != null) {
        return callback(prev,this[0])
    } else {
        return this
    }
}


let compose = (...fns) => fns.reduce((prev,next) => (...args) => prev(next(...args)))
//
// // 正向的reduce 最终收敛的结果 需要是一个函数
// // add(toUpper(args))
let composeFn = compose( add,toUpper,sum);
let result = composeFn('a', 'b');
console.log(result);


// console.log([1].reduce(function (a,b) {
//     return a + b
// },1))

