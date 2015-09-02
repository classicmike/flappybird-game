var pipe = require('../entities/pipe');

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
};

PipeSystem.prototype.removePipes = function(){
    //remove all pipe events
    for(var i= this.entities.length - 1; i >=0; i--){
        var entity = this.entities[i];

        if(entity instanceof pipe.Pipe){
            this.entities.splice(i, 1);
        }
    }
};

PipeSystem.prototype.generatePipe = function(){
    //generate the pipe
    var offScreenX = this.calculateOffScreenX();

    //push a new instance of a pipe onto the screen

    //collision detection
    if(parseInt(this.generationCount)%2 === 0){
        this.entities.push(new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, PipeSystem.PIPE_HEIGHT - PipeSystem.PIPE_HEIGHT/2, PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT, this.bus));
    } else {
        this.entities.push(new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, this.calculateY(), PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT, this.bus));
    }

    this.generationCount++;

};

PipeSystem.prototype.removePipe = function(pipe){
    var index = this.entities.indexOf(pipe);
    this.entities.splice(index, 1);
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

exports.PipeSystem = PipeSystem;
