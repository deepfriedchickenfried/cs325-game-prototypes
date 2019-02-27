"use strict";

var GameOver = function( game) {

	var music = null;
    var titleText;
    
    var styleTitle;
    
    var noteText;
    var noteStyle;

    function startGame() {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();



        //	And start the actual game
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
            game.add.sprite(0, 0, 'gameOverScreen');
            noteStyle = {font: " 14px Arial", fill: "#ff004d", align: "center"};
            styleTitle = {font: "98px Arial", fill: "#ff004d", align: "center"};

            titleText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Over", styleTitle);
            titleText.anchor.set(0.5);

            noteText = game.add.text(game.world.centerX, game.world.height -50, "Click to go to main menu", noteStyle);
            noteText.anchor.set(0.5);

            music = game.add.audio('titleMusic');
            music.play();
    
            
    
           
    
        },
    
        update: function () {
            if(game.input.activePointer.isDown)
            {
                startGame();
            }
            //	Do some nice funky main menu effect here

    
        }
        
    };
};
