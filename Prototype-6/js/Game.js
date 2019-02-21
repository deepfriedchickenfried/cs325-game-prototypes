"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var ground;
    
    var bouncy = null;
    var lives;
    var ammo;
    var player;
    var lettersGroup;
    var letterArray =[];
    var lettersBullets;
    var LBspeed = 500;
    var letterShotDelay;
    var lastLetterShotAt;

    var vacuum = true;

    var Speed = 200;


    var left;
    var right;
    var up;
    var down;

    var enemies;
    var enemyBullets;

    function spawnEnemy(x, y)
    {

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
        letter.checkWorldBounds = true;
        letter.outOfBoundsKill = true;
        letter.reset(player.x, player.y);
        letter.rotation = player.rotation;

        letter.body.velocity.x = Math.cos(letter.rotation) * LBspeed;
        letter.body.velocity.y = Math.sin(letter.rotation) * LBspeed;
    }
    
    function spawnPhrase(x,y, z)
    {
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
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
            game.world.setBounds(-1000, -1000, 2000, 2000);
            ground = game.add.tileSprite(0,0, 800, 600, 'ground');
            ground.fixedToCdamera = true;
            
            game.stage.backgroundColor = 0xc2c3c7;
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            
            player.anchor.setTo(0.5, 0.5);
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);
            player.body.collideWorldBounds= true;


            game.camera.follow(player);
            game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
            game.camera.focusOnXY(0, 0);

            left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            right = game.input.keyboard.addKey(Phaser.Keyboard.D);
            up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            down = game.input.keyboard.addKey(Phaser.Keyboard.S);

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
            
        },
    
        update: function () {
            player.rotation = game.physics.arcade.angleToPointer(player);

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
                //shootLetter();
                spawnPhrase(game.input.x, game.input.y,3);
            }
            
        }
    };
};
