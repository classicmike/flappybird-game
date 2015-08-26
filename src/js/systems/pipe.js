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
        this.entities.push(new pipe.Pipe(offScreenX + PipeSystem.PIPE_WIDTH/2, 0.75, PipeSystem.PIPE_WIDTH, PipeSystem.PIPE_HEIGHT));
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
