var PipeGraphicsComponent = function(entity){
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function(context){
    var position = this.entity.components.physics.position;

    //fill the path with a rectangle
    context.save();

    var cornerX = position.x - this.entity.width/2;
    var cornerY = position.y - this.entity.height/2;

    context.translate(position.x, position.y);


    context.beginPath();
    context.rect(-this.entity.width/2, -this.entity.height/2, this.entity.width, this.entity.height);
    context.fill();
    context.restore();


};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;

