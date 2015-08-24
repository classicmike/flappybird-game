var PipeGraphicsComponent = function(entity){
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function(context){
    console.log('Drawing pipe Graphics');
    var position = this.entity.components.physics.position;

    console.log(position.x);
    console.log(position.y);
    console.log(this.entity.width);
    console.log(this.entity.height);
    //fill the path with a rectangle
    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.rect(0, 0, this.entity.width, this.entity.height);
    context.fill();
    context.restore();


};

PipeGraphicsComponent.DEFAULT_FILL_COLOUR = '#f00';

exports.PipeGraphicsComponent = PipeGraphicsComponent;

