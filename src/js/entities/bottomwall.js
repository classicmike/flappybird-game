var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');


var BottomWall = function(bus){
    this.setup(bus);
};

BottomWall.prototype.setup = function(bus){
    this.bus = bus;
    var physics = new physicsComponent.PhysicsComponent(this);

    this.canvas = document.getElementById('main-canvas');

    this.width = this.canvas.width/this.canvas.height;
    this.height = BottomWall.DEFAULT_HEIGHT;

    physics.position.x = 0;
    physics.position.y = -this.height/2;


    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y:this.height});

    this.components = {
        physics: physics,
        collision: collision,
    };

    collision.onCollision = this.onCollision.bind(this);
};


BottomWall.DEFAULT_HEIGHT = 0.25;

BottomWall.prototype.onCollision = function(entity){

};

exports.BottomWall = BottomWall;
