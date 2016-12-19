var p1correct = [];
var p2correct = [];
var p1incorrect =[];
var p2incorrect =[];
var p1skill;
var p2skill;
var numPlayers = 1;
var p1speed = 5;
var p2speed = 0;
var p1skill = "Addition";
var p2skill = "none";
var sound = true;

var loadGame = function(){
  $('#math-hunt').html('')

  game = new Phaser.Game(1000,910, Phaser.auto, 'math-hunt');
  game.state.add('boot', bootState);
  game.state.add('preload', preloadState);
  game.state.add('menu', menuState);
  game.state.add('main', mainState);

  game.state.start('boot');
}

function Duck(val, round) {
  this.xMove = 0;
  this.yMove = 0;
  this.speed = 1 * round * .5 ;

  this.sprite = game.add.sprite(Math.floor(Math.random()*800)+100, 650, val.toString())

  this.sprite.anchor.setTo( 0.5, 0.5 );
  this.init = function(){
    this.isActive = true;
    game.physics.arcade.enable(this);
    this.checkWorldsBounds = true;
    this.outOfBoundsKill = true;
    game.time.events.loop(Math.random()*1200+800, this.randomDirection, this );
  };

  this.randomDirection =  function(){
    if (this.speed<10){
    this.setXMove();
    this.setYMove();
    }
  };

  this.setXMove = function(){
    this.xMove = Math.random()<0.5 ? -1: 1;
    this.xMove *= Math.random() * this.speed;
  };
  this.setYMove = function(){
    if (this.y < 500){
      this.yMove = Math.random()<0.5 ? -1: 1;
      return this.yMove *= Math.random();
    } else {
      return this.yMove = Math.random();
    }
  };
  this.move = function(){
    this.sprite.x += this.xMove * this.speed;
    this.sprite.y -= this.yMove * this.speed;
  }.bind(this);
};

var bootState= {
  create: function(){
    //setup scaling
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.updateLayout(true);

    this.game.state.start('preload');
  }
}

var preloadState={
  preload: function(){
    //menu items
    game.load.image('directions','/images/math_hunt/menu_images/directions.png');
    game.load.image('info','/images/math_hunt/menu_images/info.png');
    game.load.image('p1info','/images/math_hunt/menu_images/p1info.png');
    game.load.image('p2info','/images/math_hunt/menu_images/p2info.png');
    game.load.image('ready','/images/math_hunt/menu_images/ready.png');
    game.load.image('start','/images/math_hunt/menu_images/start.png');
    game.load.image('choose','/images/math_hunt/menu_images/choose.png');
    game.load.image('shield','/images/math_hunt/menu_images/shield.png');
    game.load.image('title','/images/math_hunt/menu_images/title.png');
    game.load.image('options','/images/math_hunt/menu_images/options.png');
    game.load.image('back','/images/math_hunt/menu_images/back.png');

    //game over
    game.load.image('gameOver','/images/math_hunt/gameOver.png');
    game.load.image('playAgain','/images/math_hunt/playAgain.png');
    game.load.image('mainMenu','/images/math_hunt/mainMenu.png');

    //rounds
    game.load.spritesheet('rounds','/images/math_hunt/rounds.png',415,60,5);

    //operations
    game.load.spritesheet('minus','/images/math_hunt/menu_images/minus.png',79,80,4);
    game.load.spritesheet('division','/images/math_hunt/menu_images/division.png',79,80,4);
    game.load.spritesheet('times','/images/math_hunt/menu_images/times.png',79,80,4);
    game.load.spritesheet('plus','/images/math_hunt/menu_images/plus.png',79,80,4);

    game.load.spritesheet('demo', '/images/math_hunt/menu_images/flying_duck.png',204,198, 3);
    game.load.spritesheet('players', '/images/math_hunt/menu_images/players.png',683,85, 2);
    game.load.spritesheet('menu1', '/images/math_hunt/menu_images/menu1.png',38,64, 4);
    game.load.spritesheet('menu2', '/images/math_hunt/menu_images/menu2.png',51,64, 4);
    game.load.spritesheet('menu3', '/images/math_hunt/menu_images/menu3.png',51,64, 4);
    game.load.spritesheet('menu4', '/images/math_hunt/menu_images/menu4.png',51,64, 4);
    game.load.spritesheet('menu5', '/images/math_hunt/menu_images/menu5.png',50,64, 4);
    game.load.spritesheet('menu6', '/images/math_hunt/menu_images/menu6.png',51,64, 4);
    game.load.spritesheet('menu7', '/images/math_hunt/menu_images/menu7.png',50,64, 4);
    game.load.spritesheet('menu8', '/images/math_hunt/menu_images/menu8.png',51,64, 4);
    game.load.spritesheet('menu9', '/images/math_hunt/menu_images/menu9.png',51,64, 4);
    game.load.spritesheet('menu10', '/images/math_hunt/menu_images/menu10.png',102,64, 4);

    game.load.image('sound', '/images/math_hunt/menu_images/sound.png')
    game.load.spritesheet('onoff', '/images/math_hunt/menu_images/offOn.png',133,51, 2);

    //gameplay background
    game.load.image('stage', '/images/math_hunt/duck_background.png');

    //crosshairs
    game.load.image('inner1', '/images/math_hunt/p1_inner.png');
    game.load.image('inner2', '/images/math_hunt/p2_inner.png');
    game.load.image('p1', '/images/math_hunt/p1crosshairs.png');
    game.load.image('p2', '/images/math_hunt/p2crosshairs.png');
    game.load.image('shot', '/images/math_hunt/shotCrosshairs.png');
    game.load.image('redX', '/images/math_hunt/redX.png');

    //sounds
    game.load.audio('shotSound', '/sounds/math_hunt/shot.wav');
    game.load.audio('quacks', '/sounds/math_hunt/quacks.wav');
    game.load.audio('hit', '/sounds/math_hunt/hit.wav');
    game.load.audio('fall', '/sounds/math_hunt/fall.wav');
    game.load.audio('click', '/sounds/math_hunt/click.wav');
    game.load.audio('honk', '/sounds/math_hunt/honk.wav');

    //numbers
    for ( var i=0 ; i<=50 ; i++ ){game.load.image(i, '/images/math_hunt/numbers/'+i+'.png');}

    //score
    game.load.image('redScore', '/images/math_hunt/red_score.png');
    game.load.image('blueScore', '/images/math_hunt/blue_score.png');
    game.load.image('noScore', '/images/math_hunt/no_score.png');

    //dog
    game.load.spritesheet('dogShow', '/images/math_hunt/dog_show_sprites.png',280,240, 4);
    game.load.spritesheet('dogWalk', '/images/math_hunt/dog_walk_sprites.png',250,195, 5);
    game.load.spritesheet('dogJump', '/images/math_hunt/dog_jump_sprites.png',250,218, 3);

    //bullets
    game.load.image('bullet', '/images/math_hunt/bullet.png');
    //ducks
    game.load.image('dedDuck', '/images/math_hunt/blue_shot.png');
    game.load.image('downDuck', '/images/math_hunt/blue_down.png');

  },

  create: function() {
    this.game.state.start('menu');
  }
}

var menuState= {
  create: function(){
    this.menuStatus = "start";

    //menu locations
    this.pos1 = 450;
    this.pos2 = 550;
    this.pos3 = 650;
    this.pos4 = 750;
    this.pos5 = 800;
    this.pos6 = 950;

    game.stage.backgroundColor = '#FFFFFFF';
    this.title = game.add.sprite(68,50, 'title');

    this.demoDuck = game.add.sprite(790,25,'demo');
    this.demoDuck.bringToTop();
    this.demoDuck.frame = 2;
    this.demoDuck.animations.add ('flap', [0,1,2], 8, true);
    // this.demoDuck.animations.play('flap');

    //initial menu options
    this.players = game.add.sprite(90,this.pos1,'players');
    this.players.frame = 0;
    this.pShield = game.add.sprite(90,this.pos1+85, 'shield');

    this.directions = game.add.sprite(90, this.pos2, 'directions');
    this.dShield = game.add.sprite(90,this.pos2+85, 'shield');

    this.options = game.add.sprite(90, this.pos3, 'options');
    this.oShield = game.add.sprite(90,this.pos3+85, 'shield');

    this.start = game.add.sprite(90, this.pos4, 'start');
    this.sShield = game.add.sprite(90,this.pos4+85, 'shield');

    this.back = game.add.sprite(90, this.pos6, 'back');
    this.bShield = game.add.sprite(90,this.pos6, 'shield');

    //sub menu options
    this.info = game.add.sprite(90, this.pos2, 'info');

    this.p1info = game.add.sprite(game.world.centerX, this.pos3+20, 'p1info');
    this.p1info.anchor.setTo(.5, 0.25);

    this.p2info = game.add.sprite(game.world.centerX*1.5, this.pos3+20, 'p2info');
    this.p2info.anchor.setTo(.5, 0.25);
    this.p2info.alpha = 0;
    this.infoShield1 = game.add.sprite(90,this.pos2, 'shield');
    this.infoShield2 = game.add.sprite(90,this.p1info.y-43, 'shield');
    this.infoShield3 = game.add.sprite(90,this.p1info.y+42, 'shield');

    this.plus = game.add.sprite(game.world.centerX*.7,this.pos2, 'plus');
    this.minus = game.add.sprite(game.world.centerX*.9,this.pos2, 'minus');
    this.times = game.add.sprite(game.world.centerX*1.1,this.pos2, 'times');
    this.division = game.add.sprite(game.world.centerX*1.3,this.pos2, 'division');

    this.menu1 = game.add.sprite(game.world.centerX*.05,this.pos3, 'menu1');
    this.menu2 = game.add.sprite(game.world.centerX*.20,this.pos3, 'menu2');
    this.menu3 = game.add.sprite(game.world.centerX*.40,this.pos3, 'menu3');
    this.menu4 = game.add.sprite(game.world.centerX*.60,this.pos3, 'menu4');
    this.menu5 = game.add.sprite(game.world.centerX*.80,this.pos3, 'menu5');
    this.menu6 = game.add.sprite(game.world.centerX,this.pos3, 'menu6');
    this.menu7 = game.add.sprite(game.world.centerX*1.20,this.pos3, 'menu7');
    this.menu8 = game.add.sprite(game.world.centerX*1.40,this.pos3, 'menu8');
    this.menu9 = game.add.sprite(game.world.centerX*1.60,this.pos3, 'menu9');
    this.menu10 = game.add.sprite(game.world.centerX*1.75,this.pos3, 'menu10');

    this.sound = game.add.sprite(game.world.centerX*.75,this.pos4-10, 'sound');
    this.onoff = game.add.sprite(game.world.centerX*1.25,this.pos4-10, 'onoff');
    this.onoff.frame = 1;

    this.optionsShield1 = game.add.sprite(game.world.centerX-1000,this.pos2, 'shield');
    this.optionsShield1.height = 500;
    this.optionsShield2 = game.add.sprite(game.world.centerX,this.pos2, 'shield');
    this.optionsShield2.height = 500;

    this.p1 = game.add.sprite( 44, 493, 'p1');
    this.p1.anchor.setTo( 0.5, 0.5 );
    this.inner1 = game.add.sprite( 44, 493, 'inner1');
    this.inner1.anchor.setTo( 0.5, 0.5 );
    this.inner1.alpha = 0;
    game.physics.arcade.enable(this.p1);

    this.initialLayers()

    this.start.events.onInputDown.add(function(){game.state.start('main')}, this);
    this.p2 = game.add.sprite( 750, 493, 'p2');
    this.p2.anchor.setTo( 0.5, 0.5 );
    this.inner2 = game.add.sprite( 750, 493, 'inner2');
    this.inner2.anchor.setTo( 0.5, 0.5 );
    game.physics.arcade.enable(this.p2);
    this.p2.kill();
    this.inner2.alpha = 0;

    this.p1.canShoot = true;
    this.p2.canShoot = true;
    this.canStart = true;
    this.canBack  =false;

    //move input keys
    this.p1up    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.p1down  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.p1right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.p1left  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.p1shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.p2up    = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.p2down  = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.p2right = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.p2left  = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.p2shoot = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.setFrame();
  },

  update: function(){
    this.centerTarget();
    this.move();
    this.shoot();
  },
  setFrame: function(){
    this.menu1.frame =(p1speed === 1 && p2speed === 1)?2:(p1speed === 1)?3:(p2speed === 1)?1:0;
    this.menu2.frame =(p1speed === 2 && p2speed === 2)?2:(p1speed === 2)?3:(p2speed === 2)?1:0;
    this.menu3.frame =(p1speed === 3 && p2speed === 3)?2:(p1speed === 3)?3:(p2speed === 3)?1:0;
    this.menu4.frame =(p1speed === 4 && p2speed === 4)?2:(p1speed === 4)?3:(p2speed === 4)?1:0;
    this.menu5.frame =(p1speed === 5 && p2speed === 5)?2:(p1speed === 5)?3:(p2speed === 5)?1:0;
    this.menu6.frame =(p1speed === 6 && p2speed === 6)?2:(p1speed === 6)?3:(p2speed === 6)?1:0;
    this.menu7.frame =(p1speed === 7 && p2speed === 7)?2:(p1speed === 7)?3:(p2speed === 7)?1:0;
    this.menu8.frame =(p1speed === 8 && p2speed === 8)?2:(p1speed === 8)?3:(p2speed === 8)?1:0;
    this.menu9.frame =(p1speed === 9 && p2speed === 9)?2:(p1speed === 9)?3:(p2speed === 9)?1:0;
    this.menu10.frame =(p1speed === 10 && p2speed === 10)?2:(p1speed === 10)?3:(p2speed === 10)?1:0;

    this.plus.frame =(p1skill === "Addition" && p2skill === "Addition")?2:(p1skill === "Addition")?3:(p2skill === "Addition")?1:0;
    this.minus.frame =(p1skill === "Subtraction" && p2skill === "Subtraction")?2:(p1skill === "Subtraction")?3:(p2skill === "Subtraction")?1:0;
    this.times.frame =(p1skill === "Multiplication" && p2skill === "Multiplication")?2:(p1skill === "Multiplication")?3:(p2skill === "Multiplication")?1:0;
    this.division.frame =(p1skill === "Division" && p2skill === "Division")?2:(p1skill === "Division")?3:(p2skill === "Division")?1:0;
  },
  changePlayers: function(){
    if (p2skill === "none"){
        p2speed = 5;
        p2skill = "Addition"
        this.setFrame();
    }
    if (numPlayers === 2){
      this.p2.reset(825, 493, 'p2');
      this.p2.bringToTop();
    } else {
      p2speed = 0;
      p2skill = "none"
      this.setFrame();
      this.p2.kill();
    }
  },
  centerTarget: function(){
    this.inner1.x = this.p1.x;
    this.inner1.y = this.p1.y;
    this.inner2.x = this.p2.x;
    this.inner2.y = this.p2.y;
  },
  checkOverlap: function(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  },
  move: function(){
    if (this.p1up.isDown && this.inner1.y >= 0) { this.p1.y -= p1speed;}
    else if (this.p1down.isDown && this.inner1.y <= 850) { this.p1.y += p1speed;}
    if (this.p1right.isDown && this.inner1.x <= 1000) { this.p1.x += p1speed;}
    else if (this.p1left.isDown && this.inner1.x >= 0) { this.p1.x -= p1speed;}
    if (this.p2up.isDown && this.inner2.y >= 0) { this.p2.y -= 5;}
    else if (this.p2down.isDown && this.inner2.y <= 850) { this.p2.y += 5; }
    if (this.p2right.isDown && this.inner2.x <= 1000) { this.p2.x += 5;}
    else if (this.p2left.isDown && this.inner2.x >= 0) { this.p2.x -= 5;}
  },
  initialLayers: function(){
    //sub menu items
    this.info.bringToTop();
    this.p1info.bringToTop();
    this.p2info.bringToTop();
    this.infoShield1.bringToTop();
    this.infoShield2.bringToTop();
    this.infoShield3.bringToTop();

    this.optionsShield1.bringToTop();
    this.optionsShield2.bringToTop();
    //menu items
    this.pShield.bringToTop();
    this.directions.bringToTop();
    this.dShield.bringToTop();
    this.options.bringToTop();
    this.oShield.bringToTop();
    this.start.bringToTop();
    this.sShield.bringToTop();
    this.back.bringToTop();
    this.bShield.bringToTop();

    this.inner1.bringToTop();
    this.p1.bringToTop();
    if (numPlayers === 2){ this.p2.bringToTop(); }
  },

  directionsBreakDown: function(){
    this.p1info.bringToTop();
    this.p2info.bringToTop();
    this.infoShield2.bringToTop();
    this.infoShield3.bringToTop();
    this.back.bringToTop();
    this.bShield.bringToTop();
    this.p1.bringToTop();
    this.p2.bringToTop();

    var that=this;
    var horz = setInterval(function(){
        if (that.infoShield1.y < that.pos2){ that.infoShield1.y += 1.5}
        if (that.infoShield2.x < 90){ that.infoShield2.x += 1.5}
        if (that.infoShield3.x > 90){ that.infoShield3.x -= 1.5}
        if(that.infoShield1.y >= that.pos1 && that.infoShield2.x >= 90 && that.infoShield3.x <= 90 ) {
          clearInterval(horz);
          that.initialLayers();
          var lower  = setInterval(function(){
            if (that.directions.y < that.pos2){ that.directions.y+=1; }

            if (that.pShield.y < that.pos2+85){ that.pShield.y += 1; }
            if (that.oShield.y < that.pos4+85){ that.oShield.y += 1; }
            if (that.sShield.y < that.pos5+85){ that.sShield.y += 1; }

            if (that.back.y < that.pos6+85){ that.back.y += 1; }

            if (that.directions.y >= that.pos2 &&
                that.pShield.y >= that.pos2+85 &&
                that.oShield.y >= that.pos4+85 &&
                that.sShield.y >= that.pos5+85 &&
                that.back.y >= that.pos6+85 ){
              clearInterval(lower);
              that.canStart = true;
            }
        })
      }
    })
  },
  directionsSetUp: function(){
    var that=this;
    var raise  = setInterval(function(){
      if (that.directions.y > that.pos1){ that.directions.y-=1; }

      if (that.pShield.y > that.pos1){ that.pShield.y -= 1; }
      if (that.oShield.y > that.pos3){ that.oShield.y -= 1; }
      if (that.sShield.y > that.pos4){ that.sShield.y -= 1; }

      if (that.back.y > that.pos5){ that.back.y -= 1; }

      if (that.pShield.y <= that.pos1 && that.oShield.y <= that.pos3 && that.sShield.y <= that.pos4 && that.back.y <= that.pos5 ){
        clearInterval(raise);
        that.info.bringToTop();
        that.p1info.bringToTop();
        that.p2info.bringToTop();
        that.infoShield1.bringToTop();
        that.infoShield2.bringToTop();
        that.infoShield3.bringToTop();
        that.directions.bringToTop();
        that.back.bringToTop();
        that.bShield.bringToTop();
        that.p1.bringToTop();
        that.p2.bringToTop();

        var horz = setInterval(function(){
          if (that.infoShield1.y > that.pos1){ that.infoShield1.y -= 1.5}
          if (that.infoShield2.x > -1000){ that.infoShield2.x -= 1.5}
          if (that.infoShield3.x < 1100){ that.infoShield3.x += 1.5}
          if(that.infoShield1.y <= that.pos1 && that.infoShield2.x <= -1000 && that.infoShield3.x >= 1100 ) {
            that.canBack = true;
            clearInterval(horz);
          }
        })
      }
    })
  },
  optionsSetUp: function(){
    // this.menuStatus = "options";
    var that=this;
    var raise  = setInterval(function(){
      if (that.options.y > that.pos1){ that.options.y-=1; }

      if (that.pShield.y > that.pos1){ that.pShield.y -= 1; }
      if (that.dShield.y > that.pos2){ that.dShield.y -= 1; }
      if (that.sShield.y > that.pos4){ that.sShield.y -= 1; }

      if (that.back.y > that.pos5){ that.back.y -= 1; }

      if (that.options.y <= that.pos1 && that.pShield.y <= that.pos1 && that.dShield.y <= that.pos2 && that.sShield.y <= that.pos4 && that.back.y <= that.pos5 ){
        clearInterval(raise);
        that.plus.bringToTop();
        that.minus.bringToTop();
        that.times.bringToTop();
        that.division.bringToTop();

        that.menu1.bringToTop();
        that.menu2.bringToTop();
        that.menu3.bringToTop();
        that.menu4.bringToTop();
        that.menu5.bringToTop();
        that.menu6.bringToTop();
        that.menu7.bringToTop();
        that.menu8.bringToTop();
        that.menu9.bringToTop();
        that.menu10.bringToTop();
        that.sound.bringToTop();
        that.onoff.bringToTop();

        that.optionsShield1.bringToTop();
        that.optionsShield2.bringToTop();

        that.back.bringToTop();
        that.bShield.bringToTop();
        that.p1.bringToTop();
        that.p2.bringToTop();

        var horz = setInterval(function(){
          if (that.optionsShield1.x > -1500){ that.optionsShield1.x -= 1.5}
          if (that.optionsShield2.x < 1500){ that.optionsShield2.x += 1.5}
          if(that.optionsShield1.x <= -1500 && that.optionsShield2.x >= 1500 ) {
            that.canBack = true;
            clearInterval(horz);
          }
        })
      }
    })
  },

  optionsBreakDown: function(){
    this.back.bringToTop();
    this.bShield.bringToTop();
    this.p1.bringToTop();
    this.p2.bringToTop();

    var that=this;
    var horz = setInterval(function(){
      if (that.optionsShield1.x < -500){ that.optionsShield1.x += 1.5}
        if (that.optionsShield2.x > 500){ that.optionsShield2.x -= 1.5}
        if(that.optionsShield1.x >= -500 && that.optionsShield2.x <= 500 ) {
          clearInterval(horz);
          that.initialLayers();
          var raise  = setInterval(function(){
          if (that.options.y < that.pos3){ that.options.y+=1; }

          if (that.pShield.y < that.pos2+85){ that.pShield.y += 1; }
          if (that.dShield.y < that.pos3+85){ that.dShield.y += 1; }
          if (that.sShield.y < that.pos5+85){ that.sShield.y += 1; }

          if (that.back.y < that.pos6+85){ that.back.y += 1; }

          if (that.options.y>=that.pos3 &&
              that.pShield.y >= that.pos2+85 &&
              that.dShield.y >= that.pos3+85 &&
              that.sShield.y >= that.pos5+85 &&
              that.back.y <= that.pos6+85 ){
            clearInterval(raise);
            that.canStart = true;
          }
        })
      }
    })
  },
  shoot: function(){
    var p1shooting = false;
    var p2shooting = false;

    if(this.p1shoot.isDown && this.p1.canShoot){
      this.p1.canShoot = false;
      var that = this;
      setTimeout(function(){that.p1.canShoot = true}, 250)
      shot1 = game.add.sprite(this.p1.x, this.p1.y, 'shot');
      shot1.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot1.kill()},100);
      p1shooting = true;
    }
    if(this.p2shoot.isDown && this.p2.canShoot){
      this.p2.canShoot = false;
      var that = this;
      setTimeout(function(){that.p2.canShoot = true}, 250)
      shot1 = game.add.sprite(this.p2.x, this.p2.y, 'shot');
      shot1.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot1.kill()},100);
      p2shooting = true;
    }
    //start menu
    if (this.menuStatus === "start"){
      if (p1shooting && this.checkOverlap(this.inner1, this.players) ||
          p2shooting && this.checkOverlap(this.inner2, this.players)){
        if (numPlayers === 1){
          this.players.frame = 1;
          this.p1info.x = game.world.centerX *.5;
          this.p2info.alpha = 1;
          numPlayers = 2;
        }else{
          this.players.frame = 0;
          numPlayers = 1;
          this.p1info.x = game.world.centerX;
        }
        this.changePlayers();
      }
      else if (p1shooting && this.checkOverlap(this.inner1, this.directions)||
              (p2shooting && this.checkOverlap(this.inner2, this.players))){
        this.menuStatus = "directions";
        this.directionsSetUp();
      }
      else if (p1shooting && this.checkOverlap(this.inner1, this.options)||
              (p2shooting && this.checkOverlap(this.inner2, this.options))){
        this.menuStatus = "options";
        this.optionsSetUp();
      }
      else if (p1shooting && this.checkOverlap(this.inner1, this.start)||
              (p2shooting && this.checkOverlap(this.inner2, this.start))){
        if (this.canStart){ game.state.start('main'); }
      }
    } else if (this.menuStatus === "directions") {
      this.canStart = false;
      if (p1shooting && this.checkOverlap(this.inner1, this.back)||
         (p2shooting && this.checkOverlap(this.inner2, this.back))){
        if(this.canBack){
          this.canBack = false;
          this.menuStatus = "start";
          this.directionsBreakDown();
        }
      }
    } else if (this.menuStatus === "options"){
      this.canStart = false;
      if (p1shooting && this.checkOverlap(this.inner1, this.back)||
         (p2shooting && this.checkOverlap(this.inner2, this.back))){
        if(this.canBack){
          this.canBack = false;
          this.menuStatus = "start";
          this.optionsBreakDown();
        }
      }
      else if ((p1shooting && (this.checkOverlap(this.inner1, this.sound)||this.checkOverlap(this.inner1, this.onoff)))||(p2shooting && (this.checkOverlap(this.inner2, this.sound)||this.checkOverlap(this.inner2, this.onoff)))){
        if (sound) { sound = false; this.onoff.frame = 0; }
        else { sound = true;  this.onoff.frame = 1; }
      }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu1)){ p1speed = 1; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu1)){ p2speed = 1; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu2)){ p1speed = 2; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu2)){ p2speed = 2; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu3)){ p1speed = 3; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu3)){ p2speed = 3; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu4)){ p1speed = 4; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu4)){ p2speed = 4; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu5)){ p1speed = 5; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu5)){ p2speed = 5; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu6)){ p1speed = 6; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu6)){ p2speed = 6; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu7)){ p1speed = 7; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu7)){ p2speed = 7; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu8)){ p1speed = 8; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu8)){ p2speed = 8; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu9)){ p1speed = 9; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu9)){ p2speed = 9; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.menu10)){ p1speed = 10; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.menu10)){ p2speed = 10; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.plus)){ p1skill = "Addition"; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.plus)){ p2skill = "Addition"; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.minus)){ p1skill = "Subtraction"; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.minus)){ p2skill = "Subtraction"; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.times)){ p1skill = "Multiplication"; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.times)){ p2skill = "Multiplication"; }
      else if (p1shooting && this.checkOverlap(this.inner1, this.division)){ p1skill = "Division"; }
      else if (p2shooting && this.checkOverlap(this.inner2, this.division)){ p2skill = "Division"; }
      if (p1shooting || p2shooting){ this.setFrame(); }
    }
  }
}

var mainState= {
  create: function(){
    //crosshairs
    game.load.image('inner1', '/images/math_hunt/p1_inner.png');
    game.load.image('inner2', '/images/math_hunt/p2_inner.png');
    game.load.image('p1', '/images/math_hunt/p1crosshairs.png');
    game.load.image('p2', '/images/math_hunt/p2crosshairs.png');
    game.load.image('shot', '/images/math_hunt/shotCrosshairs.png');
    game.load.image('redX', '/images/math_hunt/redX.png');

    //sounds
    game.load.audio('shotSound', '/sounds/math_hunt/shot.wav');
    // game.load.audio('quacks', '/sounds/math_hunt/quacks.wav');
    game.load.audio('hit', '/sounds/math_hunt/hit.wav');
    game.load.audio('fall', '/sounds/math_hunt/fall.wav');
    game.load.audio('click', '/sounds/math_hunt/click.wav');
    game.load.audio('honk', '/sounds/math_hunt/honk.wav');

    //set stage
    game.stage.backgroundColor = '#40bdff';
    this.background = game.add.sprite( 0, 0, 'stage');

    //enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //initialize sounds
    this.shotSound = game.add.audio('shotSound');
    this.emptyGunSound = game.add.audio('click');
    this.quacks = game.add.audio('quacks');
    this.hit = game.add.audio('hit');
    this.fall = game.add.audio('fall');
    this.honk = game.add.audio('honk')

    //set up animations
    this.dogShow = game.add.sprite(500,775,'dogShow');
    this.dogShow.anchor.setTo(.5,.5);
    this.dogShow.sendToBack()
    this.dogShow.animations.add ('laugh', [0,1], 10, true);

    //set up ducks
    this.ducks = [];
    this.answers = [];

    //set up data
    this.playerOneCorrect = [];
    this.playerOneWrong = [];
    this.playerTwoCorrect = [];
    this.playerTwoWrong = [];

    //set players
    this.p1 = game.add.sprite( 250, 250, 'p1');
    this.p1.anchor.setTo( 0.5, 0.5 );
    this.inner1 = game.add.sprite( 250, 250, 'inner1');
    this.inner1.anchor.setTo( 0.5, 0.5 );
    this.inner1.alpha = 0;
    this.p1.canShoot = true;
    game.physics.arcade.enable(this.p1);

    this.p2 = game.add.sprite( 750, 250, 'p2');
    this.p2.anchor.setTo( 0.5, 0.5 );
    this.inner2 = game.add.sprite( 750, 250, 'inner2');
    this.inner2.anchor.setTo( 0.5, 0.5 );
    this.inner2.alpha = 0;
    this.p2.canShoot = true;
    game.physics.arcade.enable(this.p2);

    if (numPlayers !== 2){
      this.p2.kill();
      this.inner2.kill();
    }

    //initialize game
    this.p1Question = game.add.text(160,810,"", { font: '30px Arial', fill: '#ff5733' });
    this.p1Question.anchor.set(.5,0)
    this.p2Question = game.add.text(840,810,"", { font: '30px Arial', fill: '#4933ff' });
    this.p2Question.anchor.set(.5,0)

    //move input keys
    this.p1up    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.p1down  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.p1right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.p1left  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.p1shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.p2up    = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.p2down  = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.p2right = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.p2left  = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.p2shoot = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    //initialize scoring
    this.score1 = [];
    this.score2 = [];

    //initialize bullets
    this.reload();

    this.startGame();
  },
  startGame: function(){
    this.round = 0;
    this.dogWalk = game.add.sprite(-125,700,'dogWalk');
    this.dogWalk.anchor.setTo(.5,.5);
    this.dogWalk.animations.add ('walk', [0,4], 5, true);
    this.dogWalk.animations.play('walk');

    var that = this;
    var walk = setInterval(function(){
      if(that.dogWalk.x<300){that.dogWalk.x++;
      }else{
        clearInterval(walk);
        that.dogWalkAnimation();
      }
    },1)
  },
  update: function(){
    this.centerTarget();
    this.move();
    this.shoot();
  },

  checkOverlap: function(spriteA, spriteB) {
    if (spriteB){
      var boundsA = spriteA.getBounds();
      if (spriteB.sprite) { var boundsB = spriteB.sprite.getBounds(); }
      else { var boundsB = spriteB.getBounds(); }
      return Phaser.Rectangle.intersects(boundsA, boundsB);
    }
  },

  reload: function(){
    this.p1bullets = [1,1,1];
    this.p2bullets = [1,1,1];

    this.p1b1 = game.add.sprite( 100, 850, 'bullet');
    this.p1b2 = game.add.sprite( 150, 850, 'bullet');
    this.p1b3 = game.add.sprite( 200, 850, 'bullet');
    this.p2b1 = game.add.sprite( 775, 850, 'bullet');
    this.p2b2 = game.add.sprite( 825, 850, 'bullet');
    this.p2b3 = game.add.sprite( 875, 850, 'bullet');
    if (numPlayers !== 2){
      this.p2b1.kill();
      this.p2b2.kill();
      this.p2b3.kill();
    }
  },

  fireBullets: function(player){
    if ( player === 1 ){
      if(this.p1bullets.length === 3){
        this.p1b3.destroy();
        this.p1bullets.pop();
        return true;
      }else if(this.p1bullets.length === 2){
        this.p1b2.destroy();
        this.p1bullets.pop();
        return true;
      }else if (this.p1bullets.length === 1){
        this.p1b1.destroy();
        this.p1bullets.pop();
        return true;
      }else{
        this.emptyGunSound.play();
        return false;
      }
    }
    if ( player === 2 ){
        if(this.p2bullets.length === 3){
        this.p2b3.destroy();
        this.p2bullets.pop();
        return true;
      }else if(this.p2bullets.length === 2){
        this.p2b2.destroy();
        this.p2bullets.pop();
        return true;
      }else if (this.p2bullets.length === 1){
        this.p2b1.destroy();
        this.p2bullets.pop();
        return true;
      }else{
        this.emptyGunSound.play();
        return false;
      }
    }
  },

  // player movement
  move: function(){
    if (this.p1up.isDown && this.inner1.y >= 0) { this.p1.y -= p1speed;}
    else if (this.p1down.isDown && this.inner1.y <= 705) { this.p1.y += p1speed; }
    if (this.p1right.isDown && this.inner1.x <= 1000) { this.p1.x += p1speed;}
    else if (this.p1left.isDown && this.inner1.x >= 0) { this.p1.x -= p1speed;}

    if (this.p2up.isDown && this.inner2.y >= 0) { this.p2.y -= p2speed;}
    else if (this.p2down.isDown && this.inner2.y <= 705) { this.p2.y += p2speed; }
    if (this.p2right.isDown && this.inner2.x <= 1000) { this.p2.x += p2speed;}
    else if (this.p2left.isDown && this.inner2.x >= 0) { this.p2.x -= p2speed;}
  },

  shoot: function(){
    var that = this;
    if(this.p1.canShoot && this.p1shoot.isDown && this.checkOverlap(this.inner1, this.playAgain)){
      this.p1.canShoot = false;
      setTimeout(function(){that.p1.canShoot = true}, 1000)
      shot1 = game.add.sprite(this.p1.x, this.p1.y, 'shot');
      shot1.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot1.kill()},100);
      this.shotSound.play();

      this.goFrame.kill();
      this.mainMenu.kill();
      this.playAgain.kill();
      this.score1 = [];
      this.score2 = [];
      this.renderScore();
      this.startGame();
    }
    if(this.p1.canShoot && this.p2shoot.isDown && this.checkOverlap(this.inner2, this.playAgain)){
      this.p2.canShoot = false;
      // var that = this;
      setTimeout(function(){that.p2.canShoot = true}, 1000)
      shot2 = game.add.sprite(this.p2.x, this.p2.y, 'shot');
      shot2.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot2.kill()},100);
      this.shotSound.play();

      this.goFrame.kill();
      this.mainMenu.kill();
      this.playAgain.kill();
      this.score1 = [];
      this.score2 = [];
      this.renderScore();
      this.startGame();
    }
    if(this.p1shoot.isDown && this.checkOverlap(this.inner1, this.mainMenu)){
      this.p1.canShoot = false;
      // var that = this;
      setTimeout(function(){that.p1.canShoot = true}, 1000)
      shot1 = game.add.sprite(this.p1.x, this.p1.y, 'shot');
      shot1.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot1.kill()},100);
      this.shotSound.play();
      location.reload();
    }
    if(this.p2shoot.isDown && this.checkOverlap(this.inner2, this.mainMenu)){
      this.p2.canShoot = false;
      // var that = this;
      setTimeout(function(){that.p2.canShoot = true}, 1000)
      shot2 = game.add.sprite(this.p2.x, this.p2.y, 'shot');
      shot2.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot2.kill()},100);
      this.shotSound.play();
      this.game.state.start('menu');
    }

    if (this.p1shoot.isDown && this.p1.canShoot && this.fireBullets(1)){
      this.p1.canShoot = false;
      // var that = this;
      setTimeout(function(){that.p1.canShoot = true}, 1000)
      shot1 = game.add.sprite(this.p1.x, this.p1.y, 'shot');
      shot1.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot1.kill()},100);
      this.shotSound.play();
      if (this.ducks.length > 0){
        if (this.checkOverlap(this.inner1, this.ducks[0])){
          this.ducks[0].sprite.kill();
          p1correct.push(this.p1Question.text);
          this.hitBird1();
          // this.spawnDucks();
        } else if (this.checkOverlap(this.inner1, this.ducks[1])){
          x = game.add.sprite(this.p1.x, this.p1.y, 'redX');
          x.anchor.setTo( 0.5, 0.5);
          setTimeout(function(){x.kill()},100);
          this.honk.play()
          p1incorrect.push(this.p1Question.text)
        } else if (this.checkOverlap(this.inner1, this.ducks[2])){
          x = game.add.sprite(this.p1.x, this.p1.y, 'redX');
          x.anchor.setTo( 0.5, 0.5);
          setTimeout(function(){x.kill()},100);
          this.honk.play();
          p1incorrect.push(this.p1Question.text)
        }
      }
    }
    if (this.p2shoot.isDown && this.p2.canShoot && this.fireBullets(2)){
      this.p2.canShoot = false;
      // var that = this;
      setTimeout(function(){that.p2.canShoot = true}, 1000)
      shot2 = game.add.sprite(this.p2.x, this.p2.y, 'shot');
      shot2.anchor.setTo( 0.5, 0.5);
      setTimeout(function(){shot2.kill()},100);
      this.shotSound.play();

      if (this.ducks.length > 0){
        if (this.checkOverlap(this.inner2, this.ducks[0])){
          x = game.add.sprite(this.p2.x, this.p2.y, 'redX');
          x.anchor.setTo( 0.5, 0.5);
          setTimeout(function(){x.kill()},100);
          this.honk.play()
          p2incorrect.push(this.p2Question.text)
        } else if (this.checkOverlap(this.inner2, this.ducks[1])){
          this.ducks[1].sprite.kill();
          p2correct.push(this.p2Question.text)
          this.hitBird2(this.ducks[1])
        } else if (this.checkOverlap(this.inner2, this.ducks[2])){
          x = game.add.sprite(this.p2.x, this.p2.y, 'redX');
          x.anchor.setTo( 0.5, 0.5);
          setTimeout(function(){x.kill()},100);
          this.honk.play()
          p2incorrect.push(this.p2Question.text)
        }
      }
    }
  },

  hitBird1: function(duck){
    xCord = this.inner1.x;
    yCord = this.inner1.y;
    var dedDuck = game.add.sprite(xCord, yCord, 'dedDuck');
    dedDuck.anchor.setTo(.5,.5);
    this.hit.play();
    this.updateScore(1);
    var that = this;
    setTimeout(function(){
      dedDuck.kill();
      var downDuck = game.add.sprite(xCord, yCord, 'downDuck');
      downDuck.anchor.setTo(.5,.5);
      game.physics.arcade.enable(downDuck);
      downDuck.body.velocity.y = 200;
      that.fall.play();
      that.reorderSprites();
    },500);
  },

  hitBird2: function(duck){
    xCord = this.inner2.x;
    yCord = this.inner2.y;
    var dedDuck = game.add.sprite(xCord, yCord, 'dedDuck');
    dedDuck.anchor.setTo(.5,.5);
    this.hit.play();
    this.updateScore(2);
    var that = this;
    setTimeout(function(){
      dedDuck.kill();
      var downDuck = game.add.sprite(xCord, yCord, 'downDuck');
      downDuck.anchor.setTo(.5,.5);
      game.physics.arcade.enable(downDuck);
      downDuck.body.velocity.y = 200;
      that.fall.play();
      that.reorderSprites();
    },500);
  },

  updateScore: function(player){
    if (player === 1){
      this.score1.push(1);
    } else if (player === 2){
      this.score2.push(1)
    }
    this.renderScore();
  },

  renderScore: function(){
    for (var i=0 ; i < this.score1.length ; i++){
      if (this.score1[i] === 1){
        game.add.sprite(311+(i*30 + 10),830,'redScore');
      } else if (this.score1[i] === 0){
        game.add.sprite(312+(i*30 +10),830,'noScore');
      }
    }
    if (numPlayers === 2){
      for (var i=0 ; i < this.score2.length ; i++){
        if (this.score2[i] === 1){
          game.add.sprite(655-(i*30 + 10),830,'blueScore');
        } else if (this.score2[i] === 0){
          game.add.sprite(655-(i*30 + 10),830,'noScore');
        }
      }
    }
  },

  centerTarget: function(){
    this.inner1.x = this.p1.x;
    this.inner1.y = this.p1.y;
    this.inner2.x = this.p2.x;
    this.inner2.y = this.p2.y;
  },

  spawnDucks: function(){
    this.round++
    this.showRound(this.round);

    this.ducks = [];
    this.reload();
    this.quacks.play();
    this.spawnQuestions();
  },

  gameOver: function(){
    this.goFrame = game.add.sprite(game.world.centerX, game.world.centerY*0.3, 'gameOver');
    this.goFrame.anchor.setTo(.5,0);
    this.mainMenu = game.add.sprite(game.world.centerX, game.world.centerY*0.65, 'mainMenu');
    this.mainMenu.anchor.setTo(.5,.5);
    this.playAgain = game.add.sprite(game.world.centerX, game.world.centerY*0.75, 'playAgain');
    this.playAgain.anchor.setTo(.5,.5);
    this.p1.bringToTop();
    this.p2.bringToTop();
  },

  // duckAjaxCall(){

  //   this.formatQuestions()

  //   data = {
  //     player1correct: p1correct,
  //     player2correct: p2correct,
  //     player1wrong: p1incorrect,
  //     player2wrong: p2incorrect,
  //     game_id: 4
  //   }

  //   var request = $.ajax({
  //     url: '/results',
  //     type: 'post',
  //     data: data
  //   })

  //   request.done(function(response){
  //     setTimeout(function(){
  //     ($('#hidden_match_button')).css('margin-top', '40%')
  //     $('#math-hunt').css('background', '#40bdff').html($('#hidden_match_button'))
  //     $('#hidden_match_button').slideToggle(1000)
  //     }, 2000)
  //   })

  //   request.fail(function(response){
  //     console.log('failed')
  //   })
  // },

  // formatQuestions: function(){
  //   p1incorrect = p1incorrect.map(function(p){
  //       return mainState.parseEquation(p)
  //   })
  //    p2incorrect = p2incorrect.map(function(p){
  //       return mainState.parseEquation(p)
  //   })
  //     p1correct = p1correct.map(function(p){
  //       return mainState.parseEquation(p)
  //   })
  //     p2correct = p2correct.map(function(p){
  //       return mainState.parseEquation(p)
  //   })
  // },

  // parseEquation: function(equation){
  //     equation = equation.split(' ')
  //     if (equation[1] === '+'){
  //       return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) +parseInt(equation[2])))
  //     } else if (equation[1] === '-'){
  //       return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) - parseInt(equation[2])))
  //     } else if (equation[1] === '*') {
  //       return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) * parseInt(equation[2])))
  //     } else {
  //       return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) / parseInt(equation[2])))
  //     }
  // },

  showRound: function(round){
    var roundText = game.add.sprite(game.world.centerX, game.world.centerY, 'rounds');
    roundText.anchor.setTo(.5, .5);
    roundText.frame = round-1;
    setTimeout(function(){ roundText.kill()},1000);
    var that = this;
    setTimeout(function(){that.endRound() },10000);
  },

  endRound: function(){
    var hits = 2;

    if (this.score1.length < this.round){this.score1.push(0); hits--}
    if (this.score2.length < this.round){this.score2.push(0); hits--}

    for ( var i=0 ; i < this.ducks.length ; i++ )
    {
      this.ducks[i].speed = 10;
    }
    this.renderScore();
    this.callDog(hits);
  },

  oneDuck: function(val){
    this.duck = new Duck(val, this.round);
    this.duck.init();
    this.ducks.push(this.duck);
    game.time.events.loop(1, this.duck.move, this);
    this.reorderSprites();
  },

  reorderSprites: function(){
    this.background.bringToTop();
    this.p1b1.bringToTop();
    this.p1b2.bringToTop();
    this.p1b3.bringToTop();
    this.p2b1.bringToTop();
    this.p2b2.bringToTop();
    this.p2b3.bringToTop();
    this.p1.bringToTop();
    this.p2.bringToTop();
    this.p1Question.bringToTop();
    if (numPlayers===2){ this.p2Question.bringToTop(); }
    this.renderScore();
  },

  spawnQuestions: function(){
    var answer1 = 100;
    var answer2 = 100;
    var num1 = 100;
    var num2 = 100;
    var num3 = 100;
    var num4 = 100;

    while ( answer1 > 50 || answer2 > 50 || answer1 === answer2 ){
      num1= Math.floor(Math.random()*10);
      num2= Math.floor(Math.random()*10);
      num3= Math.floor(Math.random()*10);
      num4= Math.floor(Math.random()*10);

      switch(p1skill){
        case "Addition":
          answer1 = num1 + num2;
          this.p1Question.text = num1.toString() + " + " + num2.toString();
          break;
        case "Subtraction":
          answer1 = num1;
          this.p1Question.text = (num1+num2).toString() + " - " + num2.toString();
          break;
        case "Multiplication":
          answer1 = num1*num2;
          this.p1Question.text = num1.toString() + " * " + num2.toString();
          break;
        case "Division":
          answer1 = num1;
          this.p1Question.text = (num1*num2).toString() + " / " + num2.toString();
          break;
        case "All":
          var select = Math.random();
          if (select < .25){
            answer1 = num1 + num2;
            this.p1Question.text = num1.toString() + " + " + num2.toString();
          } else if (select < .5){
            answer1 = num1;
            this.p1Question.text = (num1+num2).toString() + " - " + num2.toString();
          } else if (select < .75){
            answer1 = num1*num2;
            this.p1Question.text = num1.toString() + " * " + num2.toString();
          } else{
            answer1 = num1;
            this.p1Question.text = (num1*num2).toString() + " / " + num2.toString();
          }
          break;

          default:
            answer1 = num1 + num2;
            this.p1Question.text = num1.toString() + " + " + num2.toString();
        }
        switch(p2skill){
        case "Addition":
          answer2 = num3 + num4;
          this.p2Question.text = num3.toString() + " + " + num4.toString();
          break;
        case "Subtraction":
          answer2 = num3;
          this.p2Question.text = (num3+num4).toString() + " - " + num4.toString();
          break;
        case "Multiplication":
          answer2 = num3*num4;
          this.p2Question.text = num3.toString() + " * " + num4.toString();
          break;
        case "Division":
          answer2 = num3;
          this.p2Question.text = (num3*num4).toString() + " / " + num4.toString();
          break;
        case "All":
          var select = Math.random();
          if (select < .25){
            answer2 = num3 + num4;
            this.p2Question.text = num3.toString() + " + " + num4.toString();
          } else if (select < .5){
            answer2 = num3;
            this.p2Question.text = (num3+num4).toString() + " - " + num4.toString();
          } else if (select < .75){
            answer2 = num3*num4;
            this.p2Question.text = num3.toString() + " * " + num4.toString();
          } else{
            answer2 = num3;
            this.p2Question.text = (num3*num4).toString() + " / " + num4.toString();
          }
          break;
        default:
          answer2 = num3 + num4;
          this.p2Question.text = num3.toString() + " + " + num4.toString();
        }

    }
    this.oneDuck(answer1);
    this.oneDuck(answer2);
    if (numPlayers !== 2) {this.p2Question = "";}

    var rand = Math.floor(Math.random()*20);
    while ( rand === answer1 || rand === answer2){
      rand = Math.floor(Math.random()*20);
    }
    this.oneDuck(rand);
    this.reorderSprites();
  },

  callDog: function(hits){
    if (this.round < 5){
      this.dogShowAnimation(hits);
    } else {
      this.gameOver();
    }
  },

  dogWalkAnimation: function(){
    this.dogJump = game.add.sprite(this.dogWalk.x,this.dogWalk.y-23,'dogJump');
    this.dogWalk.kill();
    this.dogJump.anchor.setTo(.5,.5);
    this.dogJump.frame = 0
    var that = this;
    setTimeout(function(){ that.dogJump.frame = 1; that.dogJumpAnimation(1) },500);
    setTimeout(function(){ that.dogJump.sendToBack(); that.dogJumpAnimation(-2) },1000);
    setTimeout(function(){ that.dogJump.frame = 2 },650);
    setTimeout(function(){ that.dogJump.kill(); that.spawnDucks();},1500);
  },

  dogJumpAnimation: function(up){
    var that = this;
    var jump = setInterval(function(){
      setTimeout(function(){ clearInterval(jump); },1500);
      that.dogJump.y -= 1.50*up
      that.dogJump.x += 0.5
    },1)
  },

  dogShowAnimation: function(hits){
    var that = this;
    this.dogShow.animations.stop(null, true);

    if (hits === 0){
      this.dogShow.animations.play('laugh');
    } else if (hits === 1){
      this.dogShow.frame = 2;
    } else {
      this.dogShow.frame = 3;
    }
    setTimeout(function(){ that.dogRaise() },750);
  },

  dogRaise: function(){
    var that = this;
    var  raise  = setInterval(function(){
      if (that.dogShow.y > 490){
        that.dogShow.y -= 1.5;
      }else{
        clearInterval(raise);
        setTimeout(function(){ that.dogLower() },750);
      }
    });
  },

  dogLower: function(){
    var that = this;
    lower  = setInterval(function(){
      if (that.dogShow.y < 750){
        that.dogShow.y += 1.5;
      }else{
        clearInterval(lower);
        setTimeout(function(){ that.spawnDucks() },500);
      }
    });
  }
};

loadGame()
