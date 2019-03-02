"use strict";

GameStates.makeEndScreen = function( game, shared ) {

	var music = null;
    
    return {
    
        create: function () {
    
            music = game.add.audio('gameOver');
            music.play();
    
            game.add.sprite(0, 0, 'endScreen');
    
        },
   
        
    };
};
