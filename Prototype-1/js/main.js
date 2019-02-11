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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        
        
        game.load.image( 'block', 'assets/block.png');
        game.load.spritesheet( 'tankBody', 'assets/tankBody.png', 32, 32, 2);
        game.load.spritesheet('crossHair', 'assets/crossHair.png', 32, 32);
        game.load.image('tankTop', 'assets/tankTop1.png');
        game.load.image('smallSmoke', 'assets/smallSmoke.png');
         //game.load.image('dude', 'assets/testperson');
         
    }
    
   var tank;
   var tankGun;
   var crossHair;
    var cursors;
    
    var ROTATION_SPEED_TANK = 300;
    var ACCELERATION_TANK = 600;
    var MAX_SPEED_TANK = 200;
    var DRAG_TANK = 10;
    function create() {
       
        game.stage.backgroundColor = 0x333333;

        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        tank = game.add.sprite(400,300, 'tankBody');
        
        tank.anchor.setTo(0.5,0.5);

        game.physics.arcade.enable(tank);
        tank.body.maxVelocity.setTo(MAX_SPEED_TANK, MAX_SPEED_TANK);


        tankGun = game.add.sprite(400,300, 'tankTop');
        tankGun.anchor.setTo(0.5,0.5);


        crossHair = game.add.sprite(400,300, 'crossHair');
        
        
        cursors = game.input.keyboard.createCursorKeys();
    
    }
    

    function update() {
        
        tankGun.rotation = game.physics.arcade.angleToPointer(tankGun);
        tankGun.x = tank.x;
        tankGun.y = tank.y;

        crossHair.x = game.input.x;
        crossHair.y = game.input.y;

        if(cursors.up.isDown)
        {
            tank.body.acceleration.x = Math.cos(tank.rotation) * ACCELERATION_TANK;
            tank.body.acceleration.y = Math.sin(tank.rotation) * ACCELERATION_TANK;
        } else if(cursors.down.isDown)
        {
            tank.body.acceleration.x = Math.cos(tank.rotation) * ACCELERATION_TANK;
            tank.body.acceleration.y = Math.sin(tank.rotation) * ACCELERATION_TANK;
        } else
        {
            tank.body.acceleration.setTo(0,0);

            if(cursors.left.isDown)
            {
                tank.body.angularVelocity = -ROTATION_SPEED_TANK;
            } else if(cursors.right.isDown)
            {
                tank.body.angularVelocity = ROTATION_SPEED_TANK;
            } else
            {
                tank.body.angularVelocity = 0;
            }
        }
    }






    
};
