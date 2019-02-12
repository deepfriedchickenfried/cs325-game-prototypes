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
    
    var game = new Phaser.Game( 896, 768, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        
        game.load.image('spikes', 'assets/spikes.png');
        game.load.image('anchor', 'assets/anchor.png');
       
        game.load.spritesheet('crossHair', 'assets/crossHair.png', 32, 32);
        game.load.spritesheet('player', 'assets/playerG.png', 32, 32);
         //game.load.image('dude', 'assets/testperson');
         
    }
    
   var player1;
   var player2;

   var crossHair1;
   var crossHair2
    var p2Cursors;
    var p2Action;

    var p1Left;
    var p1Right;
    var p1Up;
    var p1Down;
    var p1Action;
    
    var ROTATION_SPEED = 300;
    var ACCELERATION = 300;
    var MAX_SPEED = 600;
    var GRAVITY = 100;

    var spikes;
    var anchors;

    function create() {
        game.stage.backgroundColor = 0x333333;

        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        player1 = game.add.sprite(200, 400, 'player');
        game.physics.arcade.enable(player1);
        player1.body.setCircle(24);
        player1.anchor.setTo(0.5,0.5);
        player1.grappling = false;
        player1.frame = 2;
        player1.gravity.y = GRAVITY;
        player1.nearestAnchor;

        player2 = game.add.sprite(600, 400, 'player');
        game.physics.arcade.enable(player2);
        player2.body.setCircle(24);
        player2.anchor.setTo(0.5,0.5);
        player2.grappling = false;
        player2.frame = 5;
        player2.gravity.y = GRAVITY;
        player2.nearestAnchor;

        crossHair1 = game.add.sprite(400,300, 'crossHair');
        crossHair1.anchor.setTo(0.5,0.5);

        crossHair2 = game.add.sprite(500,300, 'crossHair');
        crossHair2.anchor.setTo(0.5,0.5);
        
        p2Cursors = game.input.keyboard.createCursorKeys();
        p2Action = game.input.keyboard.createCursorKeys();

        
        p1Left =game.input.keyboard.addKey(Phaser.Keyboard.A);
        p1Right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        p1Up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        p1Down = game.input.keyboard.addKey(Phaser.Keyboard.S);

        spikes = game.add.group();
        spikes.enableBody = true;
        for(var x = 0; x < game.world.width; x += 32)
        {
            var spikeBlock = spikes.create(x,game.world.height - 32, 'spikes');
            
            spikeBlock.body.immovable = true;

        }

        //14 anchor blocks
        anchors.game.add.group();
        anchors.enableBody = true;

        var anchorBlock = anchors.create(128, 320, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;
        
        anchorBlock = anchors.create(256, 256, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;
        
        anchorBlock = anchors.create(256, 384, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;
        
        anchorBlock = anchors.create(320, 128, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;
        
        anchorBlock = anchors.create(320, 512, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(384, 320, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(448, 192, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        //middle bottom 
        anchorBlock = anchors.create(448, 448, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(512, 320, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(576, 128, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(576, 512, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(640, 256, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(640, 384, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;

        anchorBlock = anchors.create(768, 320, 'anchor');
        anchorBlock.anchor.setTo(0.5,0.5);
        anchorBlock.body.immovable = true;
        
        
    }
    


    
   

    function update() {
        
        






    }
};
