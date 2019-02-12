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
        
        
       
        game.load.spritesheet('crossHair', 'assets/crossHair.png', 32, 32);
        game.load.spritesheet('player', 'assets/playerG.png', 32, 32);
         //game.load.image('dude', 'assets/testperson');
         
    }
    
   var player1;
   var player2;

   var crossHair1;
   var crossHair2
    var cursors;
    
   
    function create() {
        game.stage.backgroundColor = 0x333333;

        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        player1 = game.add.sprite(200, 400, 'player');
        player1.grappling = false;

        player2 = game.add.sprite(600, 400, 'player');
        player2.grappling = true;


        crossHair1 = game.add.sprite(400,300, 'crossHair');
        crossHair1.anchor.setTo(0.5,0.5);

        crossHair2 = game.add.sprite(500,300, 'crossHair');
        crossHair2.anchor.setTo(0.5,0.5);
        
        cursors = game.input.keyboard.createCursorKeys();
        
    }
    
    
   

    function update() {
        
        






    }
};
