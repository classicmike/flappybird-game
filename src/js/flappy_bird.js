(function(){
    var graphicsSystem = require('./systems/graphics');
    var bird = required('./entities/bird');

    var FlappyBird = function(){
        this.entities = [new bird.Bird()];
        this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
    };

    FlappyBird.prototype.run = function(){
        this.graphics.run();
    };

    exports.FlappyBird = FlappyBird;

})(jQuery);