var sketchProc = function(processingInstance) {
    with (processingInstance) {
       size(400, 400); 
       frameRate(60);

class Keyboard {
constructor () {
    this.pressed = {};
}
watch (el) {
    el.addEventListener('keydown', (e) => {
    console.log(e.key);
    this.pressed[e.key] = true;
    });
    el.addEventListener('keyup', (e) => {
    this.pressed[e.key] = false;
    });
}
} 

let kb = new Keyboard();
kb.watch(app.view);

var mouseIsPressed;
mousePressed = function(code) {
   mouseIsPressed = code;
   console.log(code);
}

mouseReleased = function(code) {
    mouseIsPressed = code;
    console.log(code);
 }

var keyIsPressed;
keyPressed = function(code) {
   keyIsPressed = code;
   console.log(code);
   lastKey = key.code;
}

keyReleased = function(code) {
    keyIsPressed = code;
    console.log(code);
    lastKey = key.code;
 }

// MENU ///////////////////////////////////////////////////////////////////////////////////

var scenario = "menu";
var lives = 3;
var loseLife = true;
var scores = [0];

//text
var title = { x: 100, y: 200, txt: "Breakout" };
var gameover = { x: 75, y: 0, txt: "Game Over" };
var youwin = { x: 100, y: 0, txt: "You Win" };
var score = { x: 66, y: 23, txt: 0 };

function drawText(word, size, txtColorR, txtColorG, txtColorB) {
   noStroke();
   fill(txtColorR, txtColorG, txtColorB);
   textSize(size);
   text(word.txt, word.x, word.y);
}

//buttons
var Button = function(x, y, w, h, txt, c0, c1, c2) {
   this.x = x;
   this.y = y;
   this.w = w;
   this.h = h;
   this.txt = txt;
   this.c0 = c0;
   this.c1 = c1;
   this.c2 = c2;
};

var startButton = new Button(150, 215, 100, 50, "Start", 0, 0, 255);
var retryButton = new Button(150, 265, 100, 50, "Retry", 255, 0, 0);
var playagainButton = new Button(100, 265, 200, 50, "Play Again", 0, 255, 0);

Button.prototype.draw = function() {
   stroke(this.c0, this.c1, this.c2);
   fill(this.c0 - 100, this.c1 - 100, this.c2 - 100);
   rect(this.x, this.y, this.w, this.h);
   fill(this.c0, this.c1, this.c2);
   textSize(30);
   text(this.txt, this.x + this.w/7, this.y + this.h * 0.7);
};

function checkClick(button) {
   return mousePressed && ((mouseX >= button.x && mouseX <= button.x + button.w) && (mouseY >= button.y && mouseY <= button.y + button.h));
}

// BALL ///////////////////////////////////////////////////////////////////////////////////

var ball = {
   x: 0,
   y: 0,
   vX: 0,
   vY: 2,
   w: 10,
   h: 10,
   c: [255, 255, 255]
};

function drawBall() {
   noStroke();
   fill(ball.c[0], ball.c[1], ball.c[2]);
   rect(ball.x - ball.w/2, ball.y - ball.w/2, ball.w, ball.w);
}
// BRICKS /////////////////////////////////////////////////////////////////////////////////

//bricks array
var bricks = [];

//win condition
var bricksDestroyed = 0;

//brick width and height
var brickW = 30;
var brickH = 15;
var brickColNum = 10;
var brickColNumAlt = brickColNum;
var brickRowNum = 5;

//brick object
var Brick = function(x, y) {
   this.x = x;
   this.y = y;
   this.w = brickW;
   this.h = brickH;
   this.c = [random(0,255), random(0,255), random(0,255)];
};

//draws bricks
Brick.prototype.draw = function() {
   stroke(this.c[0] + 100 , this.c[1] + 100, this.c[2] + 100);
   fill(this.c[0], this.c[1], this.c[2]);
   rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
};

//erases bricks array and resets it
function resetBricks() {
   bricks = [];
       for (var j = 1; j < brickRowNum + 1; j++) {
           brickColNumAlt = brickColNumAlt - (j % 2);
           for (var i = 0; i < brickColNumAlt; i++) {
           bricks.push(new Brick((i * brickW) + ((j % 2) * brickW/2) + (width - brickColNum * brickW)/2 + brickW/4, j * brickH + height/7));
           }
       brickColNumAlt = brickColNum;
       }
}   

// COLLISION DETECTION ////////////////////////////////////////////////////////////////////

//modifies collision box size for Left and Right sides
var rectCollBuffer = 0.45;

//checks for any overlap between two rectangles
function checkRectOverlap (rect1, rect2) {
return ((rect1.x + rect1.w/2 >= rect2.x - rect2.w/2 && rect1.x - rect1.w/2 <= rect2.x + rect2.w/2) && (rect1.y + rect1.w/2 >= rect2.y - rect2.h/2 && rect1.y - rect1.w/2 <= rect2.y + rect2.h/2));
}

//checks for rect1 overlapping bottom side of rect2
function checkRectCollBottom (rect1, rect2) {
   return rect1.vY < 0 && 
   (rect1.y + rect1.h/2 >= rect2.y + rect2.h/2) &&
   (rect1.y - rect1.h/2 <= rect2.y + rect2.h/2) && 
   (rect1.x + rect1.w/2 > rect2.x - rect2.w/2) && 
   (rect1.x - rect1.w/2 < rect2.x + rect2.w/2);
}

//checks for rect1 overlapping top side of rect2
function checkRectCollTop (rect1, rect2) {
   return rect1.vY > 0 && 
   (rect1.y + rect1.h/2 >= rect2.y - rect2.h/2) && 
   (rect1.y - rect1.h/2 <= rect2.y - rect2.h/2) && 
   (rect1.x + rect1.w/2 > rect2.x - rect2.w/2) && 
   (rect1.x - rect1.w/2 < rect2.x + rect2.w/2);
}

//checks for rect1 overlapping left side of rect2
function checkRectCollLeft (rect1, rect2) {
   return rect1.vX > 0 && 
   (rect1.x + rect1.w/2 >= rect2.x - rect2.w * rectCollBuffer) && 
   (rect1.x - rect1.w/2 <= rect2.x - rect2.w * rectCollBuffer) && 
   (rect1.y + rect1.h/2 >= rect2.y - rect2.h * rectCollBuffer) && 
   (rect1.y - rect1.h/2 <= rect2.y + rect2.h * rectCollBuffer);
}

//checks for rect1 overlapping right side of rect2
function checkRectCollRight (rect1, rect2) {
   return rect1.vX < 0 && 
   (rect1.x + rect1.w/2 >= rect2.x + rect2.w * rectCollBuffer) &&
   (rect1.x - rect1.w/2 <= rect2.x + rect2.w * rectCollBuffer) && 
   (rect1.y + rect1.h/2 >= rect2.y - rect2.h * rectCollBuffer) && 
   (rect1.y - rect1.h/2 <= rect2.y + rect2.h * rectCollBuffer);
}

//combines checkRectOverlap with checkRectColl*Side*
var checkForColl = function(brick, collisionResponse) {
   if(checkRectOverlap(ball, brick)) {
       var deadBrick = false;
       if(checkRectCollRight(ball, brick)) {
           deadBrick = true;
           collisionResponse.vX = -ball.vX;
       }
       if(checkRectCollTop(ball, brick)) {
           deadBrick = true;
           collisionResponse.vY = -ball.vY;
       }
       if(checkRectCollBottom(ball, brick)) {
           deadBrick = true;
           collisionResponse.vY = -ball.vY;
       }
       if(checkRectCollLeft(ball, brick)) {
           deadBrick = true;
           collisionResponse.vX = -ball.vX;
       }
       if (deadBrick) {
           //moves destroyed brick off canvas
           brick.x = width + brick.w;
           
           //tracks bricks destroyed
           bricksDestroyed++;
           
           score.txt = score.txt + abs(ball.vX) * 10 + 1;
       }
   }
};

// PADDLE /////////////////////////////////////////////////////////////////////////////////

//paddle pbject
var paddle = function(x, w, h) {
   this.x = x;
   this.y = 370;
   this.w = 50;
   this.h = 10;
   this.vX = 3;
};

//for paddle movement
var lastKey = 0;

//draws the paddle
paddle.prototype.draw = function() {
   noStroke();
   fill(255, 255, 255);
   this.x = constrain(this.x, 25, 375);
   rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
};

//moves the paddle
paddle.prototype.move = function(speed) {
   paddle.vX = speed;
   this.x += paddle.vX;
};

//creates instance of paddle
var paddle = new paddle (width/2, 50, 10);

// SCENARIO ///////////////////////////////////////////////////////////////////////////////

//sets scenario to menu and resets variables
function endBreakout() {
   scenario = "menu";
               
   //resets text positions
   title.x = 100;
   gameover.y = 0;
               
   //resets ball variables
   ball.c[0] = 255; ball.c[1] = 255; ball.c[2] = 255;
   ball.vX = 0; ball.Vy = 0;
   ball.x = width/2; ball.y = paddle.y - paddle.h - 1;
               
   //resets paddle position
   paddle.x = width/2;
               
   resetBricks();
               
   //resets win tracking
   bricksDestroyed = 0;
}

function retryBreakout() {
   scenario = "menu";
   
   //resets ball variables
   ball.c[0] = 255; ball.c[1] = 255; ball.c[2] = 255;
   ball.vX = 0; ball.Vy = 0;
   ball.x = width/2; ball.y = paddle.y - paddle.h - 1;
               
   //resets paddle position
   paddle.x = width/2;
               
}

//starting position for ball
ball.x = width/2;
ball.y = paddle.y - paddle.h - 1;

resetBricks();

//draws scenario repeatedly
draw = function() {

//static--------------------------------------------------------------------------------
   noStroke();
   background(0, 0, 0);
   var highScore = Math.max(scores);
   drawText(score, 20, 255, 255, 255);
   text("Score:", 5, 22);
   text("High Score:", 130, 22);
   text(highScore, 239, 23);
   fill(255, 255, 255);
   stroke(255, 255, 255);
   line(0, 30, 400, 30);
   text(lives, 383, 22);
   rect(354, 9, 10, 10);
   textSize(15);
   text("x", 372, 19);

//setup---------------------------------------------------------------------------------

   //stores new value for ball velocity upon collision
   //protects against double velocity change if ball hits two bricks at once
   var collisionResponse = { vX: ball.vX, vY: ball.vY };

   //draws bricks and checks for collision for every brick and for every repetition of the     original draw function
   for (var i = 0; i < bricks.length; i++) {
       bricks[i].draw();
       checkForColl(bricks[i], collisionResponse);
   }
   
   //resets collision response after checking for collisions
   ball.vX = collisionResponse.vX;
   ball.vY = collisionResponse.vY;
   
   drawBall();
   paddle.draw();

//menu scenario-------------------------------------------------------------------------
   
   //draws start button and title
   if(scenario === "menu") {
       startButton.draw();
       drawText(title, 50, 255, 255, 255);
   }

   //when start button is pressed
   //sets scenario to breakout
   if (checkClick(startButton) && scenario === "menu") {
           scenario = "breakout";
           ball.vX = round(random(-4, 4))/2;
           ball.vY = -2;
           if (ball.vX === 0) {
               ball.vX = round(random(-4, 4))/2;
           }
   }

//breakout scenario---------------------------------------------------------------------
   
   else if (scenario === "breakout") {
       drawText(title, 50, 255, 255, 255);
       title.x = constrain(title.x + 10, 0, 401);
   
   //instant win (debugging)
   if (keyPressed) {
           if (lastKey === 32) {
               bricksDestroyed = bricks.length; }}
               
   // paddle //
   if (kb.pressed.ArrowLeft) {
        paddle.move(-3); 
    }
    else if (kb.pressed.ArrowRight)  {
        paddle.move(3); 
    }
    else {
    paddle.vX = 0;
    }


   /*
       if (keyPressed) {
           if (lastKey === 97) {
               paddle.move(-3); }
           else if (lastKey === 100)  {
               paddle.move(3); }
       }
       else if (keyPressed === false) {
           paddle.vX = 0;
       }
   */
   // ball //
       
       //ball position is affected by its velocity
       ball.y = ball.y + ball.vY;
       ball.x = ball.x + ball.vX;
       
       //if ball collides with paddle
       if (checkRectOverlap(ball, paddle)) {
           if(checkRectCollTop(ball, paddle)) {
               ball.vY = -ball.vY; 
               ball.vX = constrain (ball.vX + paddle.vX/2, -4, 4);
               
               if (ball.x > paddle.x) {
                   ball.vX = constrain (ball.vX + 0.5, -4, 4);
               }
               if (ball.x < paddle.x) {
                   ball.vX = constrain (ball.vX - 0.5, -4, 4);
               }
           }
           if(checkRectCollRight(ball, paddle)) {
               ball.vX = constrain (ball.vX + paddle.vX/2, -4, 4);
           }
           if(checkRectCollLeft(ball, paddle)) {
               ball.vX = constrain (ball.vX + paddle.vX/2, -4, 4);
           }
           if(checkRectCollBottom(ball, paddle)) {
               ball.vY = -abs(ball.vY); 
               ball.vX = constrain (ball.vX + paddle.vX/2, -4, 4);
           }
       }
       
       //if ball hits top
       if (ball.y - ball.w/2 <= 30) {
           ball.vY = -ball.vY; }
       
       //if ball hits sides of canvas
       if (ball.x - ball.w/2 <= 0 || ball.x + ball.w/2 >= 400) {
           ball.vX = -ball.vX; }
       
       //if ball hits bottom of canvas
       else if (ball.y + ball.w/2 >= 400 && scenario === "breakout" && lives > 0) {
           
           if (loseLife) {
               lives = lives - 1;
               loseLife = false;
           }
           
           //freeze ball
           ball.vY = 0;
           ball.vX = 0;
           ball.y = 400 - ball.w/2;
           
           //set ball color to red
           ball.c[0] = 255;
           ball.c[1] = 0;
           ball.c[2] = 0;
           
           retryButton.draw();
           
           //if retry button is pressed
           if (checkClick(retryButton) && scenario === "breakout") {
               retryBreakout();
               loseLife = true;
           }
       }

       if (lives <= 0 && bricksDestroyed < bricks.length) {
           
           background(0, 0, 0);
           
           //freeze ball
           ball.vY = 0;
           ball.vX = 0;
           ball.y = 400 - ball.w/2;
           
           //set ball color to red
           ball.c[0] = 255;
           ball.c[1] = 0;
           ball.c[2] = 0;
           
           //draws and animates gameover text with underline
           drawText(gameover, 50, 255, 0, 0);
           gameover.y = constrain(gameover.y + 10, 0, 175);
           if (gameover.y >= 175) { rect(75, gameover.y + 5, 260, 3); }
           
           retryButton.draw();
           
           //if retry button is pressed
           if (checkClick(retryButton) && scenario === "breakout") {
               endBreakout();
               loseLife = true;
               score.txt = 0;
               lives = 3;
           }
       }
       
       //checks for win condition
       if (bricksDestroyed >= bricks.length) {
           
           //freeze ball
           ball.vY = 0;
           ball.vX = 0;
           
           //sets ball color to green
           ball.c[0] = 0;
           ball.c[1] = 255;
           ball.c[2] = 0;
           
           playagainButton.draw();
           
           //draws and animates youwin text with underline
           drawText(youwin, 50, 0, 255, 0);
           youwin.y = constrain(youwin.y + 5, 0, 100);
           if(youwin.y >= 100) { rect(youwin.x, youwin.y + 5, 190, 3); }
           
           if (checkClick(playagainButton) && scenario === "breakout") {
               loseLife = true;
               scores.push(score.txt);
               score.txt = 0;
               lives = 3;
               endBreakout();
           }
       }
   }
};
   }};

   // Get the canvas that Processing-js will use
   var canvas = document.getElementById("mycanvas"); 
   // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
   var processingInstance = new Processing(canvas, sketchProc); 