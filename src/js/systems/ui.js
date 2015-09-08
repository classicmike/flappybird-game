var UISystem = function(entities, bus){
    if(!entities){
        return;
    }

    this.setup(entities, bus);
};

UISystem.prototype.setup = function(entities, bus){
    this.entities = entities;
    this.bus = bus;
    this.scoreElement = document.getElementById('score');
    this.setEvents();
    console.log('UISystem');
};

UISystem.prototype.setEvents = function(){
    this.bus.on('scoreChanged', this.changeScore.bind(this));
};

UISystem.prototype.changeScore = function(score){
    this.scoreElement.textContent = score;

};

UISystem.OVERLAY_ID = 'overlay';
UISystem.SCORE_ID = 'score';

exports.UISystem = UISystem;