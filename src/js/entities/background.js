var physicsComponent = require('../components/physics/physics');
var graphicsComponent = require('../components/graphics/background');


var Background = function(positionX, positionY, width, height, bus){
    this.setup(positionX, positionY, width, height, bus);
};

Background.prototype.setup = function(positionX, positionY, width, height, bus){
    this.bus = bus;

    var physics = new physicsComponent.PhysicsComponent(this);

    physics.position.x = positionX;
    physics.position.y = positionY;

    physics.velocity.x = Background.DEFAULT_VELOCITY;


    //determine the width and the height

    this.width = width;
    this.height = height;

    var graphics = new graphicsComponent.BackgroundGraphicsComponent(this);


    this.components = {
        physics: physics,
        graphics: graphics
    };
};

Background.DEFAULT_VELOCITY = -0.2;

exports.Background = Background;