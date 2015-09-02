var physicsComponent = require('../components/physics/physics');
var collisionComponent = require('../components/collision/rect');


var TopWall = function(bus){
    this.setup(bus);
};

TopWall.prototype.setup = function(bus){
    this.bus = bus;
    var physics = new physicsComponent.PhysicsComponent(this);

    this.canvas = document.getElementById('main-canvas');

    this.width = this.canvas.width/this.canvas.height;
    this.height = TopWall.DEFAULT_HEIGHT;

    physics.position.x = 0;
    physics.position.y = 1 + this.height/2;


    var collision = new collisionComponent.RectCollisionComponent(this, {x: this.width, y:this.height});

    this.components = {
        physics: physics,
        collision: collision
    };

    collision.onCollision = this.onCollision.bind(this);
};


TopWall.DEFAULT_HEIGHT = 0.25;

TopWall.prototype.onCollision = function(entity){

};

exports.TopWall = TopWall;
