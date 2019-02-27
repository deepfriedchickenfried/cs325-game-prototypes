"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
   var music;
    var lives = 1;
    var ammo;
    var player;
    
    var cursors;
    var playerSpeed = 500;
   

  
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        music.stop();
       

       
        game.state.start('GameOver', true);

    }
    
    return {
    
        create: function () {
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            player.stopped = true;
            player.facing = 0;
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);

            cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
            
            if(cursors.up.onDown)
            {
                if(player.stopped)
                {
                    player.facing = 1;
                }    
            }else if(cursors.down.onDown)
            {
                if(player.stopped)
                {
                    player.facing = 3;
                }
            }else if(cursors.left.onDown)
            {
                if(player.stopped)
                {
                player.facing = 2;
                }
            }else if(cursors.right.onDown)
            {
                if(player.stopped)
                {
                player.facing  = 0;
                }
            }
           
            if(player.stopped)
            {
                if()
                player.body.velocity.setTo(0,0);

            }
            
            
        }
    };
};
