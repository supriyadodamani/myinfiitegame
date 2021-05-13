var bg, bgImage, ground, groundImage;
var mario, marioImage, invisibleground, jumpSound, obstacle, obstacle1, obstacle2, obstacle3, obstacle4;
var gameState = "play";

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;

function preload() {
  bgImage = loadImage("bg.png");
  marioImage = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  marioJump = loadImage("mario00.png");
  jumpSound = loadSound("jump.mp3");
  groundImage = loadImage("ground2.png");

  obstacleImage = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  bricksImage = loadImage("brick.png");

  dieSound = loadSound("die.mp3");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  marioCollided = loadImage("collided.png");
  coinImage = loadImage("coin.jpg");
    checkPointSound=loadSound("checkPoint.mp3");


}

function setup() {
  createCanvas(600, 500);
  bg = createSprite(300, 300, 600, 600);
  bg.addImage("bg", bgImage);
  bg.scale = 2.2;

  mario = createSprite(100, 420, 20, 20);
  mario.addAnimation("mario", marioImage);
  mario.addAnimation("collided", marioCollided);
  mario.scale = 1.7;
  //mario.debug=true;
  mario.setCollider("rectangle", 0, 0, 20, mario.height);

  invisibleGround = createSprite(300, 450, 600, 2);
  invisibleGround.visible = false;

  ground = createSprite(300, 485, 600, 2);
  ground.addImage("ground", groundImage);
  ground.scale = 1;

  obstacleGroup = new Group();
  bricksGroup = new Group();

  gameOver = createSprite(300, 220, 30, 30);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(300, 250, 30, 30);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;

}

function draw() {
  background(220);

  // console.log(mario.y)
  if (gameState === PLAY) {
    bg.velocityX = -3;

    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }
    ground.velocityX = -3;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && mario.y > 416) {
      mario.velocityY = -12;
      jumpSound.play();

    }
    if (keyDown("left_arrow")) {
      mario.x = mario.x - 4;
    }
    if (keyDown("right_arrow")) {
      mario.x = mario.x + 4;
    }

    mario.velocityY = mario.velocityY + 0.4;


    spawnObstacles();
    spawnBricks();
    for (var i = 0; i < bricksGroup.length; i++) {
      if (mario.isTouching(bricksGroup.get(i))) {
        coin.velocityY = -2;
        coin.visible = true;
        bricksGroup.get(i).destroy();
        score++;
         if(score>0 && score%20===0)
      {
        checkPointSound.play();
      }
      }
    }

    if (mario.isTouching(obstacleGroup)) {
      gameState = END;
      dieSound.play();
      mario.velocityY = 0;

    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    bg.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    mario.changeAnimation("collided", marioCollided);
    bricksGroup.setVelocityXEach(0);
    // obstacleGroup.destroyEach();
    //bricksGroup.destroyEach();
    gameOver.visible = true;
    restart.visible = true;

    bricksGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  mario.collide(invisibleGround);
  drawSprites();



  fill("white");
  textSize(20);
  text("score :" + score, 450, 50);
}

function spawnObstacles() {
  if (frameCount % 130 === 0) {
    obstacle = createSprite(600, 430, 20, 20);
    obstacle.velocityX = -3;

    obstacle.addAnimation("obstcales", obstacleImage);

    obstacle.lifetime = 200;
    obstacle.depth = mario.depth;
    mario.depth++;

    obstacleGroup.add(obstacle);
    obstacle.setLifetime = 500;
  }
}

function spawnBricks() {
  if (frameCount % 60 === 0) {
    bricks = createSprite(600, 280, 20, 20);
    bricks.y = Math.round(random(250, 300));
    bricks.velocityX = -3;
    bricks.addImage(bricksImage);

    coin = createSprite(100, 250, 10, 10);
    // coin.x=bricks.x;
    coin.y = bricks.y;
    coin.addImage(coinImage);
    coin.scale = 0.081;
    coin.visible = false;
    coin.lifetime = 50;

    bricksGroup.add(bricks);
    bricks.setLifetime = 500;
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstacleGroup.destroyEach();
  bricksGroup.destroyEach();

  mario.changeAnimation("mario", marioImage);


  //console.log(localStorage["HighestScore"]);

  score = 0;

}