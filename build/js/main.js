(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
var PipeGraphicsComponent = function(entity){
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    //fill the path with a rectangle
    context.save();

    var cornerX = position.x - this.entity.width/2;
    var cornerY = position.y - this.entity.height/2;

    context.translate(cornerX, cornerY);


    context.beginPath();
    context.rect(0, 0, this.entity.width, this.entity.height);
    context.fill();
    context.restore();


};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;


},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){

    var graphicsComponent = require('../components/graphics/bird');
    var physicsComponent = require('../components/physics/physics');

    var Bird = function(){
        var physics = new physicsComponent.PhysicsComponent(this);
        physics.position.y = 0.5;
        physics.acceleration.y = -2;

        var graphics = new graphicsComponent.BirdGraphicsComponent(this);

        this.components = {
            graphics: graphics,
            physics: physics
        };
    };

    exports.Bird = Bird;

},{"../components/graphics/bird":1,"../components/physics/physics":3}],5:[function(require,module,exports){

    var graphicsComponent = require('../components/graphics/pipe');
    var physicsComponent = require('../components/physics/physics')

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

        this.components = {
            graphics: graphics,
            physics: physics
        };
    };

    Pipe.DEFAULT_POSITION_X = 0;
    Pipe.DEFAULT_POSITION_Y = 0;
    Pipe.DEFAULT_WIDTH = 0;
    Pipe.DEFAULT_HEIGHT = 0;

    exports.Pipe = Pipe;


},{"../components/graphics/pipe":2,"../components/physics/physics":3}],6:[function(require,module,exports){
    var graphicsSystem = require('./systems/graphics');
    var physicsSystem = require('./systems/physics');
    var inputSystem = require('./systems/input');
    var pipeSystem = require('./systems/pipe');

    var bird = require('./entities/bird');
    var pipe = require('./entities/pipe');

    var FlappyBird = function(){
        this.entities = [new bird.Bird(), new pipe.Pipe(0.5, 0.5, 0.5, 1)];
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


},{"./entities/bird":4,"./entities/pipe":5,"./systems/graphics":8,"./systems/input":9,"./systems/physics":10,"./systems/pipe":11}],7:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function(){
    var app = new flappyBird.FlappyBird();
    app.run();
});





},{"./flappy_bird":6}],8:[function(require,module,exports){
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

        //window.requestAnimationFrame(this.tick.bind(this));
    };

    exports.GraphicsSystem = GraphicsSystem;


},{}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
var PhysicsSystem = function(entities){
    this.entities = entities;
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
    }

};

exports.PhysicsSystem = PhysicsSystem;
},{}],11:[function(require,module,exports){
var PipeSystem = function(entities){
    if(!entities){
        return;
    }

    this.setup(entities);

};

// function to calculate the offscreen coordinates
PipeSystem.prototype.calculateOffScreen = function(){
    console.log('Window Height');
    console.log(this.canvas.width);
    console.log(this.canvas.height);

    console.log('Window Properties');
    console.log(window.innerWidth);
    console.log(window.innerHeight);

    var offscreedWidth = this.canvas.width
};

PipeSystem.prototype.setEvents = function(){
    //window.addEventListener('resize', this.calculateOffScreen.bind(this), false);
};

PipeSystem.prototype.setup = function(entities){
    this.canvas = document.getElementById('main-canvas');
    this.entities = entities;
    this.generationCount = 0;

    this.calculateOffScreen();


};

PipeSystem.prototype.run = function(){
    this.setEvents();
};

// what we need to do for each 3 seconds we need to
// generate a pipe away from the screen
// and then increment an interval to add to

exports.PipeSystem = PipeSystem;

},{}]},{},[7]);
