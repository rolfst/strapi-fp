const EventEmitter = require('events')

class BCEventEmitter extends EventEmitter {}

const eventbus = new BCEventEmitter()

function register(id, fn) {
  eventbus.on(id, fn)
}

function emit(id, event) {
  eventbus.emit(id, event)
}

module.exports = {
  emit,
  register
}
