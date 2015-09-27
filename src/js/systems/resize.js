var ResizeSystem = function(bus){
    this.setup(bus);
};

ResizeSystem.prototype.setup = function(bus){
    this.rtime = undefined;
    this.timeout = false;
    this.delta = 200;
    this.bus = bus;
};

ResizeSystem.prototype.run = function(){
    window.addEventListener('resize', this.windowResize.bind(this));
};

ResizeSystem.prototype.windowResize = function(){
    this.rtime = new Date();

    if(this.timeout === false){
        this.timeout = true;
        setTimeout(this.triggerWindowResize.bind(this), this.delta);
    }
};

ResizeSystem.prototype.triggerWindowResize = function(){
    if(new Date() - this.rtime < this.delta){
        setTimeout(this.triggerWindowResize.bind(this), this.delta);
    } else {
        this.timeout = false;
        this.bus.emit('windowResize');
    }
};


exports.ResizeSystem = ResizeSystem;