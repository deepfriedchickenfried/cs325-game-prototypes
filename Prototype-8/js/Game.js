"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
    var music;
    var outline;
    var player;
    var curDir = "none";
    var cursors
    var speed = 120;
    var changeDir;
    var stationary = false;
    var charge = 1;
    var maxcharge = 1;
    var currentLevel = 0;
    var trailEmitter;
    var deathEmitter;


    function snapOutlineToGrid(x,y) 
    {
       
       outline.x = 16 + (Math.floor(x/32) * 32);
       outline.y = 16 + (Math.floor(y/32) * 32); 

    }
    function moveOneSpace(dir, x,y )
    {

    }

    

    return {
    
        create: function () {
           
            music = game.add.audio('gameMusic');
            //music.play();
            
            

            game.stage.backgroundColor = 0x5f574f;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
            outline = game.add.sprite(game.world.centerX, game.world.centerY, 'outline');

            outline.anchor.setTo(0.5, 0.5);
           
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);
            game.physics.arcade.enable(outline, true);
            outline.body.collideWorldBounds = true;
            player.body.setCircle(12);
            player.body.collideWorldBounds= true;
            player.body.velocity.setTo(0,0);
            cursors = game.input.keyboard.createCursorKeys();
            

            trailEmitter = game.add.emitter(0,0, 300);
            trailEmitter.makeParticles('slime', 0, 300, true,true );
            trailEmitter.gravity = 0;
            trailEmitter.setXSpeed(0,0);
            trailEmitter.setYSpeed(0,0);
            trailEmitter.setAlpha(1, 0, 300, Phaser.Easing.Linear.InOut);
            trailEmitter.setScale(1,0,1,0,300,Phaser.Easing.Linear.InOut);
            trailEmitter.start(false,300, 100);    
          

            
            

           
        },
    
        update: function () {
           
            
           
            
            player.bringToTop();
            
            if(stationary === true)
            {
                emitter.on = false;

                if(cursors.right.isDown)
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.x = speed;
                    player.body.velocity.y = 0;
                    curDir = "right";
                    stationary = false;        
                }else if(cursors.up.isDown)
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.y = -speed;
                    player.body.velocity.x = 0;
                    curDir = "up";
                    stationary = false;
                }else if(cursors.left.isDown)
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.x = -speed;
                    player.body.velocity.y = 0;
                    curDir = "down";
                    stationary = false;
                }else if(cursors.down.isDown)
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.y = speed;
                    player.body.velocity.x = 0;
                    curDir = "left"; 
                    stationary = false;
                }else
                {
                    player.body.velocity.y = 0;
                    player.body.velocity.x = 0;
                }
                
            
            } else
            {
                trailEmitter.x = player.x;
                trailEmitter.y = player.y;
                trailEmitter.on = true;
                
                if(curDir=="right" || curDir == "left")
                {
                    player.y = outline.y
                }else if(curDir == "up" || curDir == "down")
                {
                    player.x = outline.x
                }

                if(charge >= 1 && cursors.right.isDown && curDir !== "right")
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.x = speed;
                    player.body.velocity.y = 0;
                    curDir = "right";
                    
                    //charge--;
                }else if(charge >= 1 && cursors.up.isDown && curDir !== "up")
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.y = -speed;
                    player.body.velocity.x = 0;
                    curDir = "up";
                    //charge--;
                }else if(charge >= 1 && cursors.left.isDown && curDir !== "left")
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.x = -speed;
                    player.body.velocity.y = 0;
                    curDir = "left";
                    //charge--;
                }else if(charge >= 1 && cursors.down.isDown && curDir !== "down")
                {
                    player.x = outline.x
                    player.y = outline.y
                    player.body.velocity.y = speed;
                    player.body.velocity.x = 0;
                    curDir = "down"; 
                    //charge--;
                }


            }
            if(player.alive)
            {
                snapOutlineToGrid(player.x, player.y);
            }
            
            
            
            
        }
    };
};
