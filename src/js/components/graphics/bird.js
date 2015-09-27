var BirdGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = BirdGraphicsComponent.BIRD_IMG_SRC;

    this.hasClicked = false;
};




//remember the width of the image in terms of pixel size is 32pixels

BirdGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, BirdGraphicsComponent.BIRD_RADIUS, 0, 2*Math.PI);
    context.closePath();

    //will have to check if the bird's state is flapping or not

    context.scale(1, -1);

    //context.drawImage with 3 parameters
    if(this.hasClicked){
        context.rotate(-Math.PI/4);
        context.drawImage(this.imgObject, 38, 0, 38, 38, -BirdGraphicsComponent.BIRD_RADIUS, -BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    } else{
        context.rotate(Math.PI/8);
        context.drawImage(this.imgObject, 0, 0, 38, 38, -BirdGraphicsComponent.BIRD_RADIUS, -BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    }

    //if the physics velocity is less than 0 then flip.
    if(this.entity.components.physics.velocity.y < 0){
        this.hasClicked = false;
    }

    context.restore();
};



BirdGraphicsComponent.BIRD_IMG_SRC = './img/fb_bird.png';
BirdGraphicsComponent.BIRD_RADIUS = 0.0138888888888888;


exports.BirdGraphicsComponent = BirdGraphicsComponent;

