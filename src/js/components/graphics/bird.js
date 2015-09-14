var BirdGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = BirdGraphicsComponent.BIRD_IMG_SRC;
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
    context.drawImage(this.imgObject, -BirdGraphicsComponent.BIRD_RADIUS, -BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    context.restore();
};



BirdGraphicsComponent.BIRD_IMG_SRC = './img/fb_bird.png';
BirdGraphicsComponent.BIRD_RADIUS = 0.06333333333;


exports.BirdGraphicsComponent = BirdGraphicsComponent;

