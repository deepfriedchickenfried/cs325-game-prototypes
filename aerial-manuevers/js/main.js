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
        
        game.load.spritesheet('plane', 'assets/plane.png', 21,24, 19);

        game.load.image('missile', 'assets/missile.png');

        game.load.spritesheet('explosion', 'assets/Explosion.png', 128, 128, 4);

        game.load.image('smoke', 'assets/smoke.png');

        game.load.audio('sfx', 'assets/explosion13.wav');    
    }
    var cursors;

    var ROTATION_SPEED_PLANE = 300;
    var ACCELERATION_PLANE = 600;
    var MAX_SPEED_PLANE = 200;
    var DRAG = 10;
    var GRAVITY = 50;
    var fx;
    var timer;

    var elapsedTime = -2.0;

    var highScore = 16.0; //my current highscore

    var plane;

    var pauseSpawn = false;

    var ground;
    
    var explosionGroup;

    var missileGroup;

    var MAX_MISSILES = 10;

    var gameOver;

    var planeSmoke;

    var planeSmokeLifetime = 1000;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        fx = game.add.audio('sfx');

        game.stage.backgroundColor = 0x333333;

        plane = game.add.sprite(400, 300, 'plane');
        plane.anchor.setTo(0.5,0.5);
        
        game.physics.enable(plane, Phaser.Physics.ARCADE);

        plane.body.maxVelocity.setTo(MAX_SPEED_PLANE,MAX_SPEED_PLANE);

        plane.body.drag.setTo(DRAG,0);

        plane.reset(400, 300);
        plane.body.acceleration.setTo(0,0);
        plane.angle = 0;
        plane.body.velocity.setTo(0,0);
        

        planeSmoke = game.add.emitter(0,0,100);
        planeSmoke.gravity = 0;
        planeSmoke.setXSpeed(0,0);
        planeSmoke.setYSpeed(-80, -50);

        planeSmoke.setAlpha(1,0, planeSmokeLifetime, Phaser.Easing.Linear.InOut);

        planeSmoke.makeParticles('smoke');

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
       
       missileGroup = game.add.group();
        cursors = game.input.keyboard.createCursorKeys();
        
        timer = game.time.create(false);

        timer.loop(100, updateCounter, this);

        timer.start();

    }
    
    function updateCounter()
    {
        elapsedTime += .1;
    }

    
        

    

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

    function resetPlane()
    {
        timer.pause();
        if (elapsedTime > highScore )
        {
            highScore = elapsedTime;
        }
        elapsedTime = -2.0;
        

        
        plane.reset(400, 300);
        plane.body.acceleration.setTo(0,0);
        plane.angle = 0;
        plane.body.velocity.setTo(0,0);
        timer.resume();
        
        
    }

    



    function update() {
        
        game.debug.text('HIGHSCORE: ' + highScore + ' seconds', 32, 32 );
        game.debug.text('Time Survived: ' + elapsedTime + ' seconds', 32, 64);
        
        game.physics.arcade.collide(plane, ground);
        



        
         if (missileGroup.countLiving() < MAX_MISSILES && elapsedTime >= 0)
         {
             var randomNum = game.rnd.integerInRange(0,2);

             if(randomNum === 0)
             {
                 launchMissile(game.rnd.integerInRange(50,game.world.width - 50), -50);
             } else if (randomNum === 1)
             {
                 launchMissile(-50, game.rnd.integerInRange(50, game.world.height - 50));
             } else if( randomNum === 2)
             {
                launchMissile(game.world.width +50, game.rnd.integerInRange(50, game.world.height - 50));
             }
         }
        


         missileGroup.forEachAlive(function(m)
         {
            var distance = this.game.math.distance(m.x, m.y, plane.x, plane.y);
            if(distance < 5 )
            {
                m.kill();
                getExplosion(m.x, m.y);
                gameOver = true;
                resetPlane();
            }

            if (game.physics.arcade.collide(m, ground))
            {
                m.kill();
                getExplosion(m.x, m.y);
            }

            if(elapsedTime < 0)
            {
                m.kill();
                getExplosion(m.x, m.y);
            }


         }, this);

         //planeSmoke.x = plane.x;
         //planeSmoke.y = plane.y;

         //planeSmoke.rotate(plane.x, plane.y, plane.angle * -1, 10);
        
         if(plane.x > game.world.width)
        {
            plane.x = 0;
        }

        if(plane.x < 0 )
        {
            plane.x = game.world.width;
        }

        if(plane.y < 0)
        {
            plane.angle = game.rnd.integerInRange(80,100);
        }

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

        var planeOnTheGround = plane.body.touching.down;
        
        if(planeOnTheGround)
        {
            gameOver = true;
            getExplosion(plane.x, plane.y);
            resetPlane();
        }

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

    function launchMissile(x,y)
    {
        var missile = missileGroup.getFirstDead();

        if(missile === null)
        {
            missile = new Missile(game);
            missileGroup.add(missile);
        }

        missile.revive();

        missile.x = x;
        missile.y = y;
    }
//Borrowed from GameMechanicExplorer Homing missiles with some things modified to do what i want it to do
    var Missile = function(game, x,y) 
    {
        Phaser.Sprite.call(this, game, x,y, 'missile');

        this.anchor.setTo(0.5, 0.5);

        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.SPEED = 300;

        this.TURN_RATE = 3;
        this.WOBBLE_LIMIT = 15;
        this.WOBBLE_SPEED = 250;
        this.SMOKE_LIFETIME = 1000;
        this.AVOID_DISTANCE = 80;

        this.wobble = this.WOBBLE_LIMIT;
        this.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );

         // Add a smoke emitter with 100 particles positioned relative to the
        // bottom center of this missile
        this.smokeEmitter = this.game.add.emitter(0, 0, 100);

        // Set motion parameters for the emitted particles
        this.smokeEmitter.gravity = 0;
        this.smokeEmitter.setXSpeed(0, 0);
        this.smokeEmitter.setYSpeed(-80, -50); // make smoke drift upwards

        // Make particles fade out after 1000ms
        this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
        Phaser.Easing.Linear.InOut);

        // Create the actual particles
        this.smokeEmitter.makeParticles('smoke');

        // Start emitting smoke particles one at a time (explode=false) with a
        // lifespan of this.SMOKE_LIFETIME at 50ms intervals
        this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);

    }

    Missile.prototype = Object.create(Phaser.Sprite.prototype);
    Missile.prototype.constructor = Missile;
    Missile.prototype.update = function() {
        // If this missile is dead, don't do any of these calculations
        // Also, turn off the smoke emitter
        if (!this.alive) {
            this.smokeEmitter.on = false;
            return;
        } else {
            this.smokeEmitter.on = true;
        }
    
        // Position the smoke emitter at the center of the missile
        this.smokeEmitter.x = this.x;
        this.smokeEmitter.y = this.y;
    
        // Calculate the angle from the missile to the mouse cursor game.input.x
        // and game.input.y are the mouse position; substitute with whatever
        // target coordinates you need.
        var targetAngle = this.game.math.angleBetween(
            this.x, this.y,
            plane.x, plane.y
        );
    
        // Add our "wobble" factor to the targetAngle to make the missile wobble
        // Remember that this.wobble is tweening (above)
        targetAngle += this.game.math.degToRad(this.wobble);
    
    
        // Make each missile steer away from other missiles.
        // Each missile knows the group that it belongs to (missileGroup).
        // It can calculate its distance from all other missiles in the group and
        // steer away from any that are too close. This avoidance behavior prevents
        // all of the missiles from bunching up too tightly and following the
        // same track.
        var avoidAngle = 0;
        this.parent.forEachAlive(function(m) {
            // Don't calculate anything if the other missile is me
            if (this == m) return;
    
            // Already found an avoidAngle so skip the rest
            if (avoidAngle !== 0) return;
    
            // Calculate the distance between me and the other missile
            var distance = this.game.math.distance(this.x, this.y, m.x, m.y);
    
            // If the missile is too close...
            if (distance < this.AVOID_DISTANCE) {
                // Chose an avoidance angle of 90 or -90 (in radians)
                avoidAngle = Math.PI/2; // zig
                if (Phaser.Utils.chanceRoll(50)) avoidAngle *= -1; // zag
            }
        }, this);
    
        // Add the avoidance angle to steer clear of other missiles
        targetAngle += avoidAngle;
    
        // Gradually (this.TURN_RATE) aim the missile towards the target angle
        if (this.rotation !== targetAngle) {
            // Calculate difference between the current angle and targetAngle
            var delta = targetAngle - this.rotation;
    
            // Keep it in range from -180 to 180 to make the most efficient turns.
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;
    
            if (delta > 0) {
                // Turn clockwise
                this.angle += this.TURN_RATE;
            } else {
                // Turn counter-clockwise
                this.angle -= this.TURN_RATE;
            }
    
            // Just set angle to target angle if they are close
            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }
    
        // Calculate velocity vector based on this.rotation and this.SPEED
        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
    };


};
