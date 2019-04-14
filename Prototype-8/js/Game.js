"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
   var music;
   
    var player;
    var curDir = "none";
    var cursors
    var speed = 200;
    var changeDir;
    var stationary = false;
    var charge = 1;
    var maxcharge = 1;
    var currentLevel = 0;
   

    
    return {
    
        create: function () {
           
            music = game.add.audio('gameMusic');
            //music.play();
            
            

            game.stage.backgroundColor = 0x5f574f;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);

            player.body.setCircle(16);
            player.body.collideWorldBounds= true;
            player.body.velocity.setTo(0,0);
            cursors = game.input.keyboard.createCursorKeys();



          

            
            

           
        },
    
        update: function () {
           
           

            
         
            
            if(stationary === true)
            {
                

                if(cursors.right.isDown)
                {
                    player.body.velocity.x = speed;
                    player.body.velocity.y = 0;
                    curDir = "right";
                    stationary = false;        
                }else if(cursors.up.isDown)
                {
                    player.body.velocity.y = -speed;
                    player.body.velocity.x = 0;
                    curDir = "up";
                    stationary = false;
                }else if(cursors.left.isDown)
                {
                    player.body.velocity.x = -speed;
                    player.body.velocity.y = 0;
                    curDir = "down";
                    stationary = false;
                }else if(cursors.down.isDown)
                {
                    player.body.velocity.y = speed;
                    player.body.velocity.x = 0;
                    curDir = "left"; 
                    stationary = false;
                }
                
            
            } else
            {
                if(charge >= 1 && cursors.right.isDown && curDir !== "right")
                {
                    player.body.velocity.x = speed;
                    player.body.velocity.y = 0;
                    curDir = "right";
                    charge--;
                }else if(charge >= 1 && cursors.up.isDown && curDir !== "up")
                {
                    player.body.velocity.y = -speed;
                    player.body.velocity.x = 0;
                    curDir = "up";
                    charge--;
                }else if(charge >= 1 && cursors.left.isDown && curDir !== "left")
                {
                    player.body.velocity.x = -speed;
                    player.body.velocity.y = 0;
                    curDir = "left";
                    charge--;
                }else if(charge >= 1 && cursors.down.isDown && curDir !== "down")
                {
                    player.body.velocity.y = speed;
                    player.body.velocity.x = 0;
                    curDir = "down"; 
                    charge--;
                }
            }
           
            
            
            
            
        }
    };
};
