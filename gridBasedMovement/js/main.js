"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 848, 608, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    

    function preload() {
        // Load an image and call it 'logo'.
        
        
        game.load.image('ground', 'assets/ground.png');
        
        game.load.image('plane', 'assets/duck.png');

        game.load.image('missile', 'assets/missile.png');

        game.load.spritesheet('explosion', 'assets/Explosion.png', 128, 128, 4);

        game.load.image('smoke', 'assets/smoke.png');

        game.load.image('smallSmoke', 'assets/smallSmoke.png');

        game.load.audio('explosion', 'assets/explosion13.wav');    
        game.load.audio('gameOver', 'assets/gameOver.wav');

    }
    var cursors;

    var ROTATION_SPEED_PLANE = 300;
    var ACCELERATION_PLANE = 600;
    var MAX_SPEED_PLANE = 200;
    var DRAG = 10;
    var GRAVITY = 500;
    
    var fx;

    var endedfx;

    var timer;

    var elapsedTime = -3.0;

    var elapsedMax = 5;

    var highScore = 33.0; //my current highscore

    var plane;

    var pauseSpawn = false;

    var ground;
    
    var explosionGroup;

    

    

    var planeSmoke;

    var planeSmokeLifetime = 1000;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
       
        fx = game.add.audio('explosion');
        endedfx = game.add.audio('gameOver');

        game.stage.backgroundColor = 0x333333;

        //creates the plane and sets up the values

        plane = game.add.sprite(400, 300, 'plane');
        plane.anchor.setTo(0.5,0.5);
        
        game.physics.arcade.enable(plane);

        plane.body.maxVelocity.setTo(MAX_SPEED_PLANE,MAX_SPEED_PLANE);

        plane.body.drag.setTo(DRAG,DRAG);

        plane.reset(400, 300);
        plane.body.acceleration.setTo(0,0);
        plane.angle = 0;
        plane.body.velocity.setTo(0,0);
        
        //sets up the smoke trail for the plane
        planeSmoke = game.add.emitter(0,0,100);
        planeSmoke.gravity = 0;
        planeSmoke.setXSpeed(0,0);
        planeSmoke.setYSpeed(-70, -40);

        planeSmoke.setAlpha(1,0, planeSmokeLifetime, Phaser.Easing.Linear.InOut);

        planeSmoke.makeParticles('smallSmoke');

        planeSmoke.start(false,planeSmokeLifetime, 50);

        game.physics.arcade.enable(plane);

        plane.body.gravity.y = GRAVITY;

        ground = game.add.group();
        ground.enableBody = true;
        for(var x = 0; x < game.world.width; x += 32)
        {
           var groundBlock = ground.create(x,game.world.height - 32, 'ground');
           groundBlock.body.immovable = true
        }

        explosionGroup = game.add.group();
       
      
        cursors = game.input.keyboard.createCursorKeys();
        
        timer = game.time.create(false);

        timer.loop(100, updateCounter, this);

        timer.start();

    }
    
    //used for the timer
    function updateCounter()
    {
        elapsedTime += .1;
    }

    
        

    
    //gets an explosion for the plane and missiles and plays the sound effect
    function getExplosion(x,y)
    {
        var explosion = explosionGroup.getFirstDead();

        if(explosion === null)
        {
            explosion = game.add.sprite(0,0, 'explosion');
            explosion.anchor.setTo(0.5,0.5);

            var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
            animation.killOnComplete = true;
            explosionGroup.add(explosion);
        }

        explosion.revive();

        explosion.x = x;
        explosion.y = y;
        fx.play();
        game.camera.shake(0.01, 200);
        explosion.animations.play('boom');
    }

    //resets the location of plane and timer in addition to other things
    function resetPlane()
    {
        endedfx.play();
        timer.pause();
        if (elapsedTime > highScore )
        {
            highScore = elapsedTime;
        }
        elapsedTime = -3.0;
        elapsedMax = 5;
        //MAX_MISSILES = 10;
        
        plane.reset(400, 300);
        plane.body.acceleration.setTo(0,0);
        plane.angle = 0;
        plane.body.velocity.setTo(0,0);
        timer.resume();
        
        
    }

    function update() {
        //extremely basic score system
        game.debug.text('HIGHSCORE: ' + highScore + ' seconds', 32, 32 );
        game.debug.text('Time Survived: ' + elapsedTime + ' seconds', 32, 64);
        if (plane.y > (game.world.height/2))
        {
            plane.body.gravity.y = -GRAVITY;
        }else
        {
            plane.body.gravity.y = GRAVITY;
        }
        game.physics.arcade.collide(plane, ground);
        
       

         //put the plane on top of the smoke trail
         plane.bringToTop();
         // put the smoke trail behind the plane
         planeSmoke.x = (Math.cos((plane.rotation + Math.PI) % (2 *Math.PI)) * 6) + plane.x;
         planeSmoke.y = (Math.sin((plane.rotation + Math.PI) % (2 *Math.PI)) * 6) + plane.y;

         
        // wrap the plane around the map
         if(plane.x > game.world.width)
        {
            plane.x = 0;
        }

        if(plane.x < 0 )
        {
            plane.x = game.world.width;
        }

        // if the plane goes into the screen above set its angle back down
        if(plane.y < 0)
        {
            plane.angle = game.rnd.integerInRange(80,100);
        }

        // turning
        if(cursors.left.isDown)
        {
            plane.body.angularVelocity = -ROTATION_SPEED_PLANE;
        } else if(cursors.right.isDown)
        {
            plane.body.angularVelocity = ROTATION_SPEED_PLANE;
        } else
        {
            plane.body.angularVelocity = 0;
        }

        // if the plane hits the ground explode
        var planeOnTheGround = plane.body.touching.down;
        
        if(planeOnTheGround)
        {
           
            getExplosion(plane.x, plane.y);
            resetPlane();
        }

        // acceleration
        if(cursors.up.isDown)
        {
            plane.body.acceleration.x = Math.cos(plane.rotation) * ACCELERATION_PLANE;
            plane.body.acceleration.y = Math.sin(plane.rotation) * ACCELERATION_PLANE;
            planeSmoke.on = true;
        } else
        {
            plane.body.acceleration.setTo(0,0);
           planeSmoke.on = false;
        }
    }

   
   




};
