var background = require('../entities/background');

var BackgroundSystem = function(entities, bus, utilities){
    if(!entities){
        return;
    }

    this.setup(entities, bus, utilities);
};

BackgroundSystem.prototype.setup = function(entities, bus){
    this.entities = entities;
    this.bus = bus;
    this.backgrounds = [];
    this.setupEntities();
    this.backgroundsIsResizing = false;
};

BackgroundSystem.prototype.setupEntities = function(){

    //we need to create the 2 entities responsible for the backgrounds and append it to the entities.

    var canvasWidth = window.innerWidth/window.innerHeight;
    var canvasHeight = window.innerHeight/window.innerHeight;
    var offCanvasPosition = (window.innerWidth-2)/window.innerHeight;


    var backgroundEntity1 = new background.Background(0, canvasHeight/2, canvasWidth, canvasHeight, this.bus);

    var backgroundEntity2 = new background.Background(offCanvasPosition, canvasHeight/2, canvasWidth, canvasHeight, this.bus);

    this.entities.unshift(backgroundEntity1, backgroundEntity2);
    this.backgrounds.push(backgroundEntity1, backgroundEntity2);

};

BackgroundSystem.prototype.run = function(){
    //interval to check and reposition backgrounds
    window.setInterval(this.checkAndRepositionBackgrounds.bind(this), 1000/60);

    //resize backgrounds on window resize.
    this.bus.on('windowResize', this.resizeBackgrounds.bind(this));
};


BackgroundSystem.prototype.resizeBackgrounds = function(){
    var canvasWidth = (window.innerWidth)/window.innerHeight;
    var canvasHeight = window.innerHeight/window.innerHeight;

    var offCanvasPosition = (window.innerWidth-2)/window.innerHeight;

    var backgroundEntity1 = this.backgrounds[0];
    var backgroundEntity2 = this.backgrounds[1];


    backgroundEntity1.components.physics.position.x = 0;
    backgroundEntity1.components.physics.position.y = canvasHeight/2;
    backgroundEntity1.width = canvasWidth;
    backgroundEntity1.height = canvasHeight;

    backgroundEntity2.components.physics.position.x = offCanvasPosition;
    backgroundEntity2.components.physics.position.y = canvasHeight/2;
    backgroundEntity2.width = canvasWidth;
    backgroundEntity2.height = canvasHeight;


};

BackgroundSystem.prototype.checkAndRepositionBackgrounds = function(){

    for(var i = 0; i < this.entities.length; i++){
        var entity = this.entities[i];

        var restartPosition = ((window.innerWidth-2)/window.innerHeight);

        if(entity instanceof background.Background && entity.components.physics.position.x < -(restartPosition)){
            entity.components.physics.position.x = restartPosition;
        }
    }

};

BackgroundSystem.prototype.switchBackground = function(){

};

exports.BackgroundSystem = BackgroundSystem;