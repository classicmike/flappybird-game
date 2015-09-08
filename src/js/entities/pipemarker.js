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

