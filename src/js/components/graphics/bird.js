var BirdGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = BirdGraphicsComponent.BIRD_IMG_SRC;
    this.imgObject.onload = this.onload.bind(this);
};


//remember the width of the image in terms of pixel size is 32pixels

BirdGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, BirdGraphicsComponent.BIRD_RADIUS, 0, 2*Math.PI);
    context.closePath();
    context.drawImage(this.imgObject, 2*BirdGraphicsComponent.BIRD_RADIUS, 2*BirdGraphicsComponent.BIRD_RADIUS);
    context.restore();
};



BirdGraphicsComponent.BIRD_IMG_SRC = './img/fb_bird.png';
BirdGraphicsComponent.BIRD_RADIUS = 0.02;


exports.BirdGraphicsComponent = BirdGraphicsComponent;

