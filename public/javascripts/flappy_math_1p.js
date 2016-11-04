var p1correct = [];
var p1incorrect =[];
var p1skill;

var mainState= {
  preload: function(){
    game.load.audio('jump', '/sounds/flappy_math/jump.wav');
    game.load.audio('clang', '/sounds/flappy_math/clang.wav');
    game.load.audio('hit', '/sounds/flappy_math/panHit.wav');
    game.load.audio('coin', '/sounds/flappy_math/coin1.wav');
    game.load.audio('coin2', '/sounds/flappy_math/coin2.wav');

    for ( var i=0 ; i<=50 ; i++ ){
      game.load.image(i, '/images/math_hunt/'+i+'.png');
      game.load.image('g'+i, '/images/math_hunt/g'+i+'.png');
    }
    game.load.image('redX', '/images/math_hunt/redX.png');

    game.load.image('bird', '/images/flappy_math/bird.png');
    game.load.image('pipe', '/images/flappy_math/pipe.png');
    game.load.image('cloud', '/images/flappy_math/cloud.png');
  },
  create: function(){
    this.problem1 = game.add.text(20,60, "", { font: '30px Arial', fill: '#ffffff#' });

    this.jumpSound = game.add.audio('jump');
    this.clang = game.add.audio('clang');
    this.hit = game.add.audio('hit');
    this.coin = game.add.audio('coin');
    this.coin2 = game.add.audio('coin2');

    this.p1score = 0;
    this.gameOver = false;

    this.player1score = game.add.text(20,20,"Score: "+this.p1score, { font: '30px Arial', fill: '#ff5733' });

    this.pipes = game.add.group();
    this.correct1 = game.add.group();
    this.inCorrect1 = game.add.group();

    game.stage.backgroundColor = '#37edf8';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.speed = 0;

    this.bird = game.add.sprite(100, 245, 'bird');
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.bird.canScore = true;

    // this.interval = 4500;
    this.timer = game.time.events.loop(3000, this.addRowOfPipes, this);
    // setTimeout(function(){this.addRowOfPipes}, 3000;
    // game.add.text(20,20,"Player 1: "+this.p1score, { font: '30px Arial', fill: '#ff5733' });

    // var that = this;
    // setInterval(function(){that.addRowOfPipes; console.log(that.interval)},this.interval);
    this.timer = game.time.events.loop(3000, this.spawnCloud, this);

    this.timer = game.add.text(800,20, this.time, { font: "64px Arial", fill: "#ffffff", align: "center" });

    game.time.events.loop(1, this.updateCounter, this);

    this.time = 3000;

    this.bird.anchor.setTo(-0.2, 0.5);
  },

  update: function(){
    if (this.bird.angle < 20){
       this.bird.angle += 1;
    }

    if (this.bird.y < 0 || this.bird.y > 910){
      // this.bird.alive = false;
      this.takeDamage(1)
    }

    //score on correct answer

      // game.physics.arcade.overlap(this.bird, this.correct1, console.log("correct"), null,this);
      game.physics.arcade.overlap(this.bird, this.correct1, this.p1Score, null,this);
      game.physics.arcade.overlap(this.bird, this.inCorrect1, this.p1noScore, null,this);
      game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe1, null, this);
  },

  updateCounter: function() {
    this.time--;
    this.speed++;
    this.timer.setText(this.time);
    if (this.time <= 0){
      this.endGame()
    }
  },

  endGame: function(){
    gotext = game.add.text(game.world.centerX, game.world.centerY, "", { font: "64px Arial", fill: "#ffffff", align: "center" });
    gotext.anchor.setTo(0.5, 0.5);
      gotext.text = "Good Game!"
    this.bird.destroy()
    this.time = 1

    if (!this.gameOver){
      this.flappyAjaxCall()
      this.gameOver = true;
    }
  },

  flappyAjaxCall: function(){

    player1wrong = $(p1incorrect).not(p1correct).get()

    this.formatQuestions()

    data = {
      player1correct: p1correct,
      player1wrong: player1wrong,
      game_id: 2
    }

    var request = $.ajax({
      url: '/results',
      type: 'post',
      data: data
    })

    request.done(function(response){
      console.log('success')
      setTimeout(function(){
      ($('#hidden_match_button')).css('margin-top', '40%')
        $('#flappy-bird').css('background', '#37edf8').html($('#hidden_match_button'))
        $('#hidden_match_button').slideToggle(1000)
      }, 2000)
    })

    request.fail(function(response){
      console.log('failed')
    })
  },

  formatQuestions: function(){
    player1wrong = player1wrong.map(function(p){
        return mainState.parseEquation(p)
    })
    p1correct = p1correct.map(function(p){
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

  hitPipe1: function(){
      if (this.bird.alive === false){
        return;
      }
      this.clang.play();
      this.takeDamage(1);
  },

  takeDamage: function(player){
    if (player === 1 && this.bird.alive){
      that = this;
      this.bird.alpha = 0.5;
      this.bird.alive = false;

      setTimeout(function(){
        that.bird.y = 500;
        that.bird.body.velocity.y = -350;
        that.bird.alive = true;
        that.bird.alpha = 1;
      }, 2000);
    }
  },

  jump: function(){
    if (this.bird.alive === false){
      return;
    }
    var animation = game.add.tween(this.bird);
    animation.to({angle: -20}, 100);
    animation.start();
    this.jumpSound.play();
    this.bird.body.velocity.y = -350;
  },

  spawnCloud:function(){
    var cloud = game.add.sprite(1000,Math.floor(Math.random()*900), 'cloud');
    var multiplier = Math.floor(Math.random()*3)
    cloud.height *= multiplier;
    cloud.width *= multiplier;
    game.physics.arcade.enable(cloud);
    cloud.body.velocity.x = Math.floor(Math.random()*50)-75;
  },

  p1Score: function(){
    if ( this.bird.canScore ){
      this.time += 250;
      var answer = game.add.sprite(arguments[1].x-2,arguments[1].y, 'g'+arguments[1].key);
      answer.sendToBack();
      game.physics.arcade.enable(answer);
      answer.body.velocity.x = -200;
      arguments[1].kill();

      this.coin.play();
      this.bird.canScore = false;
      this.p1score  += 1;
      this.player1score.text = "Player 1: "+this.p1score;
      var that = this;
      setTimeout(function(){that.bird.canScore = true}, 1000);
      p1correct.push(this.problem1.text);
    }
  },

  p1noScore: function(){
    var wrongAnswer = game.add.sprite(arguments[1].x-12,arguments[1].y-8, 'redX');
      game.physics.arcade.enable(wrongAnswer);
      wrongAnswer.body.velocity.x = -200;
  },

  spawnQuestion1: function (){
    if (!this.gameOver){
      param1 = Math.floor(Math.random()*10);
      param2 = Math.floor(Math.random()*10);


      switch(p1skill){
        case "Addition":
          this.problem1.text = param1.toString() + " + " + param2.toString()
          return (param1 + param2);
          break;

        case "Subtraction":
          param2 = param1 + Math.floor(Math.random()*10);
          this.problem1.text = param2.toString() + " - " + param1.toString()
          return (param2 - param1);
          break;

        case "Multiplication":
          this.problem1.text = param1.toString() + " * " + param2.toString()
          return (param1 * param2);
          break;

        case "Division":
          this.problem1.text = (param1*param2).toString() + " / " + param2.toString()
          return (param1);
          break;

        case "All":
        var select = Math.random();
        if (select < .25){
          this.problem1.text = param1.toString() + " + " + param2.toString()
          return (param1 + param2);

        } else if (select < .5) {
          param2 = param1 + Math.floor(Math.random()*10);
          this.problem1.text = param2.toString() + " - " + param1.toString()
          return (param2 - param1);

        } else if (select < .75) {
          this.problem1.text = param1.toString() + " * " + param2.toString()
          return (param1 * param2);

        } else {
          this.problem1.text = (param1*param2).toString() + " / " + param2.toString()
          return (param1);
        }
        break;

        default:
          this.problem1.text = param1.toString() + " + " + param2.toString()
          return (param1 + param2);
        }
      }
  },

  addOnePipe: function (x,y){
      var pipe = game.add.sprite(x,y, 'pipe');
      this.pipes.add(pipe);

      game.physics.arcade.enable(pipe);
      pipe.body.velocity.x = -200;

      pipe.checkWorldsBounds = true;
      pipe.outOfBoundsKill = true;
    },

  spawnAnswer: function (x, y, num, correct){
      var answer = game.add.sprite(x,y, num);
      answer.sendToBack();
      game.physics.arcade.enable(answer);
      answer.body.velocity.x = -200;

      if (correct){
        this.correct1.add(answer);
      } else {
        this.inCorrect1.add(answer);
      }
  },

  currentConfig: function(){
    var configs = [[1,0,2,0,1,1,0,2,0,1,1,0,2,0,1],
      [0,2,1,1,1,0,2,0,2,0,1,1,1,2,0],
      [2,0,0,0,2,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,2,0,0,0,2],
      [0,2,0,1,1,1,1,2,1,1,1,1,0,2,0],
      [1,1,0,2,0,1,1,1,1,1,0,2,0,1,1]];

    return configs[Math.floor(Math.random()*configs.length)];
  },

  addRowOfPipes: function() {
    this.interval -= 10;
    a1 = this.spawnQuestion1();

    p1incorrect.push(this.problem1.text)

    var config = this.currentConfig();

    var count = 0;
    for(var i = 0; i < config.length; i++){
      if(config[i] == 2) count++;
    }

    var loc1 =  Math.floor(Math.random()*count)
    var answers = [];

    for (var i=0 ; i < count ; i++){
      if (i === loc1){
        answers.push(a1)
      } else {
        answers.push(Math.floor(Math.random()*30));
      }
    }

    for (var i=0 ; i<config.length ; i++){
      if (config[i] === 1){
        this.addOnePipe(1000, i * 60 + 10);
      }
      else if(config[i] !== 0){
        config[i] = answers.pop()
        this.spawnAnswer(1000, i*60+15, config[i], config[i]===a1 );
      }
    }
    var that = this;
    setTimeout(function(){that.addRowOfPipes},this.interval)
  }
};

$(document).ready(function(){
  flappyMode1Listener()
  flappyMode2Listener()
  flappyButtonClick()
})

var flappyMode1Listener = function(){
  $('#flappy-mode-1').on('change', function(){
    p1skill = $('#flappy-mode-1 option:selected').text()
    $('#flappy-mode-1 :first-child').attr('disabled', 'disabled')
  })
}

var flappyMode2Listener = function(){
  $('#flappy-mode-2').on('change', function(){
    p2skill = $('#flappy-mode-2 option:selected').text()
    $('#flappy-mode-2 :first-child').attr('disabled', 'disabled')
  })
}

var flappyButtonClick = function(){
  $('#flappy-button').on('click', function(){
    $(this).remove()
    load3()
  })
}


var loadGame = function(){
  $('#flappy-bird').html('')
  game = new Phaser.Game(1000,910, Phaser.AUTO, 'flappy-bird');
  game.state.add('main', mainState);
  game.state.start('main');
}

loadGame();

