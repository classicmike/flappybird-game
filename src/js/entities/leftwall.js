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



