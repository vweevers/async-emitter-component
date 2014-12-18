var Emitter = require('emitter-component')

require('setimmediate')

function AsyncEmitter () {
  Emitter.call(this)
}

require('inherits')(AsyncEmitter, Emitter)

AsyncEmitter.prototype.emit = function(event) {
  var listeners = this.listeners(event)

  // variable number of arguments, last is optional callback
  var args = [], cb, last = arguments.length-1
  
  if (typeof arguments[last] == 'function')
    cb = arguments[last--]

  for(var i=1; i<=last; i++) args.push(arguments[i])

  each(listeners, function (fn, next) {
    var actual = fn.listener || fn

    if(actual.length < args.length+1) next(fn.apply(this, args)) // sync
    else fn.apply(this, args.concat(next)) // async
      
  }.bind(this), cb)

  return this
}

AsyncEmitter.prototype.emitSync = function() {
  Emitter.prototype.emit.apply(this, arguments)
}

AsyncEmitter.prototype.once = function (event, listener) {
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

// This is a copy of `each-series` (License: MIT)
// but without an isError check and with a browser friendly
// setimmediate.
function each(arr, iterator, cb) {
  var i = -1, loop = function() {
    if (++i >= arr.length) return cb && cb()

    iterator(arr[i], function(err) {
      if (err) return cb && cb(err)
      setImmediate(loop)
    })
  }

  loop()
}

module.exports = AsyncEmitter
