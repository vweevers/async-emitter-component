var EventEmitter = require('events').EventEmitter
  , each = require('each-series')

function AsyncEventEmitter () {
  EventEmitter.call(this)
}

require('inherits')(AsyncEventEmitter, EventEmitter)

AsyncEventEmitter.prototype.emit = function(event) {
  var listeners = this.listeners(event)

  // variable number of arguments, last is optional callback
  var args = [], cb, last = arguments.length-1
  
  if (typeof arguments[last] == 'function')
    cb = arguments[last--]

  for(var i=1; i<=last; i++) args.push(arguments[i])

  each(listeners, function (fn, _, next) {
    var actual = fn.listener || fn

    if(actual.length < args.length+1) next(fn.apply(this, args)) // sync
    else fn.apply(this, args.concat(next)) // async
      
  }.bind(this), cb)

  return this
}

AsyncEventEmitter.prototype.once = function (event, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('listener must be a function')

  var g = function () {
    this.removeListener(event, g)
    listener.apply(this, arguments)
  }

  g.listener = listener
  this.on(event, g)

  return this
}

module.exports = AsyncEventEmitter
