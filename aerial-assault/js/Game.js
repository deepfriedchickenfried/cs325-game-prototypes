"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var cursors;
    
    var shiftKey;
    var shift;
    var attackKey;
    var bombKey;

    var boss;
    var bossAnim;

    var bossHealth;

    var ROTATION_SPEED_PLANE = 300;
    var ACCELERATION_PLANE = 600;
    var MAX_SPEED_PLANE = 200;
    var DRAG = 10;
    var GRAVITY = 100;
    var rollAnimation;
    var rollDelay = 600;
    var rollDuration;

    var lastBulletShotAt;
    var BulletDelay = 250;

    var lastBombShotAt;
    var BombDelay = 800;

    var fx;

    var endedfx;

    var timer;

    var elapsedTime = 0;

    var elapsedMax = 5;

    var highScore = 60;

    var plane;

    var pauseSpawn = false;

    var ground;
    
    var explosionGroup;
    var pExplosionGroup;

    var missileGroup;

    var MAX_MISSILES = 1;

    var pBullets;
    var pBombs;

    var planeSmoke;

    var planeSmokeLifetime = 1000;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('EndScreen', true);

    }
    
    //used to update the timer
    function updateCounter()
    {
        elapsedTime += 1;
    }
    

    function getPExplosion(x,y)
    {
        var explosion = pExplosionGroup.getFirstDead();

        if(explosion === null)
        {
            explosion = game.add.sprite(0,0, 'explosion');
            explosion.anchor.setTo(0.5,0.5);
            explosion.scale.setTo(1.5,1.5);
            game.physics.arcade.enable(explosion);
            
            explosion.tint = 0xffd541;
            var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
            animation.killOnComplete = true;
            pExplosionGroup.add(explosion);
        }

        explosion.revive();

        explosion.x = x;
        explosion.y = y;
        fx.play();
        game.camera.shake(0.01, 200);
        explosion.animations.play('boom');
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

        
        elapsedTime = 0;
        elapsedMax = 5;
        MAX_MISSILES = 1;
        missileGroup.forEachAlive(function (m)
        {
            m.kill();
            getExplosion(m.x,m.y);
        },this);
        pBombs.forEachAlive(function (m)
        {
            m.kill();
            getPExplosion(m.x,m.y);
        },this);
        pBullets.forEachAlive(function (m)
        {
            m.kill();
        }, this);

        MAX_MISSILES = 1;
        plane.reset(400, 300);
        plane.body.acceleration.setTo(0,0);
        plane.angle = 0;
        plane.body.velocity.setTo(0,0);
        timer.resume();
        
        
    }
    
    function knockback()
    {
        plane.x +=  (Math.cos((plane.rotation + Math.PI) % (2 *Math.PI)) * 1);
        plane.y +=  (Math.sin((plane.rotation + Math.PI) % (2 *Math.PI)) * 1);
    }

    function roll()
    {
        if(!plane.alive) return;

        if(rollDuration === undefined) rollDuration = 0;
        if(game.time.now -rollDuration < rollDelay) return;

        rollDuration = game.time.now;
        shift = true;
        plane.animations.play('roll');
        

        

    }

     //launches a missile
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
    function shootBomb()
    {
        if(lastBombShotAt === undefined) lastBombShotAt = 0;
        if(game.time.now - lastBombShotAt < BombDelay) return;

        lastBombShotAt = game.time.now;

        var bomb = pBombs.getFirstDead();

        if(bomb === null || bomb === undefined) return;

        bomb.revive();
        bomb.checkWorldBounds = true;
        bomb.outOfBoundsKill = true;
        bomb.reset( plane.x,  plane.y);
        bomb.rotation = plane.rotation;

        bomb.body.velocity.x =  plane.body.velocity.x;
        bomb.body.velocity.y =  plane.body.velocity.y;
        
    }
    function shootBullet()
    {
        if(lastBulletShotAt === undefined) lastBulletShotAt = 0;
        if(game.time.now-lastBulletShotAt < BulletDelay) return;

        lastBulletShotAt = game.time.now;

        var bullet = pBullets.getFirstDead();

        if(bullet === null || bullet === undefined) return;

        bullet.revive();
        
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
        bullet.reset((Math.cos((plane.rotation) % (2 *Math.PI)) * 6) + plane.x, (Math.sin((plane.rotation) % (2 *Math.PI)) * 6) + plane.y);
        bullet.rotation = plane.rotation;

        bullet.body.velocity.x = Math.cos(bullet.rotation) * 350 + plane.body.velocity.x;
        bullet.body.velocity.y = Math.sin(bullet.rotation) * 350 + plane.body.velocity.y;

    }

//Borrowed from GameMechanicExplorer Homing missiles
    
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
    
    return {
    
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            boss = game.add.sprite(game.world.centerX, game.world.centerY, 'boss');
            boss.anchor.setTo(0.5,0.5);
            boss.alpha = 0;
            bossAnim = boss.animations.add('fire', [0,1,2,3], 60, false);
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
            planeSmoke.setYSpeed(-40, -10);

            planeSmoke.setAlpha(1,0, planeSmokeLifetime, Phaser.Easing.Linear.InOut);

            planeSmoke.makeParticles('smallSmoke');

            planeSmoke.start(false,planeSmokeLifetime, 50);

            game.physics.arcade.enable(plane);

            plane.body.gravity.y = GRAVITY;

            rollAnimation = plane.animations.add('roll',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18, 0],60, false);
            ground = game.add.group();
            ground.enableBody = true;
            for(var x = 0; x < game.world.width; x += 32)
            {
               var groundBlock = ground.create(x,game.world.height - 32, 'ground');
               groundBlock.body.immovable = true;
               groundBlock = ground.create(x,game.world.height, 'ground');
               groundBlock.body.immovable = true;
            }

            explosionGroup = game.add.group();
            
            pExplosionGroup = game.add.group();
           missileGroup = game.add.group();
            cursors = game.input.keyboard.createCursorKeys();
            
            attackKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
            shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
            bombKey = game.input.keyboard.addKey(Phaser.Keyboard.C);

            pBullets = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var pBullet = game.add.sprite(0,0, 'pBullet');
                pBullets.add(pBullet);

                pBullet.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(pBullet);
                pBullet.kill();
            }

            pBombs = game.add.group()
            for(var i = 0; i < 100; i++)
            {
                var pBomb = game.add.sprite(0,0, 'pBomb');
                pBombs.add(pBomb);
                pBomb.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(pBomb);
                pBomb.body.gravity.y = 250;
                pBomb.kill();

            }

            timer = game.time.create(false);

            timer.loop(1000, updateCounter, this);

            timer.start();
        },
    
        update: function () {
            game.debug.text('HIGHSCORE: ' + highScore + ' seconds', 32, 32 );
            game.debug.text('Time Survived: ' + elapsedTime + ' seconds', 32, 64);
        
        game.physics.arcade.collide(plane, ground);
        
        //every 5 seconds add a missile
        if(elapsedTime >= elapsedMax)
        {
            MAX_MISSILES += 2;
            elapsedMax +=5;
        }
        if(elapsedTime > highScore)
        {
            highScore = elapsedTime;
        }
        
        if(elapsedTime >= 100 && elapsedTime <= 105)
        {
            boss.alpha = .5;
            boss.animations.play('fire');
        }else
        {
            boss.alpha = 0;
        }

        //if there are a max number of missiles spawn some in from the sides of the game
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
        
         pBullets.forEachAlive(function(c)
         {
             
             if(elapsedTime <= 0)
             {
                 c.kill();
             }

         },this);
         
         pBombs.forEachAlive(function(m)
         {
            if(elapsedTime <= 0)
             {
                 m.kill();
                 getPExplosion(m.x,m.y);
             }

             if(game.physics.arcade.collide(m,pBullets))
             {
                 m.kill();
                 getPExplosion(m.x,m.y);
             }

            if(game.physics.arcade.collide(m,ground))
            {
                m.kill()
                getPExplosion(m.x,m.y);
            }
            missileGroup.forEachAlive(function(o)
            {
                if(game.physics.arcade.collide(m,o))
                {
                    m.kill();
                    o.kill();
                    getPExplosion(m.x, m.y);
                    getPExplosion(o.x,o.y);
                    
                }

            },this)
            m.rotation = Math.atan2(m.body.velocity.y, m.body.velocity.x);

         },this);
         //things that all alive missiles check for
         missileGroup.forEachAlive(function(m)
         {
           //if the distance between a missile and the plane is less than 5 game over
            var distance = this.game.math.distance(m.x, m.y, plane.x, plane.y);
            
            pBullets.forEachAlive(function(o)
            {
                if(game.physics.arcade.collide(m, o))
                {
                    m.kill();
                    o.kill();
                    getExplosion(m.x, m.y);
                }

                if( elapsedTime <= 0)
                {
                    o.kill();
                }

            },this);
            if(distance < 5 )
            {
                m.kill();
                getExplosion(m.x, m.y);
                
                resetPlane();
            }
            // if a missile hits the ground, destroy it
            if (game.physics.arcade.collide(m, ground))
            {
                m.kill();
                getExplosion(m.x, m.y);
            }

            if(game.physics.arcade.collide(m, pExplosionGroup))
            {
                m.kill();
                getPExplosion(m.x,m.y);
            }
            
            // if the player dies and time is reset, kill all missiles
            if(elapsedTime <= 0)
            {
                m.kill();
                getExplosion(m.x, m.y);
            }
            // if the player survived, destory all missles and move to win screen
            
          
         }, this);

         pExplosionGroup.forEachAlive(function(m)
        {
            missileGroup.forEachAlive(function(n)
            {
                if(game.physics.arcade.collide(m,n))
                {
                    n.kill();
                    getPExplosion(n.x,n.y);
                }
            },this);
        },this);
         //put the plane on top of the smoke trail
         plane.bringToTop();
         ground.bringToTop();
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
        //var lastLeftDownDuration = game.input.keyboard.downDuration(Phaser.keycode.LEFT, game.input.justPressedRate);
        //var lastRightDownDuration = game.input.keyboard.downDuration(Phaser.keycode.RIGHT, game.input.justPressedRate);

        /*if(game.input.keyboard.upDuration(Phaser.keycode.LEFT, game.input.doubleTapRate) && lastLeftDownDuration && cursors.left.onDown)
        {

        }*/
        // turning
        
        

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
        } 
        else
        {
            plane.body.acceleration.setTo(0,0);
           planeSmoke.on = false;
        }

        //var lastLeftDownDuration = game.input.keyboard.downDuration(Phaser.keycode.LEFT, game.input.justPressedRate);
        //var lastRightDownDuration = game.input.keyboard.downDuration(Phaser.keycode.RIGHT, game.input.justPressedRate);

        /*if(game.input.keyboard.upDuration(Phaser.keycode.LEFT, game.input.doubleTapRate) && lastLeftDownDuration && cursors.left.onDown)
        {

        }*/
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
       

        if(attackKey.isDown)
        {
            shootBullet();
        }

        if(shiftKey.isDown)
        {
            plane.animations.play('roll');
        }

        if(bombKey.isDown)
        {
            shootBomb();
        }

       }

      
    };
};
