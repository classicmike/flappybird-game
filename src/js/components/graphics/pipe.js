var PipeGraphicsComponent = function(entity){
    this.entity = entity;
    this.imgObject = new Image();
    this.imgObject.src = this.entity.imgSrc;


};

PipeGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    //fill the path with a rectangle
    context.save();

    context.translate(position.x, position.y);
    context.drawImage(this.imgObject, -this.entity.width/2, -this.entity.height/2, this.entity.width, this.entity.height);



    context.restore();


};

PipeGraphicsComponent.prototype.onload = function(context, imgObject){
};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;

