    var graphicsSystem = require('./systems/graphics');
    var physicsSystem = require('./systems/physics');
    var inputSystem = require('./systems/input');
    var pipeSystem = require('./systems/pipe');
    var ui = require('./systems/ui');

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
        this.entities = [new bird.Bird(this.bus), new leftWall.LeftWall(this.bus), new topWall.TopWall(this.bus), new bottomWall.BottomWall(this.bus)];
        this.graphics = new graphicsSystem.GraphicsSystem(this.entities, this.bus);
        this.physics = new physicsSystem.PhysicsSystem(this.entities, this.bus);
        this.input = new inputSystem.InputSystem(this.entities, this.bus);
        this.pipe = new pipeSystem.PipeSystem(this.entities, this.bus);
        this.ui = new ui.UISystem(this.entities, this.bus);

        this.resetScore();

        this.setEvents();
    };

    FlappyBird.prototype.run = function(){
        this.graphics.run();
        this.physics.run();
        this.input.run();
        this.pipe.run();
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

