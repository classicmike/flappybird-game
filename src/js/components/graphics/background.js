var BackgroundGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();

    this.imgObject.src = BackgroundGraphicsComponent.DEFAULT_BACKGROUND_IMAGE;

};

BackgroundGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;
    context.save();

    context.translate(position.x, position.y);

    context.scale(1, -1);
    context.drawImage(this.imgObject, 0, 0, this.imgObject.width, this.imgObject.height, -this.entity.width/2, -0.5, this.entity.width, this.entity.height);
    context.restore();
};

BackgroundGraphicsComponent.DEFAULT_BACKGROUND_IMAGE = './img/flappy-background.png';

exports.BackgroundGraphicsComponent = BackgroundGraphicsComponent;