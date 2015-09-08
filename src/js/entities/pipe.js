var graphicsComponent = require('../components/graphics/pipe');
var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');
var leftWall = require('../entities/leftwall');


var Pipe = function(positionX, positionY, width, height, bus){
    this.bus = bus;

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
        physics: physics,
        collision: collision,
        graphics: graphics
    };

};

Pipe.DEFAULT_POSITION_X = 0;
Pipe.DEFAULT_POSITION_Y = 0;
Pipe.DEFAULT_WIDTH = 0;
Pipe.DEFAULT_HEIGHT = 0;

Pipe.prototype.onCollision = function(entity){
    if(entity instanceof leftWall.LeftWall){
        this.bus.emit('pipeCollision', this);
    }
};

exports.Pipe = Pipe;

