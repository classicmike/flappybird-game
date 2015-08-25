var pipe = require('../entities/pipe');

var PipeSystem = function(entities){
    if(!entities){
        return;
    }

    this.setup(entities);
    this.setEvents();
};

// function to calculate the offscreen coordinates
PipeSystem.prototype.calculateOffScreenX = function(){
    return this.canvas.width/this.canvas.height;
};



PipeSystem.prototype.setup = function(entities){
    this.canvas = document.getElementById('main-canvas');
    this.entities = entities;
    this.generationCount = 0;

    this.calculateOffScreenX();
};

PipeSystem.prototype.run = function(){
    this.generatePipe();
};

PipeSystem.prototype.setEvents = function(){
    //window.addEventListener('resize', this.calculateOffScreen.bind(this), false);
};

PipeSystem.prototype.generatePipe = function(){
    //generate the pipe
    var offScreenX = this.calculateOffScreenX();

    //push a new instance of a pipe onto the screen
    this.entities.push(new pipe.Pipe(offScreenX, 0.5, 0.5, 1));
};


PipeSystem.prototype.tick = function(){

};

// what we need to do for each 3 seconds we need to
// generate a pipe away from the screen
// and then increment an interval to add to

exports.PipeSystem = PipeSystem;
