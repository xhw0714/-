#! /usr/bin/env node
class Event {
    constructor() {
        this._Event = {}
        this._DefaultMaxListeners = 10
    }

    once (eventName,cb) {
        function one(...args) {
            cb(...args)
            this.off(eventName,one)
        }
        this.on(eventName,one)
    }
    on (eventName, cb) {
        this._Event[eventName] = this._Event[eventName] || []
        this._Event[eventName].push(cb)
    }
    emit (eventName,...args) {
        if(!this._Event[eventName]) return
        if (eventName !== 'newListener') {
            this._Event['newListener'] = this._Event['newListener'] || []
            this._Event['newListener'].forEach(e => e.call(this,eventName))
            this._Event[eventName].forEach(e => e.call(this,...args))
        }
    }
    off (eventName,fn) {
        this._Event[eventName] = this._Event[eventName].filter(e => e != fn)
    }
    removeListener () {
        this._Event['newListener'] = []
    }
    listenerCount (emitter,eventName) {
        emitter._Event[eventName] = emitter._Event[eventName] || []
        return emitter._Event[eventName].length
    }

}
console.log("启动成功")


module.exports = Event
