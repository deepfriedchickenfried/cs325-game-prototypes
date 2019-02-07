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
    
    var game = new Phaser.Game( 800, 608, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('background', 'assets/background.png');
        game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'block', 'assets/block.png');
        game.load.spritesheet( 'knife', 'assets/Sword.png', 32, 32, 16);
         //game.load.image('dude', 'assets/testperson');
         game.load.spritesheet( 'dude', 'assets/Hero.png', 32, 32, 18);
         //game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    }
    
   
    var platforms;
    var player;
    var armed;
    var cursors;
    
    var weapon;

    var knifeSpeed;
    
    var knifeGroup;
    function create() {
       game.physics.startSystem(Phaser.Physics.ARCADE);
	
       game.add.sprite(0,0,'background');
       
       platforms = game.add.group();
       
       platforms.enableBody = true;

       var ground;
        for(var i = 0; i < game.world.width; i += 16 )
        {
       ground = platforms.create(i, game.world.height -16, 'block');
       ground.body.immovable = true;
       ground = platforms.create(i, 0, 'block');
        ground.body.immovable = true;
        }
       
        for(var b = 16; b < game.world.height - 16; b += 16);
        {
            ground = platforms.create(16, b, 'block');
            ground.body.immovable = true;
            ground = platforms.create(game.world.width - 16, b, 'block');
            ground.body.immovable = true;
        }
        
      player = game.add.sprite(32, game.world.height - 150, 'dude');
      
      player.anchor.setTo(0.5, 0.5);

      game.physics.arcade.enable(player);

      
      player.body.gravity.y = 500;
      player.body.collideWorldBounds = true;

      //player.animations.add('left', [0, 1, 2, 3], 10, true);
       // player.animations.add('right', [5, 6, 7, 8], 10, true);
      
    
        armed = true;
        knifeGroup = game.add.group();
       var knife = game.add.sprite(0,0, 'knife');
        knifeGroup.add(knife);

        knife.anchor.setTo(0.5,0.5);
        knife.animations.add('right', [0,1,2,3,4,5,6,7], 10, true);
        knife.animations.add('left', [8,9,10,11,12,13,14,15],10, true);
        game.physics.arcade.enable(knife);
        knife.body.gravity.y = 500;
        knife.body.bounce.y = .5;
        knife.body.bounce.x = .5;
        knifeSpeed = 250;
        knife.kill();

      player.animations.add('left', [0,1,2,3], 10, true);
      
      player.animations.add('right', [5,6,7,8], 10, true);
      player.animations.add('left-unarmed', [9,10,11,12], 10, true);
     
      player.animations.add('right-unarmed', [14,15,16,17], 10, true);
     
     
      cursors = game.input.keyboard.createCursorKeys();
    
    
    }
    
    
   

    function update() {
        
       var hitPlatformPlayer = game.physics.arcade.collide(player, platforms);
       game.physics.arcade.collide(knifeGroup, platforms);

        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            
            player.body.velocity.x = -150;
            
            if(armed === true)
            {
            player.animations.play('left');
            }
            else
            {
            player.animations.play('left-unarmed');
            }
            
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;
            
            if(armed === true)
            {
            player.animations.play('right');
            }
            else
            {
            player.animations.play('right-unarmed');
            }
            
        }
        else
        {
            //  Stand still
            
            player.animations.stop();
            if(armed === true)
            {
            player.frame = 4;
            }
            else
            {   
            player.frame = 13;
            }
            
        }

        if (cursors.up.isDown && player.body.touching.down && hitPlatformPlayer)
        {
            player.body.velocity.y = -200;
        }
        
        if (game.input.activePointer.isDown && armed)
        {
            throwKnife();
        } 








    }
};
