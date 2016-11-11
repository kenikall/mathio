var p1correct = [];
var p2correct = [];
var p1incorrect =[];
var p2incorrect =[];
var p1skill;
var p2skill;

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
    game.load.image('player1','/images/math_hunt/menu_images/player1.png');
    game.load.image('player2','/images/math_hunt/menu_images/player2.png');
    game.load.image('shield','/images/math_hunt/menu_images/shield.png');
    game.load.image('title','/images/math_hunt/menu_images/title.png');

    game.load.spritesheet('duck', '/images/math_hunt/menu_images/flying_duck.png',68,56, 3);
    game.load.spritesheet('menu1', '/images/math_hunt/menu_images/menu1.png',38,64, 4);
    game.load.spritesheet('menu2', '/images/math_hunt/menu_images/menu2.png',51,64, 4);
    game.load.spritesheet('menu3', '/images/math_hunt/menu_images/menu3.png',51,64, 4);
    game.load.spritesheet('menu4', '/images/math_hunt/menu_images/menu4.png',51,64, 4);
    game.load.spritesheet('menu5', '/images/math_hunt/menu_images/menu5.png',50,64, 4);
    game.load.spritesheet('menu6', '/images/math_hunt/menu_images/menu6.png',51,64, 4);
    game.load.spritesheet('menu7', '/images/math_hunt/menu_images/menu7.png',50,64, 4);
    game.load.spritesheet('menu8', '/images/math_hunt/menu_images/menu8.png',51,64, 4);
    game.load.spritesheet('menu9', '/images/math_hunt/menu_images/menu9.png',51,64, 4);
    game.load.spritesheet('menu10', '/images/math_hunt/menu_images/menu10.png',202,64, 4);

    //gameplay background
    game.load.image('stage', '/images/math_hunt/duck_background.png');
    //crosshairs
    game.load.image('inner1', '/images/math_hunt/p1_inner.png');
    game.load.image('inner2', '/images/math_hunt/p2_inner.png');
    game.load.image('p1', '/images/math_hunt/p1crosshairs.png');
    game.load.image('p2', '/images/math_hunt/p2crosshairs.png');
    game.load.image('shot', '/images/math_hunt/shotCrosshairs.png');
    game.load.image('redX', '/images/math_hunt/redX.png');

    //numbers
    for ( var i=0 ; i<=50 ; i++ ){game.load.image(i, '/images/math_hunt/'+i+'.png');}

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
    //sounds
    game.load.audio('shotSound', '/sounds/math_hunt/shot.wav');
    game.load.audio('quacks', '/sounds/math_hunt/quacks.wav');
    game.load.audio('hit', '/sounds/math_hunt/hit.wav');
    game.load.audio('fall', '/sounds/math_hunt/fall.wav');
    game.load.audio('click', '/sounds/math_hunt/click.wav');
    game.load.audio('honk', '/sounds/math_hunt/honk.wav');
  },

  create: function() {
    this.game.state.start('menu');
  }
}

var menuState= {
  create: function(){
    game.stage.backgroundColor = '#000000';
    this.title = game.add.sprite(500,500, 'title')
  }
}
var mainState= {
  preload: function(){


  },
  create: function(){
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
    this.dogWalk = game.add.sprite(-125,700,'dogWalk');
    this.dogWalk.anchor.setTo(.5,.5);
    this.dogWalk.animations.add ('walk', [0,4], 5, true);
    this.dogWalk.animations.play('walk');

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
    game.physics.arcade.enable(this.p1);

    this.p2 = game.add.sprite( 750, 250, 'p2');
    this.p2.anchor.setTo( 0.5, 0.5 );
    this.inner2 = game.add.sprite( 750, 250, 'inner2');
    this.inner2.anchor.setTo( 0.5, 0.5 );
    game.physics.arcade.enable(this.p2);

    //initialize game
    this.p1Question = game.add.text(160,810,"", { font: '30px Arial', fill: '#ff5733' });
    this.p1Question.anchor.set(.5,0)
    this.p2Question = game.add.text(840,810,"", { font: '30px Arial', fill: '#4933ff' });
    this.p2Question.anchor.set(.5,0)
    this.round = 0;

    this.p1.canShoot = true;
    this.p2.canShoot = true;

    //move input keys
    this.p1up    = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.p1down  = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.p1right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.p1left  = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.p1shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.p2up    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.p2down  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.p2right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.p2left  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.p2shoot = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    //initialize scoring
    this.score1 = [];
    this.score2 = [];

    //initialize bullets
    this.reload();

    //timers
    var that = this;
    walk = true;
    setInterval(function(){
      if(that.dogWalk.x<300){that.dogWalk.x++;
      }else if (walk){
        that.dogWalkAnimation();
        walk = false
      }
    },1)


  },
  update: function(){
    this.centerTarget();
    this.move();
    this.shoot();
  },

  checkOverlap: function(spriteA, duck) {
    if (duck){
      var boundsA = spriteA.getBounds();
      var boundsB = duck.sprite.getBounds();
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
    if (this.p1up.isDown && this.inner1.y >= 0) { this.p1.y -= 5;}
    else if (this.p1down.isDown && this.inner1.y <= 705) { this.p1.y += 5; }
    if (this.p1right.isDown && this.inner1.x <= 1000) { this.p1.x += 5;}
    else if (this.p1left.isDown && this.inner1.x >= 0) { this.p1.x -= 5;}

    if (this.p2up.isDown && this.inner2.y >= 0) { this.p2.y -= 5;}
    else if (this.p2down.isDown && this.inner2.y <= 705) { this.p2.y += 5; }
    if (this.p2right.isDown && this.inner2.x <= 1000) { this.p2.x += 5;}
    else if (this.p2left.isDown && this.inner2.x >= 0) { this.p2.x -= 5;}
  },

  shoot: function(){
    if (this.p1shoot.isDown && this.p1.canShoot && this.fireBullets(1)){
      this.p1.canShoot = false;
      var that = this;
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
      var that = this;
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
    this.answer1.text= ""
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
    this.answer2.text= ""
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

    for (var i=0 ; i < this.score2.length ; i++){
      if (this.score2[i] === 1){
        game.add.sprite(655-(i*30 + 10),830,'blueScore');
      } else if (this.score2[i] === 0){
        game.add.sprite(655-(i*30 + 10),830,'noScore');
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
    var text = game.add.text(game.world.centerX, game.world.centerY, "Game Over", { font: "64px Arial", fill: "#000000", align: "center" });
    text.anchor.setTo(.5,.5);
    this.duckAjaxCall()
  },

  duckAjaxCall(){

    this.formatQuestions()

    data = {
      player1correct: p1correct,
      player2correct: p2correct,
      player1wrong: p1incorrect,
      player2wrong: p2incorrect,
      game_id: 4
    }

    var request = $.ajax({
      url: '/results',
      type: 'post',
      data: data
    })

    request.done(function(response){
      setTimeout(function(){
      ($('#hidden_match_button')).css('margin-top', '40%')
      $('#math-hunt').css('background', '#40bdff').html($('#hidden_match_button'))
      $('#hidden_match_button').slideToggle(1000)
      }, 2000)
    })

    request.fail(function(response){
      console.log('failed')
    })
  },

    formatQuestions: function(){
    p1incorrect = p1incorrect.map(function(p){
        return mainState.parseEquation(p)
    })
     p2incorrect = p2incorrect.map(function(p){
        return mainState.parseEquation(p)
    })
      p1correct = p1correct.map(function(p){
        return mainState.parseEquation(p)
    })
      p2correct = p2correct.map(function(p){
        return mainState.parseEquation(p)
    })
  },

  parseEquation: function(equation){
      equation = equation.split(' ')
      if (equation[1] === '+'){
        return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) +parseInt(equation[2])))
      } else if (equation[1] === '-'){
        return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) - parseInt(equation[2])))
      } else if (equation[1] === '*') {
        return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) * parseInt(equation[2])))
      } else {
        return (equation[0] + ' ' + equation[1] + ' ' + equation[2] + ' = ' + (parseInt(equation[0]) / parseInt(equation[2])))
      }
  },

  showRound: function(round){
    var roundText = game.add.text(game.world.centerX, game.world.centerY, "Round "+ round.toString(), { font: "64px Arial", fill: "#000000", align: "center" });
    roundText.anchor.setTo(.5,.5);
    setTimeout(function(){ roundText.text = ""},1000);
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
    // this.answer1.bringToTop();
    // this.answer2.bringToTop();
    // this.answer3.bringToTop();
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
    this.p2Question.bringToTop();
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

    var rand = Math.floor(Math.random()*20);
    while ( rand === answer1 || rand === answer2){
      rand = Math.floor(Math.random()*20);
    }
    this.oneDuck(rand);
    this.reorderSprites();
  },

  callDog: function(hits){
    if (this.round <= 4){
      this.dogShowAnimation(hits);
    } else {
      this.gameOver();
    }
  },

  dogWalkAnimation: function(){
    this.dogJump = game.add.sprite(this.dogWalk.x,this.dogWalk.y-23,'dogJump');
    this.dogWalk.kill();
    this.dogJump.anchor.setTo(.5,.5);
    // this.dogJump.animations.add ('jump', [1,2], 100, false);
    this.dogJump.frame = 0
    var that = this;
    setTimeout(function(){ that.dogJump.frame = 1; that.dogJumpAnimation(1) },500);
    setTimeout(function(){ that.dogJump.sendToBack(); that.dogJumpAnimation(-2) },1000);
    setTimeout(function(){ that.dogJump.frame = 2 },650);
    setTimeout(function(){ that.dogJump.kill(); that.spawnDucks();},1500);
  },

  dogJumpAnimation: function(up){
    var that = this;
    setInterval(function(){
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
    var lower  = setInterval(function(){
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
