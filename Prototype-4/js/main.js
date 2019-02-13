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
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        
        
        game.load.spritesheet( 'wallBlocks', 'assets/mapTiles.png', 32,32);
        game.load.spritesheet( 'Body', 'assets/Body.png', 32, 32);
        game.load.spritesheet('Swords', 'assets/Swords.png', 48, 10);
        
         //game.load.image('dude', 'assets/testperson');
         
    }
    
    var walls;

   var player1; 
   var player2;
   var player3;
   var player4;

   var p1Key;
   var p2Key;
   var p3Key;
   var p4Key;
    
    var ROTATION_SPEED = 300;
    var ACCELERATION = 400;
    var MAX_SPEED = 400;
    var DRAG = 200;
    function create() {
       
        game.stage.backgroundColor = 0xc2c3c7;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        walls = game.add.group();
        walls.enableBody = true;

        for(var x = 0; x < game.world.width; x+= 32)
        {
            if(x === 0 || x === (game.world.width - 32))
            {
                for(var y = 0; y < game.world.height; y+= 32)
                {
                    var wallBlocks = walls.create(x,y, 'wallBlocks' );
                    wallBlocks.body.immovable = true;
                }
            }else
            {
                var wallBlocks = walls.create(x, 0, 'wallBlocks');
                wallBlocks.body.immovable = true;

                wallBlocks = walls.create(x, game.world.height - 32, 'wallBlocks');
                wallBlocks.body.immovable = true;

                if(x === 4 * 32 || x === game.world.width - 5 * 32)
                {
                    for(var y = 32 *11; y < 32* 16; y+= 32)
                    {
                        wallBlocks = walls.create(x, y, 'wallBlocks');
                        wallBlocks.body.immovable = true;
                    }
                }
            }

        }

        player1 = game.add.sprite(64, 32 * 13, 'Swords');
        game.physics.arcade.enable(player1);
        player1.anchor.setTo(0.2, 0.5);
        player1.frame= 0;
        player1.body.drag.setTo(DRAG,DRAG);
        player1.body.maxVelocity.setTo(MAX_SPEED,MAX_SPEED);
        player1.body.bounce.set(1);

        p1Key = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        p2Key = game.input.keyboard.addKey(Phaser.Keyboard.F);
        p3Key = game.input.keyboard.addKey(Phaser.Keyboard.J);
        p4Key = game.input.keyboard.addKey(Phaser.Keyboard.P);
    }
    

    function update() {
        game.physics.arcade.collide(player1, walls);

        if(p1Key.isDown)
        {
            player1.body.angularVelocity = 0;
            player1.body.acceleration.x = Math.cos(player1.rotation) * ACCELERATION;
            player1.body.acceleration.y = Math.cos(player1.rotation) * ACCELERATION;

        }else{
            player1.body.acceleration.setTo(0,0);
            player1.body.angularVelocity = ROTATION_SPEED;
        }

        game.debug.bodyInfo(player1, 32,32);

        game.debug.body(player1);

    }






    
};
