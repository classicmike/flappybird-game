var BirdGraphicsComponent = function(entity){
    this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context){
    console.log('Drawing Bird Graphics');
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, 0.02, 0, 2*Math.PI);
    context.fill();
    context.closePath();
    context.restore();

};

exports.BirdGraphicsComponent = BirdGraphicsComponent;

