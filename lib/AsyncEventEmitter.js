'use strict';

var EventEmitter = require('events').EventEmitter,
    async = require('async'),
    AsyncEventEmitter;


module.exports = exports = AsyncEventEmitter = function AsyncEventEmitter () {
  EventEmitter.call(this);
};

require('inherits')(AsyncEventEmitter, EventEmitter);


/* Public methods
============================================================================= */

AsyncEventEmitter.prototype.emit = function(event, data, callback) {
  var self = this,
      listeners = self._events[event] || [];

  // Optional data argument
  if(!callback && typeof data === 'function') {
    callback = data;
    data = undefined;
  }

  // Special treatment of internal newListener and removeListener events
  if(event === 'newListener' || event === 'removeListener') {
    data = {
      event: data,
      fn: callback
    };

    callback = undefined;
  }

  // A single listener is just a function not an array...
  listeners = Array.isArray(listeners) ? listeners : [listeners];

  async.eachSeries(listeners, function (fn, next) {
    // Support synchronous functions
    if(fn.length < 2) {
      fn.call(self, data);
      return next();
    }

    // Async
    fn.call(self, data, next);
  }, callback);

  return self;
};


AsyncEventEmitter.prototype.once = function (type, listener) {
  var self = this,
      g;

  if (typeof listener !== 'function') {
    throw new TypeError('listener must be a function');
  }

  // Hack to support set arity
  if(listener.length >= 2) {
    g = function (e, next) {
      self.removeListener(type, g);
      listener(e, next);
    };
  }
  else {
    g = function (e) {
      self.removeListener(type, g);
      listener(e);
    };
  }

  g.listener = listener;
  self.on(type, g);

  return self;
};
