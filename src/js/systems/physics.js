var collisionSystem = require('./collision');

var PhysicsSystem = function(entities, bus){
    this.bus = bus;
    this.entities = entities;
    this.collisionSystem = new collisionSystem.CollisionSystem(entities, bus);
};

PhysicsSystem.prototype.run = function(){
    // Run the update loop
    window.setInterval(this.tick.bind(this), 1000/60);
};


PhysicsSystem.prototype.tick = function(){
    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        if(!'physics' in entity.components){
            continue;
        }

        entity.components.physics.update(1/60);

        //perform a tick on the collision system.
        this.collisionSystem.tick();
    }

};

exports.PhysicsSystem = PhysicsSystem;