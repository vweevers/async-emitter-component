var should = require('should')
  , AsyncEventEmitter = require('../')
  , events
  , i

describe('An instance', function () {
  it('should be created', function () {
    events = new AsyncEventEmitter();
  });
});

describe('on()', function () {
  function listener1 (e, callback) {
    // Ensure context is kept
    this.should.equal(events);

    setTimeout(function () {
      i++;

      (typeof e).should.equal('object');
      (typeof callback).should.equal('function');

      callback();
    });
  }

  function listener2 (e, callback) {
    setTimeout(function () {
      i++;

      (typeof e).should.equal('object');
      (typeof callback).should.equal('function');

      callback();
    });
  }

  it('should register an eventlistener', function () {
    events.on('test1', listener1);
    events.on('test1', listener2);
    events.listeners('test1').should.eql([listener1, listener2]);
  });
});

describe('emit()', function () {
  it('should emit event and call callback after all eventlisteners are done', function (done) {
    i = 0;

    events.emit('test1', {}, function (err) {
      i.should.equal(2);
      done();
    });
  });

  it('should emit with no argument', function (done) {
    events.on('no-arg', function (next) {
      (typeof next).should.equal('function');
      next();
      done();
    });

    events.emit('no-arg');
  });

  it('should emit with only data argument', function (done) {
    events.on('data-only', function (e, next) {
      e.should.equal(1);
      next();
      done();
    });

    events.emit('data-only', 1);
  });

  it('should emit with only callback argument', function (done) {
    events.on('function-only', function (next) {
      (typeof next).should.equal('function');
      next();
    });

    events.emit('function-only', done);
  });

  it('should emit with multiple arguments', function (done) {
    events.on('more-data', function (a, b, next) {
      a.should.equal(1);
      b.should.equal(2);
      next();
      done();
    });

    events.emit('more-data', 1, 2);
  });

  it('should emit with multiple arguments and cb', function (done) {
    events.on('more-data-cb', function (a, b, next) {
      a.should.equal(1);
      b.should.equal(2);
      next();
    });

    var called = false
    events.emit('more-data-cb', 1, 2, function(){
      called = true
    });

    setImmediate(function() {
      called.should.equal(true);
      done()
    })
  });
});

describe('eventlisteners', function () {
  it('should be synchronous if no next-argument specified', function (done) {
    events.on('sync', function (e) {
      e.should.equal(1);
    });

    events.emit('sync', 1, done);
  });
});

describe('next(err)', function () {
  it('should abort the callback chain', function (done) {
    events.on('err', function (next) {
      next(new Error('ok'));
    });

    events.on('err', function (next) {
      throw('Expected this function to not be called');
    });

    events.emit('err', function (err) {
      err.message.should.equal('ok');
      done();
    });
  });
});

describe('once()', function () {
  var i = 0;

  function listener1 (callback) {
    this.should.equal(events);
    setTimeout(function () {
      i++;
      callback();
    });
  }

  it('should register eventlisteners', function () {
    events.once('test-once', listener1);
    events.listeners('test-once').should.have.length(1);
  });

  describe('eventlisteners', function () {
    it('should only be called once', function (done) {
      events.emit('test-once', function () {
        i.should.equal(1);

        events.emit('test-once', function () {
          i.should.equal(1);
          done();
        });
      });
    });
  });
});

describe('once() 2', function () {
  it('should emit with no argument', function (done) {
    events.once('once-no-arg', function (next) {
      (typeof next).should.equal('function');
      next();
      done();
    });

    events.emit('once-no-arg');
  });

  it('should emit with only data argument', function (done) {
    events.once('once-data-only', function (e, next) {
      e.should.equal(1);
      next();
      done();
    });

    events.emit('once-data-only', 1);
  });

  it('should emit with only callback argument', function (done) {
    events.once('once-function-only', function (next) {
      (typeof next).should.equal('function');
      next();
    });

    events.emit('once-function-only', done);
  });
});

describe('removeAllListeners', function () {
  var events = new AsyncEventEmitter();

  events.on('test', function () {});
  events.on('test2', function () {});

  describe('(event)', function () {
    it('should remove all event listeners for event', function () {
      events.listeners('test').should.have.length(1);
      events.removeAllListeners('test');
      events.listeners('test').should.be.empty
    });
  });

  describe('()', function () {
    it('should remove all event listeners for all events', function () {
      events.listeners('test2').should.have.length(1);
      events.removeAllListeners();
      events.listeners('test2').should.be.empty;
    });
  });
});

describe('listeners()', function () {
  var events = new AsyncEventEmitter();

  function test () {}

  events.on('test', test);

  it('should return all listeners for the specified event', function () {
    var listeners = events.listeners('test');

    listeners.should.have.property('length').and.equal(1);
    listeners[0].should.equal(test);
  });
});

describe('all overriden methods', function () {
  var events = new AsyncEventEmitter();

  describe('(.on())', function () {
    it('should be chainable', function () {
      events.on('test', function () {}).should.be.instanceOf(AsyncEventEmitter);
    });
  });

  describe('(.once())', function () {
    it('should be chainable', function () {
      events.once('test', function () {}).should.be.instanceOf(AsyncEventEmitter);
    });
  });

  describe('(.emit())', function () {
    it('should be chainable', function () {
      events.emit('test').should.be.instanceOf(AsyncEventEmitter);
    });
  });
});
