"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
   var music;
   
    var player;
    var curDir;

    var Speed = 20
   
   

  
   

    
    return {
    
        create: function () {
           
            music = game.add.audio('gameMusic');
            music.play();
            
            

            game.stage.backgroundColor = 0x5f574f;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);

            player.body.setCircle(16);
            player.body.collideWorldBounds= true;




          

            
            

           
        },
    
        update: function () {
           
           

            
         
            player.rotation = game.physics.arcade.angleToPointer(player);
            
          
            
            if(game.input.onDown)
            {
                curDir = player.rotation;

                player.body.velocity.x = Math.cos(curDir) * Speed;
                player.body.velocity.y = Math.sin(curDir) * Speed;  
                
            }
             
           
         
            
            
            
        }
    };
};
