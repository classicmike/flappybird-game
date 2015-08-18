var BirdGraphicsComponent = function(entity){
    this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context){
    context.translate(20, 0);


    // draw a circle
    context.beginPath();
    context.arc(100, 50, 50, 0, 2 * Math.PI);
    context.fillStyle = "rgb(255,0,0)";
    context.fill();


    // draw a rectangle
    context.beginPath();
    context.fillStyle = "rgb(0,255,0)";
    context.fillRect(0,0,10, 10);



};

exports.BirdGraphicsComponent = BirdGraphicsComponent;

