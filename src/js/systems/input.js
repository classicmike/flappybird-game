var birdEntity = require('../entities/bird');

var InputSystem = function(entities, bus){
    this.bus = bus;
    this.entities = entities;


    // canvas is where we get input forom
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function(){
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function(){
    var bird = this.getBirdFromEntities();

    if(bird !== null){
        bird.components.physics.velocity.y = 0.7;
        bird.components.graphics.hasClicked = true;
    }
};

InputSystem.prototype.getBirdFromEntities = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        if(entity instanceof birdEntity.Bird){
            return entity;
        }
    }

    return null;
};

//

exports.InputSystem = InputSystem;

