
    var graphicsComponent = require('../components/graphics/pipe');
    var physicsComponent = require('../components/physics/physics')

    var Pipe = function(positionX, positionY, width, height){
        var physics = new physicsComponent.PhysicsComponent(this);


        //put the position
        physics.position.x = positionX ? positionX : Pipe.DEFAULT_POSITION_X;
        physics.position.y = positionY ? positionY : Pipe.DEFAULT_POSITION_Y;

        //dimensions go here
        this.width = width ? width : Pipe.DEFAULT_WIDTH;
        this.height = height ? height : Pipe.DEFAULT_HEIGHT;


        var graphics = new graphicsComponent.PipeGraphicsComponent(this);

        this.components = {
            graphics: graphics,
            physics: physics
        };
    };

    Pipe.DEFAULT_POSITION_X = 0;
    Pipe.DEFAULT_POSITION_Y = 0;
    Pipe.DEFAULT_WIDTH = 0;
    Pipe.DEFAULT_HEIGHT = 0;

    exports.Pipe = Pipe;

