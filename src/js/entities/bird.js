
    var graphicsComponent = require('../components/graphics/bird');
    var physicsComponent = require('../components/physics/physics');
    var collisionComponent = require('../components/collision/circle');
    var pipe = require('../entities/pipe');


    var Bird = function(bus){
        var physics = new physicsComponent.PhysicsComponent(this);
        physics.position.y = Bird.DEFAULT_POSITION_Y;
        physics.acceleration.y = -2;

        var graphics = new graphicsComponent.BirdGraphicsComponent(this);

        var collision = new collisionComponent.CircleCollisionComponent(this, 0.02);
        collision.onCollision = this.onCollision.bind(this);

        this.bus = bus;

        this.components = {
            graphics: graphics,
            physics: physics,
            collision: collision
        };
    };

    Bird.prototype.onCollision = function(entity){
        this.reset();

        if(entity instanceof pipe.Pipe){
            this.bus.emit('birdCollision');
        }
    };

    Bird.prototype.reset = function(){
        var position = this.components.physics.position;

        //set the position to the original.
        position.x = Bird.DEFAULT_POSITION_X;
        position.y = Bird.DEFAULT_POSITION_Y;
    };


    //

    Bird.DEFAULT_POSITION_X = 0;
    Bird.DEFAULT_POSITION_Y = 0.5;

    exports.Bird = Bird;
