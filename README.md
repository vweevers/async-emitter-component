# async-emitter-component

> An event emitter that supports serial execution of asynchronous and synchronous event listeners. The call-chain can be interrupted, similar to the DOM's `e.stopPropagation()`.

[![Dependency Status](https://img.shields.io/david/vweevers/async-emitter-component.svg?style=flat-square)](https://david-dm.org/vweevers/async-emitter-component)

## about

This is a fork of [async-eventemitter](https://www.npmjs.com/package/async-eventemitter), with the following differences:

- Using [emitter-component](https://www.npmjs.com/package/emitter-component) instead of [EventEmitter](https://nodejs.org/api/events.html)
- Supports a variable number of arguments
- No `before`, `after`, `at` or `first` methods, as I consider those to be out of scope.

Because it supports regular (synchronous) listeners, it's a drop-in replacement for `emitter-component`.

## example

```javascript
var AsyncEventEmitter = require('async-emitter-component');
var emitter = new AsyncEventEmitter();

emitter
  .on('answer', function (question, answer) {
    // Synchronous
    console.log('the answer to %s is %s', question, answer);
  })
  .on('answer', function (question, answer, next) {
    // Asynchronous
    next(new Error('I stopped propagation'));
  })

emitter.emit('answer', 'life', 42, function done(err) {
  console.log(err.message);
});
```

## usage

Usage is nearly similar to [emitter-component](https://www.npmjs.com/package/emitter-component) and [EventEmitter](https://nodejs.org/api/events.html).

### `on || once(event, [data, ..], [next])`

Subscribe to `event`. Asynchronous listeners should match the number of event arguments (2 in the example above).

### `emit(event, [data, ..], [done])`

Executes all listeners for the event in order with the supplied data argument(s). The optional callback is called when all of the listeners are done, or if one of them returned an error.

### `emitSync(event, [data, ..])`

Emit synchronously, like the regular `Emitter.prototype.emit`.

## license

[MIT](http://opensource.org/licenses/MIT) © Andreas Hultgren, Vincent Weevers
