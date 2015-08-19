var InputSystem = function(entities){
    this.entities = entities;

    // canvas is where we get input forom
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function(){
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function(){
    var bird = this.entities[0];

    bird.components.physics.velocity.y = 0.7;
};

exports.InputSystem = InputSystem;

