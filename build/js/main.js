(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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




},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var BirdGraphicsComponent = function(entity){
    this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, 0.02, 0, 2*Math.PI);
    context.fill();
    context.closePath();
    context.restore();

};

exports.BirdGraphicsComponent = BirdGraphicsComponent;


},{}],4:[function(require,module,exports){
var PipeGraphicsComponent = function(entity){
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    //fill the path with a rectangle
    context.save();

    var cornerX = position.x - this.entity.width/2;
    var cornerY = position.y - this.entity.height/2;

    context.translate(position.x, position.y);


    context.beginPath();
    context.rect(-this.entity.width/2, -this.entity.height/2, this.entity.width, this.entity.height);
    context.fill();
    context.restore();


};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;


},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){

    var graphicsComponent = require('../components/graphics/bird');
    var physicsComponent = require('../components/physics/physics');
    var collisionComponent = require('../components/collision/circle');

    var Bird = function(){
        var physics = new physicsComponent.PhysicsComponent(this);
        physics.position.y = 0.5;
        physics.acceleration.y = -2;

        var graphics = new graphicsComponent.BirdGraphicsComponent(this);

        var collision = new collisionComponent.CircleCollisionComponent(this, 0.02);

        this.components = {
            graphics: graphics,
            physics: physics,
            collision: collision
        };
    };

    Bird.prototype.onCollision = function(entity){
      console.log("Bird collided with entity: ", entity);
    };

    exports.Bird = Bird;

},{"../components/collision/circle":1,"../components/graphics/bird":3,"../components/physics/physics":5}],7:[function(require,module,exports){

    var graphicsComponent = require('../components/graphics/pipe');
    var physicsComponent = require('../components/physics/physics');
    var collisionComponent = require('../components/collision/rect');

    var Pipe = function(positionX, positionY, width, height){
        var physics = new physicsComponent.PhysicsComponent(this);


        //put the position
        physics.position.x = positionX ? positionX : Pipe.DEFAULT_POSITION_X;
        physics.position.y = positionY ? positionY : Pipe.DEFAULT_POSITION_Y;

        physics.velocity.x = -0.2;

        //dimensions go here
        this.width = width ? width : Pipe.DEFAULT_WIDTH;
        this.height = height ? height : Pipe.DEFAULT_HEIGHT;


        var graphics = new graphicsComponent.PipeGraphicsComponent(this);

        //colision component
        var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y: this.height });
        //binding
        collision.onCollision = this.onCollision.bind(this);


        this.components = {
            graphics: graphics,
            physics: physics,
            collision: collision
        };
    };

    Pipe.DEFAULT_POSITION_X = 0;
    Pipe.DEFAULT_POSITION_Y = 0;
    Pipe.DEFAULT_WIDTH = 0;
    Pipe.DEFAULT_HEIGHT = 0;

    Pipe.prototype.onCollision = function(entity){
        console.log("Pipe collided with entity", entity);
    }

    exports.Pipe = Pipe;


},{"../components/collision/rect":2,"../components/graphics/pipe":4,"../components/physics/physics":5}],8:[function(require,module,exports){
    var graphicsSystem = require('./systems/graphics');
    var physicsSystem = require('./systems/physics');
    var inputSystem = require('./systems/input');
    var pipeSystem = require('./systems/pipe');

    var bird = require('./entities/bird');


    var FlappyBird = function(){
        this.entities = [new bird.Bird()];
        this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
        this.physics = new physicsSystem.PhysicsSystem(this.entities);
        this.input = new inputSystem.InputSystem(this.entities);
        this.pipe = new pipeSystem.PipeSystem(this.entities);
    };

    FlappyBird.prototype.run = function(){
        this.graphics.run();
        this.physics.run();
        this.input.run();
        this.pipe.run();
    };

    exports.FlappyBird = FlappyBird;


},{"./entities/bird":6,"./systems/graphics":11,"./systems/input":12,"./systems/physics":13,"./systems/pipe":14}],9:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function(){
    var app = new flappyBird.FlappyBird();
    app.run();
});





},{"./flappy_bird":8}],10:[function(require,module,exports){
var CollisionSystem = function(entities){
    this.entities = entities;
};

CollisionSystem.prototype.tick = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entityA = this.entities[i];

        if(!'collision' in entityA.components){
            continue;
        }

        for(var j = i+ 1; j < this.entities.length; j++){
            var entityB = this.entities[j];
            if(!'collision' in entityB.components){
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
},{}],11:[function(require,module,exports){
    var GraphicsSystem = function(entities){
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

            if(!'graphics' in entity.components){
                continue;
            }

            entity.components.graphics.draw(this.context);
        }

        this.context.restore();

        window.requestAnimationFrame(this.tick.bind(this));
    };

    exports.GraphicsSystem = GraphicsSystem;


},{}],12:[function(require,module,exports){
var InputSystem = function(entities){
    this.entities = entities;

    // canvas is where we get input forom
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function(){
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function(){
    var bird = this.entities[0];

    bird.components.physics.velocity.y = 0.7;
};

exports.InputSystem = InputSystem;


},{}],13:[function(require,module,exports){
var collisionSystem = require('./collision');

var PhysicsSystem = function(entities){
    this.entities = entities;
    this.collisionSystem = new collisionSystem.CollisionSystem(entities)
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
},{"./collision":10}],14:[function(require,module,exports){
var pipe = require('../entities/pipe');

var PipeSystem = function(entities){
    if(!entities){
        return;
    }
    this.setup(entities);
};

// function to calculate the offscreen coordinates
PipeSystem.prototype.calculateOffScreenX = function(){
    return this.canvas.width/this.canvas.height/2;
};

PipeSystem.prototype.calculateY = function(){
    return 1 - PipeSystem.PIPE_HEIGHT/2;
};

PipeSystem.prototype.setup = function(entities){
    this.canvas = document.getElementById('main-canvas');
    this.entities = entities;
    this.generationCount = 0;

};

PipeSystem.prototype.run = function(){
    setInterval(this.tick.bind(this), PipeSystem.PIPE_GENERATION_INTERVAL);
};

PipeSystem.prototype.generatePipe = function(){
    //generate the pipe
    var offScreenX = this.calculateOffScreenX();

    //push a new instance of a pipe onto the screen

    //collision detection
    if(parseInt(this.generationCount)%2 === 0){
        this.entities.push(new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, PipeSystem.PIPE_HEIGHT - PipeSystem.PIPE_HEIGHT/2, PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT));
    } else {
        this.entities.push(new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, this.calculateY(), PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT));
    }

    this.generationCount++;

};

///

// this array is designed to insert in random peices of pipe to the game
PipeSystem.RANDOM_PEICES = [

];


PipeSystem.prototype.tick = function(){
    this.generatePipe();
};

PipeSystem.PIPE_GENERATION_INTERVAL = 3000;
PipeSystem.PIPE_HEIGHT = 0.5;
PipeSystem.PIPE_WIDTH = 0.25;

/**** Questions to ask Joe
 * - When you resize the window because you have to
 * draw the shape outside the canvas the interval the pipes
 * generate become either wider/narrower and you
 * will come across issues where then one pipe can
 * collide with another.
 *
 * Now what I see is just shapes of items, now if then
 * they into graphics like actual bird/pipe assets that I have to import, say from a PNG
 * ,then what do I do in that situation?
 *
 *
 */

exports.PipeSystem = PipeSystem;

},{"../entities/pipe":7}]},{},[9]);
