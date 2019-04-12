"use strict";

var EndScreen = function( game) {

    var plane
	var music = null;
    var enter;
    var titleText;
    
    var styleTitle;
    
    var noteText;
    var noteStyle;

    function startGame()
    {
        music.stop();

        game.state.start('Game');
    }

    return {
    
        create: function () {
    
            music = game.add.audio('gameOver');
            music.play();
    
            plane = game.add.sprite(game.world.centerX, game.world.centerY, 'endScreen');
            plane.anchor.setTo(0.5,0.5);

            enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            noteStyle = {font: " 14px Arial", fill: "#ff004d", align: "center"};
            styleTitle = {font: "98px Arial", fill: "#ff004d", align: "center"};

            titleText = game.add.text(game.world.centerX, game.world.centerY - 100, "You Died", styleTitle);
            titleText.anchor.set(0.5);

            noteText = game.add.text(game.world.centerX, game.world.height -50, "Press enter to try again", noteStyle);
            noteText.anchor.set(0.5);

        },

        update: function () {
            if(enter.isDown)
            {
                startGame();
            }
        }
   
        
    };
};
