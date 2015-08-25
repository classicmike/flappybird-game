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
