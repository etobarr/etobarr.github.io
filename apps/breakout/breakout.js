//#region Keyboard Inputs
let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    leftArrowPressed = true;
  } else if (event.key === "ArrowRight") {
    rightArrowPressed = true;
  } else if (event.key === "ArrowUp") {
    upArrowPressed = true;
  } else if (event.key === "ArrowDown") {
    downArrowPressed = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    leftArrowPressed = false;
  } else if (event.key === "ArrowRight") {
    rightArrowPressed = false;
  } else if (event.key === "ArrowUp") {
    upArrowPressed = false;
  } else if (event.key === "ArrowDown") {
    downArrowPressed = false;
  }
});

//#endregion keyboard inputs

//#region Global Variables

  //start/stop game
  let start = false;

  // color theme
  const colors = {
    red: "0xFFB6C1",
    lightRed: "0xFFB6C1",
    darkRed: "0xFF1493",

    orange: "0xFFD700",
    lightOrange: "0xFFD700",
    darkOrange: "0xFFA500",

    yellow: "0xFFFFE0",
    lightYellow: "0xFFFFE0",
    darkYellow: "0xFFFF00",

    green: "0x98FB98",
    lightGreen: "0x98FB98",
    darkGreen: "0x90EE90",

    blue: "0x87CEEB",
    lightBlue: "0x87CEEB",
    darkBlue: "0x0000FF",

    indigo: "0xADD8E6",
    lightIndigo: "0xADD8E6",
    darkIndigo: "0x00008B",

    violet: "0xB0E0E6",
    lightViolet: "0xB0E0E6",
    darkViolet: "0x8A2BE2",

    white: "0xFFFFFF",
    black: "0x000000",
    lightGray: "0xF0F0F0",
    gray: "0x808080",
    darkGray: "0x555555"
  }; 

//#endregion Global Variables

//#region Global Functions

  // gets a random color from the theme
  function getRandomColor() {
    const colorNames = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * (colorNames.length - 5));
    return colorNames[randomIndex];
  }

  // creates PIXI text
  const createText = (text, fontFamily = 'Arial', fontSize = 20, fontColor = colors.black) => {
    const newText = new PIXI.Text(text, {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: fontColor
    });

    return newText;
  }

  // creates a rectangle button with text
  const createButton = (w, h, buttonColor = colors.lightGray, label = '', fontSize = 20, fontColor = colors.black) => {
    const button = new PIXI.Graphics();
    button.beginFill(buttonColor);
    button.drawRect(0, 0, w, h);
    button.interactive = true;
    button.buttonMode = true;

    const buttonLabel = createText(label, 'Arial', fontSize, fontColor);

    buttonLabel.x = button.x + button.width / 2;
    buttonLabel.y = button.y + button.height / 2;
    buttonLabel.anchor.set(0.5);

    button.addChild(buttonLabel);

    return button;
  }

//#endregion Global Functions


//#region App Initialization
window.onload = function() {

  // app dimensions
  let app = new PIXI.Application(
    {
      width: 800,
      height: 600,
      backgroundColor: (colors.white)
    }
  );
  document.body.appendChild(app.view);

  // app object to shorten references
  let App = {
    w: app.screen.width,
    h: app.screen.height
  }
//#endregion App Initialization

//#region Game Variables

    // container for all graphics
    const game_c = new PIXI.Container();

    // paddle object
    let paddle = {
      x: App.w / 2,
      y: App.h * .9,
      w: 100,
      h: 30
    } 

    const paddle_g = new PIXI.Graphics();
      paddle_g.beginFill(colors.white);
      paddle_g.drawRect(paddle.x, paddle.y, paddle.w, paddle.h);
      paddle_g.pivot.x = paddle.w / 2; paddle_g.pivot.y = paddle.h / 2;

    // ball object
    let ball = {
      x: App.w / 2,
      y: App.h / 2,
      w: 10,
      h: 10,
      vX: 0,
      vY: 0
    } 

    const ball_g = new PIXI.Graphics();
      ball_g.beginFill(colors.white);
      ball_g.drawRect(ball.x, ball.y, ball.w, ball.h);
      ball_g.pivot.x = ball.w / 2; ball_g.pivot.y = ball.h / 2;

    // bricks
    const wall_c = new PIXI.Container();

  //#endregion Game Variables

//#region Game Functions

// draws grid of bricks
const drawBricks = (w, h, buffer, rows, cols) => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const brick = new PIXI.Graphics();
        brick.beginFill(colors[getRandomColor()]);
        brick.drawRect(i * (w + buffer), j * (h + buffer), w, h);
        wall_c.addChild(brick);
      console.log('drew brick');
    }
  }
  wall_c.x = App.w / 2; wall_c.y = App.h / 2;
  wall_c.pivot.x = rows * (w + buffer) / 2; wall_c.pivot.y = cols * (h + buffer) / 2;
} 

// collision logic
function collisionTest(object1, object2)
{
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}

//#endregion Game Functions

//#region (1)Menu
  let menu = () => {
    console.log('entered menu');
    app.stage.removeChildren();
    app.renderer.backgroundColor = colors.gray;

    // menu container
    const menu = new PIXI.Container();
      menu.x = App.w / 2; menu.y = App.h / 2;
      menu.pivot.x = App.w / 2; menu.pivot.y = App.h / 2;
      app.stage.addChild(menu);

    // start button
    const startButton = createButton(200, 100, colors.darkGreen, 'START', 50, colors.white);
      startButton.x = App.w / 2; startButton.y = App.h / 2; 
      startButton.pivot.x = startButton.width / 2; startButton.pivot.y = startButton.height / 2; 
      startButton.on('click', () => {
        console.log('clicked start');
        app.stage.removeChildren();
        game();
      });
      menu.addChild(startButton);
  }

  //#endregion (1)Menu

//#region (2)Game Initialization
  let game = () => {
    console.log('entered game');
    console.log(ball.y);
    app.stage.removeChildren();
    app.renderer.backgroundColor = colors.gray;

    app.stage.addChild(game_c);

    // draw bricks
    
    game_c.addChild(wall_c);
    drawBricks(50, 20, 3, 10, 10);
    app.stage.addChild(paddle_g);
    app.stage.addChild(ball_g);

    // set starting ball velocity
    ball.vX = .5 - Math.random(); ball.vY = 1;

    //start game loop
    gameLoop();
  }

  //#endregion (2)Game Initialization

//#region (3)Game Loop
  const gameLoop = () => {
    app.ticker.add((delta) => {
      
      //#region Paddle

        //redraw paddle each frame
        paddle_g.clear()
        paddle_g.beginFill(colors.white);
        paddle_g.drawRect(paddle.x, paddle.y, paddle.w, paddle.h);
        paddle_g.pivot.x = paddle.w / 2; paddle_g.pivot.y = paddle.h / 2;
        
        // Arrow key inputs
        if (rightArrowPressed) {
          paddle.x += delta * 8
        }
        if (leftArrowPressed) {
          paddle.x -= delta * 8
        }

        // Canvas bounds
        if (paddle.x + paddle.w/2 > App.w) {
          paddle.x = App.w - paddle.w/2
          console.log('Paddle hit right bounds');
        }
        else if (paddle.x - paddle.w/2 < 0) {
          paddle.x = 0 + paddle.w/2
          console.log('Paddle hit left bounds');
        }

      //#endregion Paddle
      
      //#region Ball

        // redraw ball each frame
        ball_g.clear()
        ball_g.beginFill(colors.white);
        ball_g.drawRect(ball.x, ball.y, ball.w, ball.h);
        ball_g.pivot.x = ball.w / 2; ball_g.pivot.y = ball.h / 2;
        
        // apply velocity
        ball.x += ball.vX; ball.y += ball.vY;

        // Canvas bounds
        if (ball.x + ball.w/2 > App.w || ball.x - ball.w/2 < 0) {
          ball.vX = -ball.vX
          console.log('Ball hit x bounds');
        }
        else if (ball.y + ball.h/2 > App.h || ball.y - ball.h/2 < 0) {
          ball.vY = -ball.vY
          console.log('Ball hit y bounds');
        }

      //#endregion Ball
      console.log(collisionTest(ball, paddle));
      // collision testing
      if(collisionTest(paddle, ball)) {
        if(ball.vX > 0) {}
      }
    });
  }
  
  //#endregion (3)Game Loop

//#region (4)Game Over

  let gameOver = () => {
    console.log('entered game over screen');
    app.stage.removeChildren();
    const gameOver = new PIXI.Container();
    app.stage.addChild(gameOver);
    app.renderer.backgroundColor = colors.black;
  }  

  //#endregion (4)Game Over

// run menu on load
menu();}
