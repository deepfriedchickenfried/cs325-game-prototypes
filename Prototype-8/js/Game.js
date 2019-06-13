"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    var map;
    var bgLayer;
    var wallsLayer;
    
    var Rkey;

    var spawnX;
    var spawnY;

    var uplefts;
    var uprights;
    var downlefts;
    var downrights;

    var reds;
    var whites;
    var ghosts;
    var spawns;
    var goals;
    var blacks;

    
    var outline;
    var player;
 
    var cursors
    var speed = 120;
 
    var stationary = true;
    var charge = 1;
    var trailEmitter;
    var bloodEmitter;
    var slimeEmitter;
    var projectiles;
    var pLifetime = 5000;
    

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
            projectile.dir = "up";
        }else if(dir === "down")
        {
            projectile.body.velocity.x = 0;
            projectile.body.velocity.y = 160;
            projectile.dir = "down";
        }else if(dir === "left")
        {   
            projectile.body.velocity.x = -160;
            projectile.body.velocity.y = 0;
            projectile.dir = "left";
        }else if(dir === "right")
        {
            projectile.body.velocity.x = 160;
            projectile.body.velocity.y = 0;
            projectile.dir = "right";
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
    
    
    

    return {
    
        create: function () {
           
            charge =1;
            
            //music = game.add.audio('gameMusic');
            //music.play();
           

            player = game.add.sprite(spawnX+ 16, spawnY + 16, 'player');
            player.anchor.setTo(0.5, 0.5);
            player.frame = 5;
            stationary = true;
            outline = game.add.sprite(spawnX + 16, spawnY + 16, 'outline');
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
                projectile.body.setCircle(4);
                projectile.dir = "none";
                
                projectile.kill();
            }
            
            outline.body.collideWorldBounds = true;
            
            
            player.body.setCircle(10);
            player.body.collideWorldBounds= true;
            player.body.velocity.setTo(0,0);
            player.dir = "none";
            cursors = game.input.keyboard.createCursorKeys();

            Rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
            


            // particle trail
            trailEmitter = game.add.emitter(0,0, 500);
            trailEmitter.makeParticles('slime', 0, 500, true,true );
            trailEmitter.gravity = 0;
            trailEmitter.setXSpeed(0,0);
            trailEmitter.setYSpeed(0,0);
            //trailEmitter.setAlpha(1, 0, 300, Phaser.Easing.Linear.InOut);
            trailEmitter.setScale(1,0,1,0,300,Phaser.Easing.Linear.InOut);
            trailEmitter.start(false,300, 100);    
            
            slimeEmitter = game.add.emitter(0,0,100);
            slimeEmitter.makeParticles('slime', 0, 100, true, true);
            slimeEmitter.gravity = 0;
            slimeEmitter.particleDrag.setTo(100,100);
            slimeEmitter.minParticleScale = .1;
            slimeEmitter.maxParticleScale = .4;
            slimeEmitter.setAlpha(.5, 0, pLifetime, Phaser.Easing.Linear.InOut);

            bloodEmitter = game.add.emitter(0,0,100);
            bloodEmitter.makeParticles('blood', 0, 100, true, true);
            bloodEmitter.gravity = 0;
            bloodEmitter.particleDrag.setTo(100,100);
            bloodEmitter.minParticleScale = .1;
            bloodEmitter.maxParticleScale = .5;
            bloodEmitter.setAlpha(.5, 0, pLifetime, Phaser.Easing.Linear.InOut);
            
            

           
        },
    
        update: function () {
           
           
            
            
            
        }
    };
};
