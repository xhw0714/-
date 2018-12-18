const Event = require('./Event')

const event = new Event
function aa() {
    console.log('aa')
}
event.once('newListener',function (event) {
    console.log(11)
})
event.on('aa',aa)

// event.emit('aa')

// event.off('aa',aa)

event.emit('aa')
event.emit('aa')
