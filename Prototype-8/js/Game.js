"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    
    var map;
    var bgLayer;
    var wallsLayer;
    
    var uplefts;
    var uprights;
    var downlefts;
    var downrights;

    var reds;
    var whites;
    var ghosts;
    var spawns;
    var goals;
    var blacks;

    
    var outline;
    var player;
 
    var cursors
    var speed = 120;
 
    var stationary = true;
    var charge = 1;
    var trailEmitter;
    var projectiles;

    function restartGame()
    {

    }

    function snapOutlineToGrid(x,y) 
    {
       
       outline.x = 16 + (Math.floor(x/32) * 32);
       outline.y = 16 + (Math.floor(y/32) * 32); 

    }

    function fireProjectile(dir, x, y)
    {
        var projectile = projectiles.getFirstDead();
        if(projectile === null || projectile === undefined) return;

        projectile.revive();
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;
        projectile.reset(x,y);
        if(dir === "up")
        {   
            projectile.body.velocity.x = 0;
            projectile.body.velocity.y = -160;
            projectile.dir = "up";
        }else if(dir === "down")
        {
            projectile.body.velocity.x = 0;
            projectile.body.velocity.y = 160;
            projectile.dir = "down";
        }else if(dir === "left")
        {   
            projectile.body.velocity.x = -160;
            projectile.body.velocity.y = 0;
            projectile.dir = "left";
        }else if(dir === "right")
        {
            projectile.body.velocity.x = 160;
            projectile.body.velocity.y = 0;
            projectile.dir = "right";
        }
        
    }

    function moveOneSpace(dir, x,y )
    {
        if(dir === "up")
        {

        }else if(dir === "down")
        {

        }else if(dir === "left")
        {   

        }else if(dir === "right")
        {

        }
    }
    
    function destroyBody()
    {
        
        this.game.physics.arcade.overlap(outline, blacks, this.playerblacksCollisionS, null, this);

        this.playerblacksCollisionS = function(p, b)
        {
            g.kill()
        }

        this.game.physics.arcade.overlap(outline, whites, this.playerwhiteCollisionS, null, this);

        this.playerwhiteCollisionS = function(p, w)
        {
            g.kill();
            
        }
        
       
        this.game.physics.arcade.overlap(outline,spawns, this.playerspawnsCollisionS, null, this);

        this.playerspawnsCollisionS = function(p,g)
        {
            g.kill();
        }

    }
    

    return {
    
        create: function () {
           
            charge =1;
            
            //music = game.add.audio('gameMusic');
            //music.play();
            map = this.game.add.tilemap('testmap');
            map.addTilesetImage('walls1', 'Walls');
            
            bgLayer = map.createLayer('background');
            wallsLayer = map.createLayer('walls');
            map.setCollision(13,true,wallsLayer);

            //people
            reds = this.game.add.physicsGroup();
            map.createFromObjects('people', 'red', 'people', 4, true, false, reds);

           

            whites = this.game.add.physicsGroup();
            map.createFromObjects('people', 'white', 'people', 0, true, false, whites);

            whites.forEach(function(w){
                w.infected = false;
            });

            blacks = this.game.add.physicsGroup();
            map.createFromObjects('people', 'black', 'people', 2, true, false, blacks);

            blacks.forEach(function(b){
                b.infected = false;
            });

            ghosts = this.game.add.physicsGroup();
            map.createFromObjects('people', 'ghost', 'people', 10, true, false, ghosts);

            ghosts.forEach(function(g){
                g.infected = false;
            });

            spawns = this.game.add.physicsGroup();
            map.createFromObjects('people', 'spawn', 'people', 9, true, false, spawns);

            spawns.forEach(function(s){
                s.infected = false;
            });

            goals = this.game.add.physicsGroup();
            map.createFromObjects('people', 'goal', 'people', 6, true, false, goals);

            goals.forEach(function(g){
                g.infected = false;
            });

            //corners
            uplefts = this.game.add.physicsGroup();
            map.createFromObjects('corners', 'upleft', 'WallS', 5,true, false, uplefts);

            uplefts.forEach(function(ul){
                ul.body.immovable = true;
                ul.bounced = false;
            });

            uprights = this.game.add.physicsGroup();
            map.createFromObjects('corners', 'upright', 'WallS', 2,true, false, uprights);

            uprights.forEach(function(ur){
                ur.body.immovable = true;
                ur.bounced = false;
            });

            downlefts = this.game.add.physicsGroup();
            map.createFromObjects('corners', 'downleft', 'WallS', 4,true, false, downlefts);

            downlefts.forEach(function(dl){
                dl.body.immovable = true;
                dl.bounced = false;
            });

            downrights = this.game.add.physicsGroup();
            map.createFromObjects('corners', 'downright', 'WallS', 3,true, false, downrights);

            downrights.forEach(function(dr){
                dr.body.immovable = true;
                dr.bounced = false;
            });


            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
            player.frame = 0;
            stationary = true;
            outline = game.add.sprite(game.world.centerX, game.world.centerY, 'outline');
            outline.anchor.setTo(0.5, 0.5);
         
            
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.Arcade); 
            game.physics.arcade.enable(player, true);
            game.physics.arcade.enable(outline, true);
           
            
            projectiles = game.add.group();
            for(var i = 0; i < 200; i++)
            {
                var projectile = game.add.sprite(0,0, 'projectile');
                projectiles.add(projectile);
                projectile.anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(projectile);
                projectile.body.setCircle(4);
                projectile.dir = "none";
                
                projectile.kill();
            }
            
            outline.body.collideWorldBounds = true;
            
            
            player.body.setCircle(12);
            player.body.collideWorldBounds= true;
            player.body.velocity.setTo(0,0);
            player.dir = "none";
            cursors = game.input.keyboard.createCursorKeys();

            


            // particle trail
            trailEmitter = game.add.emitter(0,0, 500);
            trailEmitter.makeParticles('slime', 0, 500, true,true );
            trailEmitter.gravity = 0;
            trailEmitter.setXSpeed(0,0);
            trailEmitter.setYSpeed(0,0);
            //trailEmitter.setAlpha(1, 0, 300, Phaser.Easing.Linear.InOut);
            trailEmitter.setScale(1,0,1,0,300,Phaser.Easing.Linear.InOut);
            trailEmitter.start(false,300, 100);    
            

            
            

           
        },
    
        update: function () {
           
            if (this.game.physics.arcade.collide(player, wallsLayer))
            {
                game.state.restart();
            }
            
            //projectiles walls
            this.game.physics.arcade.collide(projectiles,wallsLayer, this.projwallsCollision, null, this);

            this.projwallsCollision = function(p,w)
            {
                p.kill();
            }

            this.game.physics.arcade.overlap(projectiles, uplefts, this.upleftsCollisionP, null, this);
                    
            this.upleftsCollisionP = function(p, upright)
            {
                if (p.dir === "down")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32);
                    p.y = 16 + (Math.floor(p.y/32) * 32) +32;
                    p.body.velocity.x = -speed;
                    p.body.velocity.y = 0;
                    p.dir = "left";
                }else if(p.dir === "right")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32) +32;
                    p.y = 16 + (Math.floor(p.y/32) * 32);
                    p.body.velocity.y = -speed;
                    p.body.velocity.x = 0;
                    p.dir = "up"; 
                }
            }

            this.game.physics.arcade.overlap(projectiles, uprights, this.uprightsCollisionP, null, this);
                    
            this.uprightsCollisionP = function(p, upright)
            {
                
                if (p.dir === "down")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32);
                    p.y = 16 + (Math.floor(p.y/32) * 32) + 32;
                    p.body.velocity.x = speed;
                    p.body.velocity.y = 0;
                    p.dir = "right";


                }else if(p.dir === "left")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32) - 32;
                    p.y = 16 + (Math.floor(p.y/32) * 32) ;
                    p.body.velocity.y = -speed;
                    p.body.velocity.x = 0;
                    p.dir = "up"; 
                }
            }

            this.game.physics.arcade.overlap(projectiles, downlefts, this.downleftsCollisionP, null, this);
            
            this.downleftsCollisionP = function(p, downleft)
            {
                
                if (p.dir === "up")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32);
                    p.y = 16 + (Math.floor(p.y/32) * 32) - 32;
                    p.body.velocity.x = -speed;
                    p.body.velocity.y = 0;
                    p.dir = "left";


                }else if(p.dir === "right")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32) +32;
                    p.y = 16 + (Math.floor(p.y/32) * 32);
                    p.body.velocity.y = speed;
                    p.body.velocity.x = 0;
                    p.dir = "down"; 
                }
            }

            this.game.physics.arcade.overlap(projectiles, downrights, this.downrightsCollisionP, null, this);
            
            this.downrightsCollisionP = function(p,downright)
            {
                
                if (p.dir === "up")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32);
                    p.y = 16 + (Math.floor(p.y/32) * 32) - 32;
                    p.body.velocity.x = speed;
                    p.body.velocity.y = 0;
                    p.dir = "right";


                }else if(p.dir === "left")
                {
                    //upleft.bounced = true;
                    p.x = 16 + (Math.floor(p.x/32) * 32) - 32;
                    p.y = 16 + (Math.floor(p.y/32) * 32);
                    p.body.velocity.y = speed;
                    p.body.velocity.x = 0;
                    p.dir = "down"; 
                }
            }

            this.game.physics.arcade.overlap(projectiles,whites, this.projwhitesCollision, null, this);

            this.projwhitesCollision = function(p,w)
            {
             p.kill();
             w.kill();   
            }

            this.game.physics.arcade.overlap(projectiles,reds, this.projredsCollision, null, this);

            this.projredsCollision = function(p,r)
            {
             p.kill();
             r.kill();   
            }

            this.game.physics.arcade.overlap(projectiles,blacks, this.projblacksCollision, null, this);

            this.projblacksCollision = function(p,b)
            {
             p.kill();
             b.kill();   
            }

            this.game.physics.arcade.overlap(projectiles,ghosts, this.projghostsCollision, null, this);

            this.projghostsCollision = function(p,g)
            {
                
                g.kill();   
            }

            this.game.physics.arcade.overlap(projectiles,goals, this.projgoalsCollision, null, this);

            this.projgoalsCollision = function(p,g)
            {
                p.kill();
                g.kill();
                game.state.restart();    
            }

            //player and person collisions
            
            

            player.bringToTop();
            
            if(player.alive)
            {
                if(stationary === true)
                {
                   
                    trailEmitter.on = false;
                    
                


                    if(cursors.right.isDown)
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.x = speed;
                        player.body.velocity.y = 0;
                        player.dir = "right";
                        player.alpha = 1;
                       
                        
                        stationary = false;        
                    }else if(cursors.up.isDown)
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.y = -speed;
                        player.body.velocity.x = 0;
                        player.dir = "up";
                        player.alpha = 1;
                       
                        
                        stationary = false;
                    }else if(cursors.left.isDown)
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.x = -speed;
                        player.body.velocity.y = 0;
                        player.dir = "left";
                        player.alpha =1;
                        
                        stationary = false;
                    }else if(cursors.down.isDown)
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.y = speed;
                        player.body.velocity.x = 0;
                        player.dir = "down"; 
                        player.alpha = 1;
                        
                        stationary = false;
                    }else
                    {
                        player.body.velocity.y = 0;
                        player.body.velocity.x = 0;
                    }
                    
                
                } else
                {
                    trailEmitter.x = player.x;
                    trailEmitter.y = player.y;
                    
                    trailEmitter.on = true;
                    



                    if(player.dir === "right" || player.dir === "left")
                    {
                        player.y = outline.y;
                    }else if(player.dir === "up" || player.dir === "down")
                    {
                        player.x = outline.x;
                    }

                    this.game.physics.arcade.overlap(outline, uplefts, this.upleftsCollision, null, this);
                    
                    this.upleftsCollision = function()
                    {
                        
                        if (player.dir === "down")
                        {
                            //upleft.bounced = true;
                            
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.x = -speed;
                            player.body.velocity.y = 0;
                            player.dir = "left";


                        }else if(player.dir === "right")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.y = -speed;
                            player.body.velocity.x = 0;
                            player.dir = "up"; 
                        }
                    }

                    this.game.physics.arcade.overlap(outline, uprights, this.uprightsCollision, null, this);
                    
                    this.uprightsCollision = function()
                    {
                        
                        if (player.dir === "down")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.x = speed;
                            player.body.velocity.y = 0;
                            player.dir = "right";


                        }else if(player.dir === "left")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.y = -speed;
                            player.body.velocity.x = 0;
                            player.dir = "up"; 
                        }
                    }

                    this.game.physics.arcade.overlap(outline, downlefts, this.downleftsCollision, null, this);
                    
                    this.downleftsCollision = function()
                    {
                        
                        if (player.dir === "up")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.x = -speed;
                            player.body.velocity.y = 0;
                            player.dir = "left";


                        }else if(player.dir === "right")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.y = speed;
                            player.body.velocity.x = 0;
                            player.dir = "down"; 
                        }
                    }

                    this.game.physics.arcade.overlap(outline, downrights, this.downrightsCollision, null, this);
                    
                    this.downrightsCollision = function()
                    {
                        
                        if (player.dir === "up")
                        {
                            //upleft.bounced = true;
                            
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.x = speed;
                            player.body.velocity.y = 0;
                            player.dir = "right";


                        }else if(player.dir === "left")
                        {
                            //upleft.bounced = true;
                            player.x = outline.x;
                            player.y = outline.y;
                            player.body.velocity.y = speed;
                            player.body.velocity.x = 0;
                            player.dir = "down"; 
                        }
                    }

                    

                    if(charge >= 1 && cursors.right.isDown && player.dir !== "right")
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.x = speed;
                        player.body.velocity.y = 0;
                        player.dir = "right";
                        fireProjectile("left",player.x,player.y);
                        charge--;
                    }else if(charge >= 1 && cursors.up.isDown && player.dir !== "up")
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.y = -speed;
                        player.body.velocity.x = 0;
                        player.dir = "up";
                        fireProjectile("down",player.x,player.y);
                        charge--;
                    }else if(charge >= 1 && cursors.left.isDown && player.dir !== "left")
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.x = -speed;
                        player.body.velocity.y = 0;
                        player.dir = "left";
                        fireProjectile("right",player.x,player.y);
                        charge--;
                    }else if(charge >= 1 && cursors.down.isDown && player.dir !== "down")
                    {
                        player.x = outline.x;
                        player.y = outline.y;
                        player.body.velocity.y = speed;
                        player.body.velocity.x = 0;
                        player.dir = "down"; 
                        fireProjectile("up",player.x,player.y);
                        charge--;
                    }



                }
                this.game.physics.arcade.overlap(outline, reds,this.playerredsCollisionM, null, this);

                    this.playerredsCollisionM = function(p, r)
                    {
                        if(stationary === false)
                        {
                            game.state.restart();
                        }    
                    }

                    this.game.physics.arcade.overlap(outline, blacks, this.playerblacksCollisionM, null, this);

                    this.playerblacksCollisionM = function(p, b)
                    {   
                            if(stationary === false && b.frame !== 3)
                            {
                                player.x = p.x;
                                player.y = p.y;
                                b.frame = 3;
                                charge = 1;
                                trailEmitter.on = false;
                                player.alpha = 0;
                                stationary = true;
                            }

                        
                    }

                    this.game.physics.arcade.overlap(outline, whites, this.playerwhiteCollisionM, null, this);

                    this.playerwhiteCollisionM = function(p, w)
                    {
                            if(stationary === false && w.frame !== 1)
                            {
                                player.x = p.x;
                                player.y = p.y;
                                w.frame = 1;
                                charge = 1;
                                trailEmitter.on = false;
                                player.alpha = 0;
                                stationary = true;
                            }

                       
                        
                    }
                    
                    this.game.physics.arcade.overlap(outline, ghosts, this.playerghostCollisionM, null, this);

                    this.playerghostCollisionM = function(p, g)
                    {
                        player.x = p.x;
                        player.y = p.y;
                        charge = 1;
                        g.kill();
                    }

                    this.game.physics.arcade.overlap(outline,spawns, this.playerspawnsCollisionM, null, this);

                    this.playerspawnsCollisionM = function(p,s)
                    {
                            if(stationary === false && s.frame !== 8)
                            {
                                player.x = p.x;
                                player.y = p.y;
                                s.frame = 8;
                                trailEmitter.on = false;
                                player.alpha = 0;
                                charge = 1;
                                stationary = true;
                            }else if(stationary === false && s.frame ===8)
                            {
                                s.kill();
                            }
                        

                    }

                    this.game.physics.arcade.overlap(outline, goals, this.playerGoalsCollisionM, null, this );

                    this.playerGoalsCollisionM = function(p,g)
                    {
                        player.x = p.x;
                        player.y = p.y;
                        g.frame = 8;
                        trailEmitter.on = false;
                        player.alpha = 0;
                        charge = 1;
                        stationary = true;
                    }

            
                snapOutlineToGrid(player.x, player.y);
            }
            
            
            
            
        }
    };
};
