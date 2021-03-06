(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
var CircleCollisionComponent = function(entity, radius){
    this.entity = entity;
    this.radius = radius;
    this.type = 'circle';
};

CircleCollisionComponent.prototype.collidesWith = function(entity){
    if(entity.components.collision.type === 'circle'){
        return this.collideCircle(entity);
    } else if (entity.components.collision.type === 'rect'){
        return this.collideRect(entity);
    }

    return false;
};

CircleCollisionComponent.prototype.collideCircle = function(entity){
    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;

    var radiusA = this.radius;
    var radiusB = entity.components.collision.radius;

    var diff = {
        x: positionA.x - positionB.x,
        y: positionA.y - positionB.y
    };

    var distanceSquared = diff.x * diff.x + diff.y + diff.y;
    var radiusSum = radiusA + radiusB;

    return distanceSquared < radiusSum * radiusSum;
};



CircleCollisionComponent.prototype.collideRect = function(entity){
    var clamp = function(value, low, high){
        if(value < low){
            return low;
        }

        if(value > high){
            return high;
        }

        return value;
    };

    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;
    var sizeB = entity.components.collision.size;


    var closest = {
        x: clamp(positionA.x, positionB.x - sizeB.x / 2, positionB.x + sizeB.x / 2),
        y: clamp(positionA.y, positionB.y - sizeB.y / 2, positionB.y + sizeB.y / 2)
    };


    var radiusA = this.radius;

    var diff = {
        x: positionA.x - closest.x,
        y: positionA.y - closest.y
    };

    var distanceSquared = diff.x * diff.x + diff.y * diff.y;
    return distanceSquared < radiusA * radiusA;
};

exports.CircleCollisionComponent = CircleCollisionComponent;




},{}],3:[function(require,module,exports){
var RectCollisionComponent = function(entity, size){
    this.entity = entity;
    this.size = size;
    this.type = 'rect';
};

RectCollisionComponent.prototype.collidesWith = function(entity){
    if(entity.components.collision.type === 'circle'){
        return this.collideCircle(entity);
    } else if(entity.components.collision.type === 'rect'){
        return this.collideRect(entity);
    }

    return false;
};

RectCollisionComponent.prototype.collideCircle = function(entity){
    return entity.components.collision.collideRect(this.entity);
};

RectCollisionComponent.prototype.collideRect = function(entity){
    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;

    var sizeA = this.size;
    var sizeB = entity.components.collision.size;

    var leftA = positionA.x - sizeA.x/2;
    var rightA = positionA.x + sizeA.x/2;
    var bottomA = positionA.y - sizeA.y/2;
    var topA = positionA.y + sizeA.y/2;

    var leftB = positionB.x - sizeB.x/2;
    var rightB = positionB.x + sizeB.x/2;
    var bottomB = positionB.y - sizeB.y/2;
    var topB = positionB.y + sizeB.y/2;

    return !(leftA > rightB || leftB > rightA || bottomA > topB || bottomB > topA);

};

exports.RectCollisionComponent = RectCollisionComponent;

},{}],4:[function(require,module,exports){
var BackgroundGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();

    this.imgObject.src = BackgroundGraphicsComponent.DEFAULT_BACKGROUND_IMAGE;

};

BackgroundGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;
    context.save();

    context.translate(position.x, position.y);

    context.scale(1, -1);
    context.drawImage(this.imgObject, 0, 0, this.imgObject.width, this.imgObject.height, -this.entity.width/2, -0.5, this.entity.width, this.entity.height);
    context.restore();
};

BackgroundGraphicsComponent.DEFAULT_BACKGROUND_IMAGE = './img/flappy-background.png';

exports.BackgroundGraphicsComponent = BackgroundGraphicsComponent;
},{}],5:[function(require,module,exports){
var BirdGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = BirdGraphicsComponent.BIRD_IMG_SRC;

    this.hasClicked = false;
};




//remember the width of the image in terms of pixel size is 32pixels

BirdGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, BirdGraphicsComponent.BIRD_RADIUS, 0, 2*Math.PI);
    context.closePath();

    //will have to check if the bird's state is flapping or not

    context.scale(1, -1);

    //context.drawImage with 3 parameters
    if(this.hasClicked){
        context.rotate(-Math.PI/4);
        context.drawImage(this.imgObject, 38, 0, 38, 38, -BirdGraphicsComponent.BIRD_RADIUS, -BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    } else{
        context.rotate(Math.PI/8);
        context.drawImage(this.imgObject, 0, 0, 38, 38, -BirdGraphicsComponent.BIRD_RADIUS, -BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    }

    //if the physics velocity is less than 0 then flip.
    if(this.entity.components.physics.velocity.y < 0){
        this.hasClicked = false;
    }

    context.restore();
};



BirdGraphicsComponent.BIRD_IMG_SRC = './img/fb_bird.png';
BirdGraphicsComponent.BIRD_RADIUS = 0.0138888888888888;


exports.BirdGraphicsComponent = BirdGraphicsComponent;


},{}],6:[function(require,module,exports){
var PipeGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = this.entity.imgSrc;


};

PipeGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    //fill the path with a rectangle
    context.save();

    context.translate(position.x, position.y);
    context.drawImage(this.imgObject, -this.entity.width/2, -this.entity.height/2, this.entity.width, this.entity.height);



    context.restore();


};

PipeGraphicsComponent.prototype.onload = function(context, imgObject){
};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;


},{}],7:[function(require,module,exports){
var PhysicsComponent = function(entity){
    this.entity = entity;

    this.position = {
        x: 0,
        y: 0
    };

    this.velocity = {
        x: 0,
        y: 0
    };

    this.acceleration = {
        x: 0,
        y: 0
    };



};

PhysicsComponent.prototype.update = function(delta){
    this.velocity.x += this.acceleration.x * delta;
    this.velocity.y += this.acceleration.y * delta;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
};

exports.PhysicsComponent = PhysicsComponent;
},{}],8:[function(require,module,exports){
var physicsComponent = require('../components/physics/physics');
var graphicsComponent = require('../components/graphics/background');


var Background = function(positionX, positionY, width, height, bus){
    this.setup(positionX, positionY, width, height, bus);
};

Background.prototype.setup = function(positionX, positionY, width, height, bus){
    this.bus = bus;

    var physics = new physicsComponent.PhysicsComponent(this);

    physics.position.x = positionX;
    physics.position.y = positionY;

    physics.velocity.x = Background.DEFAULT_VELOCITY;


    //determine the width and the height

    this.width = width;
    this.height = height;

    var graphics = new graphicsComponent.BackgroundGraphicsComponent(this);


    this.components = {
        physics: physics,
        graphics: graphics
    };
};

Background.DEFAULT_VELOCITY = -0.2;

exports.Background = Background;
},{"../components/graphics/background":4,"../components/physics/physics":7}],9:[function(require,module,exports){

    var graphicsComponent = require('../components/graphics/bird');
    var physicsComponent = require('../components/physics/physics');
    var collisionComponent = require('../components/collision/circle');
    var pipe = require('../entities/pipe');
    var pipeMarker = require('../entities/pipemarker');


    var Bird = function(bus){
        var physics = new physicsComponent.PhysicsComponent(this);
        physics.position.y = Bird.DEFAULT_POSITION_Y;
        physics.acceleration.y = -2;

        var graphics = new graphicsComponent.BirdGraphicsComponent(this);

        var collision = new collisionComponent.CircleCollisionComponent(this, 0.02);
        collision.onCollision = this.onCollision.bind(this);

        this.bus = bus;

        this.components = {
            graphics: graphics,
            physics: physics,
            collision: collision
        };
    };

    Bird.prototype.onCollision = function(entity){
        if(entity instanceof pipeMarker.PipeMarker){
            //increase the score then remove the pipe marker
            this.bus.emit('pipeMarkerCollision', entity);
            this.bus.emit('addScore');
        } else {
            this.reset();

            if(entity instanceof pipe.Pipe){
                this.bus.emit('birdCollision');
                this.bus.emit('resetScore');
            }
        }

    };

    Bird.prototype.reset = function(){
        var position = this.components.physics.position;


        //set the position to the original.
        position.x = Bird.DEFAULT_POSITION_X;
        position.y = Bird.DEFAULT_POSITION_Y;

        //set the velocity
        this.components.physics.velocity.y = 0;
    };


    //

    Bird.DEFAULT_POSITION_X = 0;
    Bird.DEFAULT_POSITION_Y = 0.5;

    exports.Bird = Bird;

},{"../components/collision/circle":2,"../components/graphics/bird":5,"../components/physics/physics":7,"../entities/pipe":12,"../entities/pipemarker":13}],10:[function(require,module,exports){
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');


var BottomWall = function(bus){
    this.setup(bus);
};

BottomWall.prototype.setup = function(bus){
    this.bus = bus;
    var physics = new physicsComponent.PhysicsComponent(this);

    this.canvas = document.getElementById('main-canvas');

    this.width = this.canvas.width/this.canvas.height;
    this.height = BottomWall.DEFAULT_HEIGHT;

    physics.position.x = 0;
    physics.position.y = -this.height/2;


    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y:this.height});

    this.components = {
        physics: physics,
        collision: collision
    };

    collision.onCollision = this.onCollision.bind(this);
};


BottomWall.DEFAULT_HEIGHT = 0.25;

BottomWall.prototype.onCollision = function(entity){

};

exports.BottomWall = BottomWall;

},{"../components/collision/rect":3,"../components/physics/physics":7}],11:[function(require,module,exports){
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');

var LeftWall = function(bus){
    this.setup(bus);
};

LeftWall.prototype.setup = function(bus){
    this.bus = bus;
    var physics = new physicsComponent.PhysicsComponent(this);

    this.canvas = document.getElementById('main-canvas');

    this.width = LeftWall.DEFAULT_WIDTH;
    this.height = LeftWall.DEFAULT_HEIGHT;

    physics.position.x = (-this.canvas.width/this.canvas.height/2) - 2*this.width;
    physics.position.y = LeftWall.DEFAULT_POSITION_Y;

    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y:this.height});

    this.components = {
        physics: physics,
        collision: collision
    };

    collision.onCollision = this.onCollision.bind(this);
};



LeftWall.prototype.onCollision = function(entity){

};

LeftWall.DEFAULT_WIDTH =  0.25;
LeftWall.DEFAULT_HEIGHT = 1;
LeftWall.DEFAULT_POSITION_X = 0;
LeftWall.DEFAULT_POSITION_Y = 0.5;

exports.LeftWall = LeftWall;




},{"../components/collision/rect":3,"../components/physics/physics":7}],12:[function(require,module,exports){
var graphicsComponent = require('../components/graphics/pipe');
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');
var leftWall = require('../entities/leftwall');


var Pipe = function(positionX, positionY, width, height, pipeDirection, bus){
    this.bus = bus;

    var physics = new physicsComponent.PhysicsComponent(this);


    //put the position
    physics.position.x = positionX ? positionX : Pipe.DEFAULT_POSITION_X;
    physics.position.y = positionY ? positionY : Pipe.DEFAULT_POSITION_Y;

    physics.velocity.x = -0.2;

    //dimensions go here
    this.width = width ? width : Pipe.DEFAULT_WIDTH;
    this.height = height ? height : Pipe.DEFAULT_HEIGHT;

    //directions
    if(pipeDirection === 'up'){
        this.imgSrc = Pipe.PIPE_IMAGE_UP;
    } else {
        this.imgSrc = Pipe.PIPE_IMAGE_DOWN;
    }

    var graphics = new graphicsComponent.PipeGraphicsComponent(this);

    //colision component
    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y: this.height });
    //binding
    collision.onCollision = this.onCollision.bind(this);




    this.components = {
        physics: physics,
        collision: collision,
        graphics: graphics
    };

};

Pipe.DEFAULT_POSITION_X = 0;
Pipe.DEFAULT_POSITION_Y = 0;
Pipe.DEFAULT_WIDTH = 0;
Pipe.DEFAULT_HEIGHT = 0;

Pipe.PIPE_IMAGE_UP = './img/fb_pipe_up.png';
Pipe.PIPE_IMAGE_DOWN = './img/fb_pipe_down.png';

Pipe.prototype.onCollision = function(entity){
    if(entity instanceof leftWall.LeftWall){
        this.bus.emit('pipeCollision', this);
    }
};

exports.Pipe = Pipe;


},{"../components/collision/rect":3,"../components/graphics/pipe":6,"../components/physics/physics":7,"../entities/leftwall":11}],13:[function(require,module,exports){
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');



var Pipe = require('../entities/pipe').Pipe;

var PipeMarker = function(bus, pipe){
    if(!(pipe && (pipe instanceof Pipe))){
        return;
    }

    this.setup(pipe, bus);
};

PipeMarker.prototype.setup = function(pipe, bus){
    this.pipe = pipe;
    this.bus = bus;
    this.canvas = document.getElementById('main-canvas');

    //physics component
    var physics = new physicsComponent.PhysicsComponent(this);

    this.width = PipeMarker.DEFAULT_WIDTH;
    this.height = PipeMarker.DEFAULT_HEIGHT;

    //we need to set the position of this marker to the right of 0.1 after the pipe in question
    physics.position.x = this.pipe.components.physics.position.x + this.pipe.width/2 + PipeMarker.GAP_FROM_PIPE + this.width/2;
    physics.position.y = 0.5;

    physics.velocity.x = this.pipe.components.physics.velocity.x;

    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y: this.height });

    this.components = {
        collision: collision,
        physics: physics
    };


};



PipeMarker.DEFAULT_HEIGHT = 1;
PipeMarker.DEFAULT_WIDTH = 0.01;
PipeMarker.GAP_FROM_PIPE = 0.01;


exports.PipeMarker = PipeMarker;


},{"../components/collision/rect":3,"../components/physics/physics":7,"../entities/pipe":12}],14:[function(require,module,exports){
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');


var TopWall = function(bus){
    this.setup(bus);
};

TopWall.prototype.setup = function(bus){
    this.bus = bus;
    var physics = new physicsComponent.PhysicsComponent(this);

    this.canvas = document.getElementById('main-canvas');

    this.width = this.canvas.width/this.canvas.height;
    this.height = TopWall.DEFAULT_HEIGHT;

    physics.position.x = 0;
    physics.position.y = 1 + this.height/2;


    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y:this.height});

    this.components = {
        physics: physics,
        collision: collision
    };

    collision.onCollision = this.onCollision.bind(this);
};


TopWall.DEFAULT_HEIGHT = 0.25;

TopWall.prototype.onCollision = function(entity){

};

exports.TopWall = TopWall;

},{"../components/collision/rect":3,"../components/physics/physics":7}],15:[function(require,module,exports){
    var resizeSystem = require('./systems/resize');
    var graphicsSystem = require('./systems/graphics');
    var physicsSystem = require('./systems/physics');
    var inputSystem = require('./systems/input');
    var pipeSystem = require('./systems/pipe');
    var ui = require('./systems/ui');
    var backgroundSystem = require('./systems/background');

    //EventEmitter submodule
    var EventEmitter = require('events').EventEmitter;

    var bird = require('./entities/bird');

    //require the walls
    var leftWall = require('./entities/leftwall');
    var topWall = require('./entities/topwall');
    var bottomWall = require('./entities/bottomwall');


    var FlappyBird = function(){
        this.setup();
    };

    FlappyBird.prototype.setup = function(){

        this.bus = new EventEmitter();
        this.resize = new resizeSystem.ResizeSystem(this.bus);

        this.entities = [new bird.Bird(this.bus), new leftWall.LeftWall(this.bus), new topWall.TopWall(this.bus), new bottomWall.BottomWall(this.bus)];
        this.graphics = new graphicsSystem.GraphicsSystem(this.entities, this.bus);
        this.physics = new physicsSystem.PhysicsSystem(this.entities, this.bus);
        this.input = new inputSystem.InputSystem(this.entities, this.bus);
        this.pipe = new pipeSystem.PipeSystem(this.entities, this.bus);
        this.ui = new ui.UISystem(this.entities, this.bus);
        this.background = new backgroundSystem.BackgroundSystem(this.entities, this.bus);

        this.resetScore();

        this.setEvents();
    };

    FlappyBird.prototype.run = function(){
        this.resize.run();
        this.graphics.run();
        this.physics.run();
        this.input.run();
        this.pipe.run();
        this.background.run();
    };

    FlappyBird.prototype.addScore = function(){
        this.score++;
        this.bus.emit('scoreChanged', this.score);

    };

    FlappyBird.prototype.setEvents = function(){
        this.bus.on('addScore', this.addScore.bind(this));
        this.bus.on('resetScore', this.resetScore.bind(this));
    };

    FlappyBird.prototype.resetScore = function(){

        this.score = 0;
        this.bus.emit('scoreChanged', this.score);
    };

    exports.FlappyBird = FlappyBird;

},{"./entities/bird":9,"./entities/bottomwall":10,"./entities/leftwall":11,"./entities/topwall":14,"./systems/background":17,"./systems/graphics":19,"./systems/input":20,"./systems/physics":21,"./systems/pipe":22,"./systems/resize":23,"./systems/ui":24,"events":1}],16:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function(){
    var app = new flappyBird.FlappyBird();
    app.run();
});





},{"./flappy_bird":15}],17:[function(require,module,exports){
var background = require('../entities/background');

var BackgroundSystem = function(entities, bus, utilities){
    if(!entities){
        return;
    }

    this.setup(entities, bus, utilities);
};

BackgroundSystem.prototype.setup = function(entities, bus){
    this.entities = entities;
    this.bus = bus;
    this.backgrounds = [];
    this.setupEntities();
    this.backgroundsIsResizing = false;
};

BackgroundSystem.prototype.setupEntities = function(){

    //we need to create the 2 entities responsible for the backgrounds and append it to the entities.

    var canvasWidth = window.innerWidth/window.innerHeight;
    var canvasHeight = window.innerHeight/window.innerHeight;
    var offCanvasPosition = (window.innerWidth-2)/window.innerHeight;


    var backgroundEntity1 = new background.Background(0, canvasHeight/2, canvasWidth, canvasHeight, this.bus);

    var backgroundEntity2 = new background.Background(offCanvasPosition, canvasHeight/2, canvasWidth, canvasHeight, this.bus);

    this.entities.unshift(backgroundEntity1, backgroundEntity2);
    this.backgrounds.push(backgroundEntity1, backgroundEntity2);

};

BackgroundSystem.prototype.run = function(){
    //interval to check and reposition backgrounds
    window.setInterval(this.checkAndRepositionBackgrounds.bind(this), 1000/60);

    //resize backgrounds on window resize.
    this.bus.on('windowResize', this.resizeBackgrounds.bind(this));
};


BackgroundSystem.prototype.resizeBackgrounds = function(){
    var canvasWidth = (window.innerWidth)/window.innerHeight;
    var canvasHeight = window.innerHeight/window.innerHeight;

    var offCanvasPosition = (window.innerWidth-2)/window.innerHeight;

    var backgroundEntity1 = this.backgrounds[0];
    var backgroundEntity2 = this.backgrounds[1];


    backgroundEntity1.components.physics.position.x = 0;
    backgroundEntity1.components.physics.position.y = canvasHeight/2;
    backgroundEntity1.width = canvasWidth;
    backgroundEntity1.height = canvasHeight;

    backgroundEntity2.components.physics.position.x = offCanvasPosition;
    backgroundEntity2.components.physics.position.y = canvasHeight/2;
    backgroundEntity2.width = canvasWidth;
    backgroundEntity2.height = canvasHeight;


};

BackgroundSystem.prototype.checkAndRepositionBackgrounds = function(){

    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        var restartPosition = ((window.innerWidth-2)/window.innerHeight);

        if(entity instanceof background.Background && entity.components.physics.position.x < -(restartPosition)){
            entity.components.physics.position.x = restartPosition;
        }
    }

};

BackgroundSystem.prototype.switchBackground = function(){

};

exports.BackgroundSystem = BackgroundSystem;
},{"../entities/background":8}],18:[function(require,module,exports){
var CollisionSystem = function(entities, bus){
    this.bus = bus;
    this.entities = entities;
};

CollisionSystem.prototype.tick = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entityA = this.entities[i];

        if(!('collision' in entityA.components)){
            continue;
        }

        for(var j = i+ 1; j < this.entities.length; j++){
            var entityB = this.entities[j];
            if(!('collision' in entityB.components)){
                continue;
            }

            if(!entityA.components.collision.collidesWith(entityB)){
                continue;
            }

            if(entityA.components.collision.onCollision){
                entityA.components.collision.onCollision(entityB);
            }

            if(entityB.components.collision.onCollision){
                entityB.components.collision.onCollision(entityA);
            }
        }

    }
}

exports.CollisionSystem = CollisionSystem;
},{}],19:[function(require,module,exports){
    var GraphicsSystem = function(entities, bus){
        this.bus = bus;
        this.entities = entities;

        // Canvas is where we draw
        this.canvas = document.getElementById('main-canvas');

        // Context is what we draw to
        this.context = this.canvas.getContext('2d');

    };

    GraphicsSystem.prototype.run = function(){
        // continue the render loop
        window.requestAnimationFrame(this.tick.bind(this));

    };

    GraphicsSystem.prototype.tick = function(){

        // Set the canvas to the correct size if the window is resized
        if(this.canvas.width !== this.canvas.offsetWidth ||
            this.canvas.height !== this.canvas.offsetHeight){
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }

        // Clear the canvas
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

        this.context.save();
        this.context.translate(this.canvas.width/2, this.canvas.height);
        this.context.scale(this.canvas.height, -this.canvas.height);

        // Rendering goes here
        for (var i = 0; i < this.entities.length; i++){
            var entity = this.entities[i];

            if(!('graphics' in entity.components)){
                continue;
            }

            entity.components.graphics.draw(this.context);
        }

        this.context.restore();

        window.requestAnimationFrame(this.tick.bind(this));
    };

    exports.GraphicsSystem = GraphicsSystem;


},{}],20:[function(require,module,exports){
var birdEntity = require('../entities/bird');

var InputSystem = function(entities, bus){
    this.bus = bus;
    this.entities = entities;


    // canvas is where we get input forom
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function(){
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function(){
    var bird = this.getBirdFromEntities();

    if(bird !== null){
        bird.components.physics.velocity.y = 0.7;
        bird.components.graphics.hasClicked = true;
    }
};

InputSystem.prototype.getBirdFromEntities = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        if(entity instanceof birdEntity.Bird){
            return entity;
        }
    }

    return null;
};

//

exports.InputSystem = InputSystem;


},{"../entities/bird":9}],21:[function(require,module,exports){
var collisionSystem = require('./collision');


var PhysicsSystem = function(entities, bus){
    this.bus = bus;
    this.entities = entities;
    this.collisionSystem = new collisionSystem.CollisionSystem(entities, bus);
};

PhysicsSystem.prototype.run = function(){
    // Run the update loop
    window.setInterval(this.tick.bind(this), 1000/60);
};


PhysicsSystem.prototype.tick = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        if(!'physics' in entity.components){
            continue;
        }

        entity.components.physics.update(1/60);

        //perform a tick on the collision system.
        this.collisionSystem.tick();


    }

};

exports.PhysicsSystem = PhysicsSystem;
},{"./collision":18}],22:[function(require,module,exports){
var pipe = require('../entities/pipe');
var pipeMarker = require('../entities/pipemarker');

var PipeSystem = function(entities, bus){
    if(!entities){
        return;
    }
    this.setup(entities, bus);
};

// function to calculate the offscreen coordinates
PipeSystem.prototype.calculateOffScreenX = function(){
    return this.canvas.width/this.canvas.height/2;
};

PipeSystem.prototype.calculateY = function(){
    return 1 - PipeSystem.PIPE_HEIGHT/2;
};

PipeSystem.prototype.setup = function(entities, bus){
    this.bus = bus;
    this.canvas = document.getElementById('main-canvas');
    this.entities = entities;
    this.generationCount = 0;
    this.setEvents();
};

PipeSystem.prototype.run = function(){
    setInterval(this.tick.bind(this), PipeSystem.PIPE_GENERATION_INTERVAL);
};

PipeSystem.prototype.setEvents = function(){
    this.bus.on('birdCollision', this.removePipes.bind(this));
    this.bus.on('pipeCollision', this.removePipe.bind(this));
    this.bus.on('pipeMarkerCollision', this.removePipeMarker.bind(this));
};

PipeSystem.prototype.removePipes = function(){
    //remove all pipe events
    for(var i= this.entities.length - 1; i >=0; i--){
        var entity = this.entities[i];

        if(entity instanceof pipe.Pipe){
            this.removePipe(entity);
        }
    }
};

PipeSystem.prototype.generatePipe = function(){
    //generate the pipe
    var offScreenX = this.calculateOffScreenX();

    //push a new instance of a pipe onto the screen
    var newPipe;

    //collision detection
    if(parseInt(this.generationCount)%2 === 0){
        newPipe = new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, PipeSystem.PIPE_HEIGHT - PipeSystem.PIPE_HEIGHT/2, PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT, 'up', this.bus);
        this.entities.push(newPipe);
    } else {
        newPipe = new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, this.calculateY(), PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT, 'down', this.bus);
        this.entities.push(newPipe);
    }

    this.generatePipeMarker(newPipe);

    this.generationCount++;

};

PipeSystem.prototype.removePipe = function(pipe){
    //pipe marker removal only if not null
    if(pipe.pipeMarker){
        this.removePipeMarker(pipe.pipeMarker);
    }

    var index = this.entities.indexOf(pipe);
    this.entities.splice(index, 1);
};

PipeSystem.prototype.generatePipeMarker = function(pipe){
    var newPipeMarker = new pipeMarker.PipeMarker(this.bus, pipe);
    this.entities.push(newPipeMarker);
    pipe.pipeMarker = newPipeMarker;
};

PipeSystem.prototype.removePipeMarker = function(pipeMarker){
    var index = this.entities.indexOf(pipeMarker);
    this.entities.splice(index, 1);
    pipeMarker.pipe.pipeMarker = null;
};




// this array is designed to insert in random peices of pipe to the game
PipeSystem.RANDOM_PEICES = [

];


PipeSystem.prototype.tick = function(){
    this.generatePipe();
};

PipeSystem.PIPE_GENERATION_INTERVAL = 2000;
PipeSystem.PIPE_HEIGHT = 0.5;
PipeSystem.PIPE_WIDTH = 0.075;

exports.PipeSystem = PipeSystem;

},{"../entities/pipe":12,"../entities/pipemarker":13}],23:[function(require,module,exports){
var ResizeSystem = function(bus){
    this.setup(bus);
};

ResizeSystem.prototype.setup = function(bus){
    this.rtime = undefined;
    this.timeout = false;
    this.delta = 200;
    this.bus = bus;
};

ResizeSystem.prototype.run = function(){
    window.addEventListener('resize', this.windowResize.bind(this));
};

ResizeSystem.prototype.windowResize = function(){
    this.rtime = new Date();

    if(this.timeout === false){
        this.timeout = true;
        setTimeout(this.triggerWindowResize.bind(this), this.delta);
    }
};

ResizeSystem.prototype.triggerWindowResize = function(){
    if(new Date() - this.rtime < this.delta){
        setTimeout(this.triggerWindowResize.bind(this), this.delta);
    } else {
        this.timeout = false;
        this.bus.emit('windowResize');
    }
};


exports.ResizeSystem = ResizeSystem;
},{}],24:[function(require,module,exports){
var UISystem = function(entities, bus){
    if(!entities){
        return;
    }

    this.setup(entities, bus);
};

UISystem.prototype.setup = function(entities, bus){
    this.entities = entities;
    this.bus = bus;
    this.scoreElement = document.getElementById('score');
    this.setEvents();
};

UISystem.prototype.setEvents = function(){
    this.bus.on('scoreChanged', this.changeScore.bind(this));
};

UISystem.prototype.changeScore = function(score){
    this.scoreElement.textContent = score;

};

UISystem.OVERLAY_ID = 'overlay';
UISystem.SCORE_ID = 'score';

exports.UISystem = UISystem;
},{}]},{},[16]);
