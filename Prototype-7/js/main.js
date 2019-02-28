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
        
        game.load.audio('OutOfTime', ['assets/Abstraction-Three_Red_Hearts-Out_of_Time.mp3', 'assets/Abstraction-Three_Red_Hearts-Out_of_Time.ogg']);
        game.load.spritesheet( 'wallBlocks', 'assets/mapTiles.png', 32,32);
        game.load.spritesheet( 'Body', 'assets/Body.png', 32, 32);
        game.load.spritesheet('Swords', 'assets/Swords.png', 10, 48,4);
        game.load.image('lootBox', 'assets/lootBox.png');
         //game.load.image('dude', 'assets/testperson');
         
    }
    
    
    var music;

    var liveCount;

    var walls;

    var sword1CollisionGroup;
    var sword2CollisionGroup;
    var sword3CollisionGroup;
    var sword4CollisionGroup;

    var wallsCollisionGroup;
    
    var body1CollisionGroup;
    var body2CollisionGroup;
    var body3CollisionGroup;
    var body4CollisionGroup;

    var player1Lives;
    var player2Lives;
    var player3Lives;
    var player4Lives;

   var player1; 
   var player2;
   var player3;
   var player4;
   
   var numOfSwords1;
   var numOfSwords2;
   var numOfSwords3;
   var numOfSwords4;

   var pbody1;
   var pbody2;
   var pbody3;
   var pbody4;

   var p1Key;
   var p2Key;
   var p3Key;
   var p4Key;

   var rotDirLeft = 1; 

    var power1 = [0,0,0,0];
    var power2 = [0,0,0,0];
    var power3 = [0,0,0,0];
    var power4 = [0,0,0,0];

    var lootBoxes;
    var lootBoxesCollisionGroup;
    var lootBoxDelay = 5000;
    var lastLootBoxSpawned;
    var lootBoxTimer;

    var ROTATION_SPEED = 300;
    var ACCELERATION = 2000;
    
    var style;
    var titleText;

    var player1Text;
    var player2Text;
    var player3Text;
    var player4Text;

    var emitter1;
    var emitter2;
    var emitter3;
    var emitter4;

    var deathEmitter1;
    var deathEmitter2;
    var deathEmitter3;
    var deathEmitter4;
    var pDrag = 100;
    var pLifetime = 5000;


    function create() {
       
        game.stage.backgroundColor = 0xc2c3c7;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = .8

        music = game.add.audio('OutOfTime');
        music.loop = true;
        music.play();

        style = {font: "98px Arial", fill: "#ffffff", align: "center"};

        titleText = game.add.text(game.world.centerX, game.world.centerY, "Q F J P", style);
        titleText.anchor.set(0.5);
        titleText.addColor('#ff004d', 0);
        titleText.addColor('#29adff', 2);
        titleText.addColor('#00e436', 4);
        titleText.addColor('#ffa300', 6);
        titleText.alpha = .3;

        player1Text = game.add.text(64 + 16, 32*12 +16, "3", style );
        player1Text.anchor.set(0.5);
        player1Text.addColor('#ff004d', 0);
        player1Text.alpha = .3;

        player2Text = game.add.text(game.world.width - 98 + 16, 32* 12 + 16, "3", style );
        player2Text.anchor.set(0.5);
        player2Text.addColor('#29adff', 0);
        player2Text.alpha = .3;

        player3Text = game.add.text(32 * 12 +16, 64 + 18, "3", style );
        player3Text.anchor.set(0.5);
        player3Text.addColor('#00e436', 0);
        player3Text.alpha = .3;

        player4Text = game.add.text(32*12 + 16, game.world.height-98 + 16, "3", style );
        player4Text.anchor.set(0.5);
        player4Text.addColor('#ffa300', 0);
        player4Text.alpha = .3;


        sword1CollisionGroup = game.physics.p2.createCollisionGroup();
        sword2CollisionGroup = game.physics.p2.createCollisionGroup();
        sword3CollisionGroup = game.physics.p2.createCollisionGroup();
        sword4CollisionGroup = game.physics.p2.createCollisionGroup();

        body1CollisionGroup = game.physics.p2.createCollisionGroup();
        body2CollisionGroup = game.physics.p2.createCollisionGroup();
        body3CollisionGroup = game.physics.p2.createCollisionGroup();
        body4CollisionGroup = game.physics.p2.createCollisionGroup();

       
       lootBoxesCollisionGroup = game.physics.p2.createCollisionGroup();
       lootBoxes = game.add.group();
       lootBoxes.enableBody = true;
       lootBoxes.physicsBodyType = Phaser.Physics.P2JS;

       for(var i = 0; i < 10; i++)
       {
           var lootBox = lootBoxes.create(0,0, 'lootBox');
           lootBox.body.setRectangle(32,32);
           
           lootBox.body.setCollisionGroup(lootBoxesCollisionGroup);
           lootBox.body.collides([body1CollisionGroup,body2CollisionGroup,body3CollisionGroup,body4CollisionGroup]);
           
       }
       lootBoxes.killAll();
        wallsCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        walls = game.add.group();
        walls.enableBody = true;
        walls.physicsBodyType = Phaser.Physics.P2JS;


        for(var x = 16; x < game.world.width; x+= 32)
        {
            if(x === 16 || x === (game.world.width - 32 +16))
            {
                for(var y = 16; y < game.world.height; y+= 32)
                {
                    var wallBlocks = walls.create(x,y, 'wallBlocks' );
                    wallBlocks.body.setRectangle(32,32);
                    wallBlocks.body.static = true;
                    wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                    wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);
                }
            }else
            {
                var wallBlocks = walls.create(x, 16, 'wallBlocks');
                wallBlocks.body.setRectangle(32,32);
                wallBlocks.body.static = true;
                wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);

                wallBlocks = walls.create(x, game.world.height - 32 +16, 'wallBlocks');
                wallBlocks.body.setRectangle(32,32);
                wallBlocks.body.static = true;
                wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);

                if(x >= 32 *10 + 16 && x < 32 * 15)
                {
                    wallBlocks = walls.create(x, 5 * 32 + 16, 'wallBlocks');
                    wallBlocks.body.setRectangle(32,32);
                    wallBlocks.body.static = true;
                    wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                    wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);

                    wallBlocks = walls.create(x, game.world.height - 6 * 32 + 16, 'wallBlocks');
                    wallBlocks.body.setRectangle(32,32);
                    wallBlocks.body.static = true;
                    wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                    wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);
                }

                

                if(x === 5 * 32 + 16 || x === game.world.width - 6 * 32 + 16)
                {
                    for(var y = 32 *10 + 16; y < 32* 15; y+= 32)
                    {
                        wallBlocks = walls.create(x, y, 'wallBlocks');
                        wallBlocks.body.setRectangle(32,32);
                        wallBlocks.body.static = true;
                        wallBlocks.body.setCollisionGroup(wallsCollisionGroup);
                        wallBlocks.body.collides([sword1CollisionGroup,body1CollisionGroup,sword2CollisionGroup,body2CollisionGroup,sword3CollisionGroup, body3CollisionGroup,sword4CollisionGroup,body4CollisionGroup]);
                    }
                }
            }

        }

        //player 1 body initialization
        
        pbody1 = game.add.sprite(64 + 16, 32*12 +16, 'Body');
        game.physics.p2.enable(pbody1,false);
        pbody1.body.setCircle(16);
        pbody1.frame = 0;
        pbody1.body.setCollisionGroup(body1CollisionGroup);
        //body 1 wall collision
        pbody1.body.collides(wallsCollisionGroup);
        //body 1 sword collision
        pbody1.body.collides([sword2CollisionGroup,sword3CollisionGroup,sword4CollisionGroup],player1Hit,this);
       
        pbody1.body.collides(lootBoxesCollisionGroup,collect1, this);

        //player 2 body initialization
        pbody2 = game.add.sprite(game.world.width - 98 + 16, 32* 12 + 16, 'Body');
        game.physics.p2.enable(pbody2,false);
        pbody2.body.setCircle(16);
        pbody2.frame = 1;
        pbody2.body.setCollisionGroup(body2CollisionGroup);
        pbody2.body.collides(wallsCollisionGroup);
        
        pbody2.body.collides([sword1CollisionGroup, sword3CollisionGroup, sword4CollisionGroup],player2Hit,this);
        pbody2.body.collides(lootBoxesCollisionGroup,collect2, this);

        //player 3 body initialization
        pbody3 = game.add.sprite(32 * 12 +16, 64 + 18, 'Body');
        game.physics.p2.enable(pbody3,false);
        pbody3.body.setCircle(16);
        pbody3.frame = 2;
        pbody3.body.setCollisionGroup(body3CollisionGroup);
        pbody3.body.collides(wallsCollisionGroup);
        
        pbody3.body.collides([sword1CollisionGroup, sword2CollisionGroup,sword4CollisionGroup],player3Hit,this);
        pbody3.body.collides(lootBoxesCollisionGroup,collect3, this);

        //player 4 body initialization
        pbody4 = game.add.sprite(32*12 + 16, game.world.height-98 + 16, 'Body');
        game.physics.p2.enable(pbody4,false);
        pbody4.body.setCircle(16);
        pbody4.frame = 3;
        pbody4.body.setCollisionGroup(body4CollisionGroup);
        pbody4.body.collides(wallsCollisionGroup);
        
        pbody4.body.collides([sword1CollisionGroup,sword2CollisionGroup,sword3CollisionGroup],player4Hit,this);
        pbody4.body.collides(lootBoxesCollisionGroup,collect4, this);

        //player 1 sword initialization
        player1 = game.add.sprite(64 + 18, 32 * 12 + 16, 'Swords'); 
        game.physics.p2.enable(player1,false);
        player1.anchor.setTo(0.5, 1);
        player1.body.setRectangle(player1.width ,player1.height, -player1.width/2+4, -player1.height/2, 0);
        player1.frame= 0;
        player1.body.damping=.8;
        player1.body.setCollisionGroup(sword1CollisionGroup);
        player1.body.collides(wallsCollisionGroup);
        
        player1.body.collides(sword2CollisionGroup);
        player1.body.collides(sword3CollisionGroup);
        player1.body.collides(sword4CollisionGroup);
       
        player1.body.collides(body2CollisionGroup);
        player1.body.collides(body3CollisionGroup);
        player1.body.collides(body4CollisionGroup);
        
        
        //player 2 sword initialization
        player2 = game.add.sprite(game.world.width - 98 + 16, 32 * 12 + 16, 'Swords' );
        game.physics.p2.enable(player2,false);
        player2.anchor.setTo(0.5, 1);
        player2.body.setRectangle(player2.width ,player2.height, -player2.width/2+4, -player2.height/2, 0);
        player2.frame= 1;
        player2.body.damping=.8;
        player2.angle +=180;
        player2.body.setCollisionGroup(sword2CollisionGroup);
        player2.body.collides(wallsCollisionGroup);
       
        player2.body.collides(sword1CollisionGroup);
        player2.body.collides(sword3CollisionGroup);
        player2.body.collides(sword4CollisionGroup);
       
        player2.body.collides(body1CollisionGroup);
        player2.body.collides(body3CollisionGroup);
        player2.body.collides(body4CollisionGroup);

        //player 3 sword initialization
        player3 = game.add.sprite(32*12 + 16, 64 + 18,  'Swords'); 
        game.physics.p2.enable(player3,false);
        player3.anchor.setTo(0.5, 1);
        player3.body.setRectangle(player3.width ,player3.height, -player3.width/2+4, -player3.height/2, 0);
        player3.frame= 2;
        player3.body.damping=.8;
        
        player3.body.setCollisionGroup(sword3CollisionGroup);
        player3.body.collides(wallsCollisionGroup);
        
        player3.body.collides(sword1CollisionGroup);
        player3.body.collides(sword2CollisionGroup);
        player3.body.collides(sword4CollisionGroup);
       
        player3.body.collides(body1CollisionGroup);
        player3.body.collides(body2CollisionGroup);
        player3.body.collides(body4CollisionGroup);

        //player 4 sword initialization
        player4 = game.add.sprite(32 *12 + 16, game.world.height - 98 + 16, 'Swords' );
        game.physics.p2.enable(player4,false);
        player4.anchor.setTo(0.5, 1);
        player4.body.setRectangle(player4.width ,player4.height, -player4.width/2+4, -player4.height/2, 0);
        player4.frame= 3;
        player4.body.damping=.8;
        
        player4.body.setCollisionGroup(sword4CollisionGroup);
        player4.body.collides(wallsCollisionGroup);
       
        player4.body.collides(sword1CollisionGroup);
        player4.body.collides(sword2CollisionGroup);
        player4.body.collides(sword3CollisionGroup);
       
        player4.body.collides(body1CollisionGroup);
        player4.body.collides(body2CollisionGroup);
        player4.body.collides(body3CollisionGroup);

        //player input
        p1Key = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        p2Key = game.input.keyboard.addKey(Phaser.Keyboard.F);
        p3Key = game.input.keyboard.addKey(Phaser.Keyboard.J);
        p4Key = game.input.keyboard.addKey(Phaser.Keyboard.P);

        player1Lives = 3;
        player2Lives = 3;
        player3Lives = 3;
        player4Lives = 3;
        liveCount = 4;

        deathEmitter1 = game.add.emitter(0,0, 100);
        deathEmitter1.makeParticles('Body',0, 100, true, true);
        deathEmitter1.gravity = 0;
        deathEmitter1.particleDrag.setTo(pDrag,pDrag);
        deathEmitter1.minParticleScale = 0.3;
        deathEmitter1.maxParticleScale = .9;
        deathEmitter1.setAlpha(.6,0, pLifetime,Phaser.Easing.Linear.InOut);

        emitter1 = game.add.emitter(0,0, 200);
        emitter1.makeParticles('Body', 0, 200, true, true);
        emitter1.gravity = 0;
        emitter1.setXSpeed(0,0);
        emitter1.setYSpeed(0,0);
        emitter1.setAlpha(.8,0, 200, Phaser.Easing.Linear.InOut);
        emitter1.start(false,200, 100);


        deathEmitter2 = game.add.emitter(0,0, 100);
        deathEmitter2.makeParticles('Body',1, 100, true, true);
        deathEmitter2.gravity = 0;
        deathEmitter2.particleDrag.setTo(pDrag,pDrag);
        deathEmitter2.minParticleScale = 0.3;
        deathEmitter2.maxParticleScale = .9;
        deathEmitter2.setAlpha(.6,0, pLifetime,Phaser.Easing.Linear.InOut);

        emitter2 = game.add.emitter(0,0, 200);
        emitter2.makeParticles('Body', 1, 200, true, true);
        emitter2.gravity = 0;
        emitter2.setXSpeed(0,0);
        emitter2.setYSpeed(0,0);
        emitter2.setAlpha(.8,0, 200, Phaser.Easing.Linear.InOut);
        emitter2.start(false, 200, 100);

        deathEmitter3 = game.add.emitter(0,0, 100);
        deathEmitter3.makeParticles('Body',2, 100, true, true);
        deathEmitter3.gravity = 0;
        deathEmitter3.particleDrag.setTo(pDrag,pDrag);
        deathEmitter3.minParticleScale = 0.3;
        deathEmitter3.maxParticleScale = .9;
        deathEmitter3.setAlpha(.6,0, pLifetime,Phaser.Easing.Linear.InOut);

        emitter3 = game.add.emitter(0,0, 200);
        emitter3.makeParticles('Body', 2, 200, true, true);
        emitter3.gravity = 0;
        emitter3.setXSpeed(0,0);
        emitter3.setYSpeed(0,0);
        emitter3.setAlpha(.8,0, 200, Phaser.Easing.Linear.InOut);
        emitter3.start(false,200, 100);

        deathEmitter4 = game.add.emitter(0,0, 100);
        deathEmitter4.makeParticles('Body',3, 100, true, true);
        deathEmitter4.gravity = 0;
        deathEmitter4.particleDrag.setTo(pDrag,pDrag);
        deathEmitter4.minParticleScale = 0.3;
        deathEmitter4.maxParticleScale = .9;
        deathEmitter4.setAlpha(.6,0, pLifetime,Phaser.Easing.Linear.InOut);

        emitter4 = game.add.emitter(0,0, 200);
        emitter4.makeParticles('Body', 3, 200, true, true);
        emitter4.gravity = 0;
        emitter4.setXSpeed(0,0);
        emitter4.setYSpeed(0,0);
        emitter4.setAlpha(.8,0, 200, Phaser.Easing.Linear.InOut);
        emitter4.start(false, 200, 100);


        lootBoxTimer = game.time.create(false);
        lootBoxTimer.loop(5000,spawnLootBox, this);
        lootBoxTimer.start();
    }

    function spawnLootBox()
    {
        var lootBox = lootBoxes.getFirstDead();
        if (lootBox === null || lootBox === undefined) return;

        lootBox.revive();

        
        var randomNumX = game.rnd.integerInRange(0,13);
        var randomNumY = game.rnd.integerInRange(0,13);

        lootBox.reset(16+32*5 +32 * randomNumX, 16+ 32 *5 + 32 * randomNumY);

        

    }

    function powerUp1()
    {
        var randInt = game.rnd.integerInRange(0,3);
        
        switch(randInt)
        {
            
            case 0: //superDash
                power1[0] = 1;
                break;
            case 1: // swords
                power1[1] +=1;
                break;
            case 2: // ball
                power1[2] += 2;
                break;
            case 3: // rotation control
                power1[3] = 1;
                break;

        }

    }

    function powerUp2()
    {
        var randInt = game.rnd.integerInRange(0,3);
        
        switch(randInt)
        {
            
            case 0: //superDash
                power2[0] = 1;
                break;
            case 1: // swords
                power2[1] +=1;
                break;
            case 2: // ball
                power2[2] += 2;
                break;
            case 3: // rotation control
                power2[3] = 1;
                break;

        }

    }

    function powerUp3()
    {
        var randInt = game.rnd.integerInRange(0,3);
        
        switch(randInt)
        {
            
            case 0: //superDash
                power3[0] = 1;
                break;
            case 1: // swords
                power3[1] +=1;
                break;
            case 2: // ball
                power3[2] += 2;
                break;
            case 3: // rotation control
                power3[3] = 1;
                break;

        }

    }

    function powerUp4()
    {
        var randInt = game.rnd.integerInRange(0,3);
        
        switch(randInt)
        {
            
            case 0: //superDash
                power4[0] = 1;
                break;
            case 1: // swords
                power4[1] +=1;
                break;
            case 2: // ball
                power4[2] += 2;
                break;
            case 3: // rotation control
                power4[3] = 1;
                break;

        }

    }


    function collect1(body1, body2)
    {
        body2.sprite.kill();
    }

    function collect2(body1,body2)
    {
        body2.sprite.kill();
    }
    
    function collect3(body1, body2)
    {
        body2.sprite.kill();
    }

    function collect4(body1, body2)
    {
        body2.sprite.kill();
    }

    function player1Hit(body1, body2)
    {

        power1 = [0,0,0,0];
        
        game.camera.shake(0.02, 200);
        deathEmitter1.x = pbody1.x;
        deathEmitter1.y = pbody1.y;
        deathEmitter1.start(true,pLifetime, null, 20);
        killPlayer1();
    }

    function player2Hit(body1, body2)
    {
        power2 = [0,0,0,0];
        game.camera.shake(0.02, 200);
        deathEmitter2.x = pbody2.x;
        deathEmitter2.y = pbody2.y;
        deathEmitter2.start(true,pLifetime, null, 20);
        killPlayer2();
    }

    function player3Hit(body1, body2)
    {
        power3 = [0,0,0,0];
        game.camera.shake(0.02, 200);
        deathEmitter3.x = pbody3.x;
        deathEmitter3.y = pbody3.y;
        deathEmitter3.start(true,pLifetime, null, 20);
        killPlayer3();
    }

    function player4Hit(body1, body2)
    {
        power4= [0,0,0,0];
        game.camera.shake(0.02, 200);
        deathEmitter4.x = pbody4.x;
        deathEmitter4.y = pbody4.y;
        deathEmitter4.start(true,pLifetime, null, 20);
        killPlayer4();
    }


   

    function resetGame()
    {
        lootBoxes.killAll();
        liveCount = 4;
        player1Lives = 3;
        player2Lives = 3;
        player3Lives = 3;
        player4Lives = 3;

        power1 = [0,0,0,0];
        power2 = [0,0,0,0];
        power3 = [0,0,0,0];
        power4 = [0,0,0,0];
    
       
        titleText.addColor('#ff004d', 0);
        titleText.addColor('#29adff', 2);
        titleText.addColor('#00e436', 4);
        titleText.addColor('#ffa300', 6);

        player1Text.setText("" + player1Lives);
        player1Text.addColor('#ff004d', 0);

        player2Text.setText("" + player2Lives);
        player2Text.addColor('#29adff', 0);

        player3Text.setText("" + player3Lives);
        player3Text.addColor('#00e436', 0);

        player4Text.setText("" + player4Lives);
        player4Text.addColor('#ffa300', 0);

        resetPlayer1();
        resetPlayer2();
        resetPlayer3();
        resetPlayer4();

    }

    function resetPlayer1()
    {
        player1.reset(64 + 18, 32 * 12 + 16);
        pbody1.reset(64 + 18, 32 *12 + 16);
        player1.body.setZeroRotation();
    }

    function resetPlayer2()
    {
        player2.reset(game.world.width - 98 + 16, 32 * 12 + 16);
        pbody2.reset(game.world.width - 98 + 16, 32 * 12 + 16);
        player2.body.setZeroRotation();
    }

    function resetPlayer3()
    {
        player3.reset(32*12 + 16, 64 + 18);
        pbody3.reset(32*12 + 16, 64 + 18);
        player3.body.setZeroRotation();

    }

    function resetPlayer4()
    {
        player4.reset(32 *12 + 16, game.world.height - 98 + 16);
        pbody4.reset(32 *12 + 16, game.world.height - 98 + 16);
        player4.body.setZeroRotation();
    }

    function killPlayer1()
    {
        
        
        player1Lives--;
        player1Text.setText("" + player1Lives);
        player1Text.addColor('#ff004d', 0);
        pbody1.kill();
        player1.kill();
        if (player1Lives > 0)
        {
            resetPlayer1();
        }else{
           
            liveCount--;
        }
        

        //if(player1Lives )

    }

    function killPlayer2()
    {
        player2Lives--;
        player2Text.setText("" + player2Lives);
        player2Text.addColor('#29adff', 0);
        pbody2.kill();
        player2.kill();
        if(player2Lives > 0)
        {
            resetPlayer2();
        }else
        {
            
            liveCount--;
        }
    }

    function killPlayer3()
    {
        player3Lives--;
        player3Text.setText("" + player3Lives);
        player3Text.addColor('#00e436', 0);
        pbody3.kill();
        player3.kill();
        if(player3Lives > 0)
        {
            resetPlayer3();
        }else
        {
            
            liveCount--;
        }
    }

    function killPlayer4()
    {
        player4Lives--;
        player4Text.setText("" + player4Lives);
        player4Text.addColor('#ffa300', 0);
        pbody4.kill();
        player4.kill();
        if(player4Lives > 0)
        {
            resetPlayer4();
        }else
        {
            
            liveCount--;
        }
    }



    function update() {
        
        if(liveCount <= 1)
        {
            if(player1Lives >0)
            {
                game.camera.flash(0xff004d, 500);
            } else if(player2Lives > 0)
            {
                game.camera.flash(0x29adff, 500);
            } else if(player3Lives > 0)
            {
                game.camera.flash(0x00e436, 500);
            } else if(player4Lives > 0)
            {
                game.camera.flash(0xffa300, 500);
            }


            resetGame();
        }
        


        if(pbody1.alive)
        {
            pbody1.body.reset(player1.x,player1.y);
        }
        if(pbody2.alive)
        {
            pbody2.body.reset(player2.x,player2.y);
        }
        if(pbody3.alive)
        {
            pbody3.body.reset(player3.x,player3.y);
        }
        if(pbody4.alive)
        {
            pbody4.body.reset(player4.x,player4.y);
        }


        if(player1.alive)
        {
            pbody1.bringToTop();
           
            if(p1Key.onDown && power1[3] === 1)
            {
                rotDirLeft *= -1;
            }
            
            if (p1Key.isDown)
            {
                player1.body.setZeroRotation();
                if(power1[0] === 1)
                {
                    player1.body.thrust(ACCELERATION*2);
                } else
                {
                    player1.body.thrust(ACCELERATION);
                }
                emitter1.x = pbody1.x;
                emitter1.y = pbody1.y;
                
                emitter1.on = true;

            }else
            {
                if(rotDirLeft === 1)
                {
                    player1.body.rotateLeft(ROTATION_SPEED);
                }else if(rotDirLeft === -1)
                {
                    player1.body.rotateRight(ROTATION_SPEED);
                }
                emitter1.on = false;
            }
           
        }else 
        {
            emitter1.on = false;
        }

        if(player2.alive)
        {
            pbody2.bringToTop();
            if(p2Key.onDown && power2[3] === 1)
            {
                rotDirLeft *= -1;
            }
            if(p2Key.isDown)
            {
                player2.body.setZeroRotation();
                if(power2[0] === 1)
                {
                    player2.body.thrust(ACCELERATION*2);
                }else
                {
                    player2.body.thrust(ACCELERATION);
                }
                emitter2.x = pbody2.x;
                emitter2.y = pbody2.y;
                emitter2.on = true;
            } else
            {
                if(rotDirLeft === 1)
                {
                    player2.body.rotateLeft(ROTATION_SPEED);
                }else if(rotDirLeft === -1)
                {
                    player2.body.rotateRight(ROTATION_SPEED);
                }
                emitter2.on = false;
            }
            
        }else
        {
            emitter2.on = false;
        }

        if(player3.alive)
        {
            pbody3.bringToTop();
            if(p3Key.onDown && power3[3] === 1)
            {
                rotDirLeft *= -1;
            }
            if(p3Key.isDown)
            {
                player3.body.setZeroRotation();
                if(power3[0] === 1)
                {
                    player3.body.thrust(ACCELERATION*2);
                }else
                {
                    player3.body.thrust(ACCELERATION);
                }
                emitter3.x = pbody3.x;
                emitter3.y = pbody3.y;
                emitter3.on = true;
            } else
            {
                if(rotDirLeft === 1)
                {
                    player3.body.rotateLeft(ROTATION_SPEED);
                }else if(rotDirLeft === -1)
                {
                    player3.body.rotateRight(ROTATION_SPEED);
                }
                
                emitter3.on = false;
            }
           
        }else
        {
            emitter3.on = false;
        }

        if(player4.alive)
        {
            pbody4.bringToTop();
            if(p4Key.onDown && power4[3] === 1)
            {
                rotDirLeft *= -1;
            }
            if(p4Key.isDown)
            {
                player4.body.setZeroRotation();
                if(power4[0] === 1)
                {
                    player4.body.thrust(ACCELERATION*2);
                }else
                {
                    player4.body.thrust(ACCELERATION);
                }
                emitter4.x = pbody4.x;
                emitter4.y = pbody4.y;
                emitter4.on = true;
            } else
            {
                if(rotDirLeft === 1)
                {
                    player4.body.rotateLeft(ROTATION_SPEED);
                }else if(rotDirLeft === -1)
                {
                    player4.body.rotateRight(ROTATION_SPEED);
                }
                
                emitter4.on = false;
            }
            
        }else
        {
            emitter4.on = false;
        }

       
    }






    
};
