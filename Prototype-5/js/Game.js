"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    
    var bouncy = null;
    var lives = 3;
    var ammo;
    var player;
    var lettersGroup;
    var letterArray =[];
    var lettersBullets;
    var LBspeed = 300;
    var letterShotDelay = 100;
    var lastLetterShotAt;



    var vacuumRadius;
    var vacuum = true;

    var Speed = 150;


    var left;
    var right;
    var up;
    var down;
    var space;

    var maxEnemies = 10;
    var enemies;
    var enemyBullets;
    var enemybulletSpeed = 200;

    var style;
    var bulletText;
    var healthText;


    function spawnEnemy(x, y)
    {
        var enemy = enemies.getFirstDead();

        if(enemy === null)
        {
            enemy = new Enemy(game);
            enemies.add(enemy);
        }

        enemy.revive();

        enemy.x = x;
        enemy.y = y;
    }

    function fireBullet(x,y,direction)
    {
        var bullet = enemyBullets.getFirstDead();
        bullet.revive();
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
        bullet.reset((Math.cos((direction) % (2 *Math.PI)) * 15) + x, (Math.sin((direction) % (2 *Math.PI)) * 15) + y);
        bullet.rotation = direction;
        bullet.body.velocity.x = Math.cos(bullet.rotation) * enemybulletSpeed;
        bullet.body.velocity.y = Math.sin(bullet.rotation) * enemybulletSpeed;
    }

    function knockback()
    {
        player.x +=  (Math.cos((player.rotation + Math.PI) % (2 *Math.PI)) * 4);
        player.y +=  (Math.sin((player.rotation + Math.PI) % (2 *Math.PI)) * 4);
    }

    function shootLetter()
    {
        if(lastLetterShotAt === undefined) lastLetterShotAt = 0;
        if(game.time.now - lastLetterShotAt < letterShotDelay) return;

        lastLetterShotAt = game.time.now;

        var letter = lettersBullets.getFirstDead();

        if(letter === null || letter === undefined) return;

        if(letterArray.length <= 0) return;

        letter.revive();

        letter.frame = letterArray.pop();
        //letter.frame = game.rnd.integerInRange(0,25);
        letter.checkWorldBounds = true;
        letter.outOfBoundsKill = true;
        letter.reset((Math.cos((player.rotation) % (2 *Math.PI)) * 15) + player.x, (Math.sin((player.rotation) % (2 *Math.PI)) * 15) + player.y);
        
         
        letter.rotation = player.rotation;

        letter.body.velocity.x = Math.cos(letter.rotation) * LBspeed;
        letter.body.velocity.y = Math.sin(letter.rotation) * LBspeed;   
        knockback();
    }

    function spawnLetter(x,y)
    {
        var letter = lettersGroup.getFirstDead();
        letter.revive();
        letter.frame = game.rnd.integerInRange(0,25);
        letter.vacuum = false;
        letter.body.velocity.setTo(0,0);
        letter.checkWorldBounds = true;
        letter.outOfBoundsKill = true;
        letter.x = x;
        letter.y = y;

    }

    function spawnPhrase(x,y, z)
    {

        if(lastLetterShotAt === undefined) lastLetterShotAt = 0;
        if(game.time.now - lastLetterShotAt < letterShotDelay) return;

        lastLetterShotAt = game.time.now;

        var word = [];
        switch(z)
        {
            case 1:
                //pew
                word.unshift(15);
                word.unshift(4);
                word.unshift(22);
                break;
            case 2:
                //bang
                word.unshift(1);
                word.unshift(0);
                word.unshift(13);
                word.unshift(6);
                break;
            case 3:
                //There he is
                word.unshift(19);
                word.unshift(7);
                word.unshift(4);
                word.unshift(17);
                word.unshift(4);
                word.unshift(-1);
                word.unshift(7);
                word.unshift(4);
                word.unshift(-1);
                word.unshift(8);
                word.unshift(18);
                
                
                break;
            case 4:
                //ow
                word.unshift(14);
                word.unshift(22);
            case 5:
            case 6:
            case 7:

        }

        var startingX = x- word.length * 7 /2;
        var startingY = y - 30;
        for(var i = 0; i < word.length; i++)
        {
            var fr = word.pop();
            if(fr !== -1)
            {
            var letterS = lettersGroup.getFirstDead();
            letterS.revive();
            letterS.bringToTop();
            letterS.frame = fr;
            letterS.checkWorldBounds = true;
            letterS.outOfBoundsKill = true;
            letterS.reset(startingX + 7 * i, startingY);
             
            letterS.body.velocity.y = -50;
            } 
        }

    }

    var Enemy = function(game, x,y)
    {
        Phaser.Sprite.call(this, game, x,y, 'enemy');
        this.anchor.setTo(0.5, 0.5);
        

        game.physics.arcade.enable(this);

        this.health = 5;
        this.turnDirection = 1;
        this.SPEED = 75;
        this.LETTERDELAY = 500;
        this.LASTLETTERFIRED = 0;
        this.distanceToPlayer = 0;
        this.BULLETDELAY = 400;
        this.LASTBULLETFIRED;



    }

    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;
    
    Enemy.prototype.update = function()
    {
       if(this.alive)
       {
        this.rotation = game.physics.arcade.angleToXY(this, player.x, player.y);


        this.distanceToPlayer = game.math.distance(this.x,this.y, player.x, player.y);
        
        
           
        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
        

            if(lives <= 0)
            {

                this.kill();
            }
        }
    }

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('GameOver');

    }
    
    return {
    
        create: function () {
           
           
            
            style = {font: "14px Arial", fill: "#ffffff"};

            healthText = game.add.text(0,0, "Health: 3");
            bulletText = game.add.text(0, 20, "Ammo: 0");
            
            game.stage.backgroundColor = 0x5f574f;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);
            player.body.collideWorldBounds= true;



            left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            right = game.input.keyboard.addKey(Phaser.Keyboard.D);
            up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            down = game.input.keyboard.addKey(Phaser.Keyboard.S);
            space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            lettersGroup =game.add.group();
            for(var i = 0; i < 100; i++)
            {
                var letterS = game.add.sprite(0,0, 'letters');
                lettersGroup.add(letterS);
                letterS.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(letterS);
                letterS.kill();

                
            }


            lettersBullets = game.add.group();
            for(var i = 0; i < 100; i++)
            {
                var letterBullet = game.add.sprite(0,0, 'letters');
                lettersBullets.add(letterBullet);

                letterBullet.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(letterBullet);
                letterBullet.kill();
            }

            enemies = game.add.group();
            enemyBullets = game.add.group();
            for(var i = 0; i < 500; i++)
            {
                var bullet = game.add.sprite(0,0, 'enemyBullet');
                enemyBullets.add(bullet);
                bullet.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(bullet);
                bullet.kill();
            }
            
        },
    
        update: function () {
            
            bulletText.setText("Ammo: " + letterArray.length);
            healthText.setText("Health: " + lives);

            if(lives <= 0)
            {
                quitGame();
            }

            if(lettersGroup.countLiving() < 100)
            {
                spawnLetter(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.width));
            }

            var playerhit= game.physics.arcade.collide(player,enemies);
            
            if(playerhit)
            {
                lives--;
            }

            player.rotation = game.physics.arcade.angleToPointer(player);
            
            player.frame = 0;
            if(up.isDown)
            {
                player.body.velocity.y = -Speed;
            } else if( down.isDown)
            {
                player.body.velocity.y = Speed;
            }else
            {
                player.body.velocity.y = 0;
            }

            if(left.isDown)
            {
                player.body.velocity.x = -Speed;
            } else if(right.isDown)
            {
                player.body.velocity.x = Speed;
            } else
            {
                player.body.velocity.x = 0;
            }
            
            if(game.input.activePointer.isDown)
            {
                shootLetter();
                //spawnPhrase(game.input.x, game.input.y,3);
            } else if( space.isDown)
            {
                player.frame = 7;
                lettersGroup.forEachAlive(function(m)
                {
                    var distance = this.game.math.distance(m.x,m.y, player.x, player.y)

                    if(distance< 100)
                    {
                         m.vacuum = true;
                    }

                    
                }, this);
            }
            
            lettersGroup.forEachAlive(function(m)
            {
                var distance = this.game.math.distance(m.x,m.y, player.x, player.y)

              

                if(m.vacuum === true)
                {
                    game.physics.arcade.moveToObject(m, player, 600);

                    if(distance < 5)
                    {
                        letterArray.unshift(m.frame);
                        m.kill();
                    }
                }



            }, this);
            if(enemies.countLiving() < maxEnemies)
            {
                
             var randomNum = game.rnd.integerInRange(0,3);

             if(randomNum === 0)
             {
                 spawnEnemy(game.rnd.integerInRange(0,game.world.width), -50);
             } else if (randomNum === 1)
             {
                 spawnEnemy(-50, game.rnd.integerInRange(0, game.world.height));
             } else if( randomNum === 2)
             {
                spawnEnemy(game.world.width + 50, game.rnd.integerInRange(0, game.world.height));
             }else
             {
                spawnEnemy(game.rnd.integerInRange(0,game.world.width), game.world.height + 50);
             }
            }

            lettersBullets.forEachAlive(function(m)
            {
                var hit = game.physics.arcade.collide(m, enemies);
                if(hit)
                {
                    m.kill();
                }
            },this);

            enemies.forEachAlive(function(m)
            {
                var hit = game.physics.arcade.collide(m, lettersBullets);
                if(hit)
                {
                    m.x +=  (Math.cos((m.rotation + Math.PI) % (2 *Math.PI)) * 4);
                    m.y +=  (Math.sin((m.rotation + Math.PI) % (2 *Math.PI)) * 4);
                    m.health--;

                }
            },this);

            
        }
    };
};
