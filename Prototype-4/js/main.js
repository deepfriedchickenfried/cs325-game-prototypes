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
        
        this.game.load.tilemap('tilemap', 'assets/swordArena..json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image( 'mapTiles32', 'assets/mapTiles.png');
        game.load.spritesheet( 'Body', 'assets/Body.png', 32, 32);
        game.load.spritesheet('Swords', 'assets/Swords.png', 48, 10);
        
         //game.load.image('dude', 'assets/testperson');
         
    }
    
   var player1;
   var player2;
   var player3;
   var player4;
    
    var ROTATION_SPEED = 300;
    var ACCELERATION = 400;
    var MAX_SPEED = 200;
    var DRAG = 100;
    function create() {
       
        this.game.stage.backgroundColor = 0x333333;

        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('mapTiles', 'mapTiles');
    
        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.wallLayer = this.map.createLayer('WallLayer');
    
        this.map.setCollisionBetween(1, 100, true, 'WallLayer');

        this.wallLayer.resizeWorld();

    }
    

    function update() {
        
    }






    
};
