"use strict";

GameStates.makeMainMenu = function( game,shared) {

	var music = null;
	
    var titleText;
    
    var styleTitle;
    
    var noteText;
    var noteStyle;

    function startGame() {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        

        //	And start the actual game
        game.state.start('Game');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.loop = true;
            music.play();
    
           
            noteStyle = {font: " 14px Arial", fill: "#ff004d", align: "center"};
            styleTitle = {font: "98px Arial", fill: "#ff004d", align: "center"};

            game.add.sprite(0,0,'titlePage');

            noteText = game.add.text(game.world.centerX, game.world.height -50, "Click to Start", noteStyle);
            noteText.anchor.set(0.5);
    
            
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
            if(game.input.activePointer.isDown)
            {
                startGame();
            }

        }
        
    };
};
