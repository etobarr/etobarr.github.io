// Listen for keyboard events
window.addEventListener('keydown', (e) => {
  switch (e.key) {
      case 'ArrowLeft':
          let leftArrowPressed = true;
          break;
      case 'ArrowRight':
          let rightArrowPressed = true;
          break;
      case 'ArrowUp':
          let upArrowPressed = true;
          break;
      case 'ArrowDown':
          let downArrowPressed = true;
          break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
      case 'ArrowLeft':
        leftArrowPressed = false;
        break;
      case 'ArrowRight':
        downArrowPressed = false;
        break;
      case 'ArrowUp':
        upArrowPressed = false;
        break;
      case 'ArrowDown':
        downArrowPressed = false;
        break;
  }
});

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

function getRandomColor() {
  const colorNames = Object.keys(colors);
  const randomIndex = Math.floor(Math.random() * (colorNames.length - 5));
  return colorNames[randomIndex];
}

window.onload = function() {
  let app = new PIXI.Application(
    {
      width: 800,
      height: 600,
      backgroundColor: (colors.white)
    }
  );
  document.body.appendChild(app.view);

  let App = {
    w: app.screen.width,
    h: app.screen.height
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

  // menu setup
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
  
  //game setup
  let game = () => {
    console.log('entered game');
    app.stage.removeChildren();
    app.renderer.backgroundColor = colors.gray;

    const game = new PIXI.Container();
    app.stage.addChild(game);


    // draw bricks
    const wall = new PIXI.Container();
    game.addChild(wall);

    const drawBricks = (w, h, buffer, rows, cols) => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const brick = new PIXI.Graphics();
            brick.beginFill(colors[getRandomColor()]);
            brick.drawRect(i * (w + buffer), j * (h + buffer), w, h);
            wall.addChild(brick);
          console.log('drew brick');
        }
      }
      wall.x = App.w / 2; wall.y = App.h / 2;
      wall.pivot.x = rows * (w + buffer) / 2; wall.pivot.y = cols * (h + buffer) / 2;
    } 
    
    drawBricks(50, 20, 3, 10, 10);

    // draw paddle
    let paddle = {
      x: App.w / 2,
      y: App.h * .9,
      w: 100,
      h: 30
    }
    const paddleG = new PIXI.Graphics();
    paddleG.beginFill(colors.white);
    paddleG.drawRect(paddle.x, paddle.y, paddle.w, paddle.h);
    paddleG.pivot.x = paddle.w / 2; paddleG.pivot.y = paddle.h / 2;
    app.stage.addChild(paddleG);

    // draw ball
    const ball = new PIXI.Graphics();


    // paddle inputs
    // collision logic
    function collisionTest(rectangle1, rectangle2) {
      return (
        rectangle1.x + rectangle1.width , rectangle2.x &&
        rectangle1.x , rectangle2.x , rectangle2.width &&
        rectangle1.y + rectangle1.height , rectangle2.y &&
        rectangle1.y , rectangle2.y , rectangle2.height
      );
    }
    
    // win condition
  }
  
  // game over screen setup
  let gameOver = () => {
    console.log('entered game over screen');
    app.stage.removeChildren();
    const gameOver = new PIXI.Container();
    app.stage.addChild(gameOver);
    app.renderer.backgroundColor = colors.black;
  }  

  menu();

app.ticker.add((delta) => {
  if (rightArrowPressed) {
    paddle.x += .1;
  }
    mouseX = app.renderer.plugins.interaction.mouse.global.x;
    mouseY = app.renderer.plugins.interaction.mouse.global.y;
});
}