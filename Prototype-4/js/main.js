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
        game.load.spritesheet('Swords', 'assets/Swords.png', 10, 48,4);
        
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
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = .8


        walls = game.add.group();
        walls.enableBody = true;
        
        for(var x = 0; x < game.world.width; x+= 32)
        {
            if(x === 0 || x === (game.world.width - 32))
            {
                for(var y = 0; y < game.world.height; y+= 32)
                {
                    var wallBlocks = walls.create(x,y, 'wallBlocks' );
                    game.physics.p2.enable(wallBlocks);
                    wallBlocks.body.static = true;
                }
            }else
            {
                var wallBlocks = walls.create(x, 0, 'wallBlocks');
                game.physics.p2.enable(wallBlocks);
                wallBlocks.body.static = true;

                wallBlocks = walls.create(x, game.world.height - 32, 'wallBlocks');
                game.physics.p2.enable(wallBlocks);
                wallBlocks.body.static = true;

                if(x === 4 * 32 || x === game.world.width - 5 * 32)
                {
                    for(var y = 32 *11; y < 32* 16; y+= 32)
                    {
                        wallBlocks = walls.create(x, y, 'wallBlocks');
                        game.physics.p2.enable(wallBlocks);
                        wallBlocks.body.static = true;
                    }
                }
            }

        }

        game.physics.p2.enable(walls);

        player1 = game.add.sprite(64, 32 * 13, 'Swords');
        game.physics.p2.enable(player1);
        player1.anchor.setTo(0.2, 0.5);
        player1.frame= 0;
        player1.body.damping=.8;
        
        console.log(player1.body.debug);

        p1Key = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        p2Key = game.input.keyboard.addKey(Phaser.Keyboard.F);
        p3Key = game.input.keyboard.addKey(Phaser.Keyboard.J);
        p4Key = game.input.keyboard.addKey(Phaser.Keyboard.P);
    }
    

    function update() {
        

        if(p1Key.isDown)
        {
            player1.body.setZeroRotation();
            player1.body.thrust(ACCELERATION);

        }else{
            player1.body.rotateLeft(ROTATION_SPEED);
        }

        game.debug.bodyInfo(player1, 32,32);

        game.debug.body(player1);

    }






    
};
