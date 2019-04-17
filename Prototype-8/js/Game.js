"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    var map;
    var music;
    var outline;
    var player;
    var curDir = "none";
    var cursors
    var speed = 120;
    var changeDir;
    var stationary = true;
    var charge = 1;
    var maxcharge = 1;
    var currentLevel = 0;
    var trailEmitter;
    var blastEmitter;
    var deathEmitter;
    var projectiles;

    function snapOutlineToGrid(x,y) 
    {
       
       outline.x = 16 + (Math.floor(x/32) * 32);
       outline.y = 16 + (Math.floor(y/32) * 32); 

    }

    function fireProjectile(dir, x, y)
    {
        var projectile = projectiles.getFirstDead();
        if(projectile === null || projectile === undefined) return;

        projectile.revive();
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;
        projectile.reset(x,y);
        if(dir === "up")
        {
            projectile.body.velocity.x = 0;
            projectile.body.velocity.y = -160;
        }else if(dir === "down")
        {
            projectile.body.velocity.x = 0;
            projectile.body.velocity.y = 160;
        }else if(dir === "left")
        {   
            projectile.body.velocity.x = -160;
            projectile.body.velocity.y = 0;
        }else if(dir === "right")
        {
            projectile.body.velocity.x = 160;
            projectile.body.velocity.y = 0;
        }
        
    }

    function moveOneSpace(dir, x,y )
    {
        if(dir === "up")
        {

        }else if(dir === "down")
        {

        }else if(dir === "left")
        {   

        }else if(dir === "right")
        {

        }
    }
    function checkSpace(dir, x,y)
    {
        if(dir === "up")
        {

        }else if(dir === "down")
        {

        }else if(dir === "left")
        {   

        }else if(dir === "right")
        {
        
        }

    }

    

    return {
    
        create: function () {
           
            music = game.add.audio('gameMusic');
            //music.play();
            
            

            //map = this.game.add.tilemap('testmap');
            //map.addTilesetImage('')
            

            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
           
            outline = game.add.sprite(game.world.centerX, game.world.centerY, 'outline');
            outline.anchor.setTo(0.5, 0.5);
         
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);
            game.physics.arcade.enable(outline, true);
           
            
            projectiles = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var projectile = game.add.sprite(0,0, 'projectile');
                projectiles.add(projectile);
                projectile.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(projectile);
                projectile.kill();
            }
            
            outline.body.collideWorldBounds = true;
            
            
            player.body.setCircle(12);
            player.body.collideWorldBounds= true;
            player.body.velocity.setTo(0,0);
            player.dir = "none";
            cursors = game.input.keyboard.createCursorKeys();

            


            // particle trail
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
            if(player.alive)
            {
                if(stationary === true)
                {
                    trailEmitter.on = false;

                    if(cursors.right.isDown)
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.x = speed;
                        player.body.velocity.y = 0;
                        player.dir = "right";
                        stationary = false;        
                    }else if(cursors.up.isDown)
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.y = -speed;
                        player.body.velocity.x = 0;
                        player.dir = "up";
                        stationary = false;
                    }else if(cursors.left.isDown)
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.x = -speed;
                        player.body.velocity.y = 0;
                        player.dir = "down";
                        stationary = false;
                    }else if(cursors.down.isDown)
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.y = speed;
                        player.body.velocity.x = 0;
                        player.dir = "left"; 
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
                   



                    if(player.dir === "right" || player.dir === "left")
                    {
                        player.y = outline.y
                    }else if(player.dir === "up" || player.dir === "down")
                    {
                        player.x = outline.x
                    }

                    

                    if(charge >= 1 && cursors.right.isDown && player.dir !== "right")
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.x = speed;
                        player.body.velocity.y = 0;
                        player.dir = "right";
                        fireProjectile("left",player.x,player.y);
                        //charge--;
                    }else if(charge >= 1 && cursors.up.isDown && player.dir !== "up")
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.y = -speed;
                        player.body.velocity.x = 0;
                        player.dir = "up";
                        fireProjectile("down",player.x,player.y);
                        //charge--;
                    }else if(charge >= 1 && cursors.left.isDown && player.dir !== "left")
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.x = -speed;
                        player.body.velocity.y = 0;
                        player.dir = "left";
                        fireProjectile("right",player.x,player.y);
                        //charge--;
                    }else if(charge >= 1 && cursors.down.isDown && player.dir !== "down")
                    {
                        player.x = outline.x
                        player.y = outline.y
                        player.body.velocity.y = speed;
                        player.body.velocity.x = 0;
                        player.dir = "down"; 
                        fireProjectile("up",player.x,player.y);
                        //charge--;
                    }


                }
            
                snapOutlineToGrid(player.x, player.y);
            }
            
            
            
            
        }
    };
};
