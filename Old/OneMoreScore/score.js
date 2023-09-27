//#region application setup

console.log("Initializing...")

import * as PIXI from 'pixi.min.js';

let canvas = {
  left: 0,
  right: 320,
  top: 0,
  bottom: 180
}

//Aliases (rename annoying PIXI stuff)
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi Application (canvas)
const app = new Application({ 
    width: canvas.right, 
    height: canvas.bottom,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

//Add the canvas to the HTML document
document.body.appendChild(app.view);
//enables the ablility to "tab in" -- necessary for key recognition
app.view.setAttribute('tabindex',0);
//for loading progress
loader.onProgress.add(loadProgressHandler);

//loads assets
loader
  .add([
    {name: 'cowboyAnimSheet', url: "images/CowboyAnimSheet2.png"},
    {name: 'bosqueTileset', url: "images/BosqueTileset.png"},
    {name: 'skyTile', url: 'images/sky.png'}
    ])
  //load setup function when done adding
  .load(setup);

//displays loading progress in console
function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log("loading: " + resource.name); 
  //Display the percentage of files currently loaded
  console.log("progress: " + Math.round(loader.progress) + "%"); 

  
}

//#endregion

//texture tileset sizes for tiling
const cowboyAnimSheetWidth = 29;
const cowboyAnimSheetHeight = 44;
const tileCutoutSize = 32;

//This setup function will run when the appplication has loaded
function setup() {
  console.log("All files loaded");

  app.ticker.add((delta) => gameLoop(delta)); //give PIXI ticker to gameloop?

  //#region keyboard setup
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

  //#endregion

  //defines map size and layout
  let mapScale = .5;
  let tileSize = tileCutoutSize * mapScale;
  let map = {
    width: Math.ceil(canvas.right/tileSize),
    height: Math.ceil(canvas.bottom/tileSize),
    tiles: [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 33, 33, 33, 33, 33, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33 
    ],
    collision: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ]
  }

  function testCollision(worldX, worldY) {
    let mapX = Math.floor(worldX / tileSize); // converts to game map coordinates
    let mapY = Math.floor(worldY / tileSize);
    return map.collision[mapY * map.width + mapX]; //finds 0 or 1 on map.collision
  }

  //creates cowboy textures
  let cowboyFrames = [];
  for (let i = 0; i < 14; i++) {
    let x = i % 7;
    let y = Math.floor(i / 7);
    cowboyFrames[i] = new PIXI.Texture(
      resources.cowboyAnimSheet.texture,
      new PIXI.Rectangle(x * cowboyAnimSheetWidth, y * cowboyAnimSheetHeight, cowboyAnimSheetWidth, cowboyAnimSheetHeight)
    );
  }

  //creates map tile textures
  let bosqueTilesetTextures = [];
  for (let i = 0; i < 36; i++) {
    let x = i % 6;
    let y = Math.floor(i / 6);
    bosqueTilesetTextures[i] = new PIXI.Texture(
      resources.bosqueTileset.texture,
      new PIXI.Rectangle(x * tileCutoutSize, y * tileCutoutSize, tileCutoutSize, tileCutoutSize)
    );
  }

  //lays out map tiles
  let background = new PIXI.Container ();
  for (let y = 0; y < map.width; y++) {
    for (let x = 0; x < map.width; x++) {
      let tile = map.tiles[y * map.width + x]
      let sprite = new Sprite(bosqueTilesetTextures[tile])
      sprite.x = x * tileSize;
      sprite.y = y * tileSize;
      background.addChild(sprite);
    }
  }

  //create the sprites
  const cowboyChar = new Sprite(cowboyFrames[1]);

  //Add the sprites to the stage
  app.stage.addChild(background);
  app.stage.addChild(cowboyChar); 

  //controls cowboyChar posision (essentially rename and add velocity)
  let cowboy = {
    x: 0, y: 0,
    vx: 0, vy: 0,
    left: 0, right: 0,
    top: 0, bottom: 0,
    width: 0, height: 0,
  };

  cowboy.width = cowboyAnimSheetWidth;
  cowboy.height = cowboyAnimSheetHeight;

  let frameNumStart = 2 ;
  let lastKey = "right";
  let wasFalling = true;

//start gameloop (60 fps)
  function gameLoop(delta) {
    cowboyChar.x = cowboy.x;
    cowboyChar.y = cowboy.y;

    cowboy.x += cowboy.vx;
    cowboy.y += cowboy.vy;

    cowboy.vy = cowboy.vy + .3;
    
    cowboy.left =  cowboy.x; 
    cowboy.right = cowboy.x + cowboy.width;
    cowboy.top = cowboy.y;
    cowboy.bottom = cowboy.y + cowboy.height;

    let touchingGround = testCollision(cowboy.left + cowboy.width/2, cowboy.bottom) && wasFalling;


    if (cowboy.vy > 0) {
      for (let i = 0; i < cowboy.vy; i++) {
        let testX1 = cowboy.left;
        let testX2 = cowboy.right - 1;
        let testY = cowboy.bottom;
        wasFalling = true;
        if (testCollision(testX1, testY) || testCollision(testX2, testY)) {
          cowboy.vy = 0;
          break;
        }
      }
    }

    if (cowboy.vy < 0) {
      wasFalling = false;
    }
      
    let frameNum = Math.round((cowboy.x + canvas.right)/25) % 4 + frameNumStart;

    //velocity limits
    if (cowboy.vy > 10) {cowboy.vy = 10;} 
    if (cowboy.vy < -10) {cowboy.vy = -10;} 
    if (cowboy.vx > 2) {cowboy.vx = 2;} 
    if (cowboy.vx < -2) {cowboy.vx = -2;}
    if (!kb.pressed.ArrowRight && !kb.pressed.ArrowLeft && touchingGround) {cowboy.vx = cowboy.vx/1.1;} 
    
    //canvas bounds
    if (cowboy.top >= canvas.bottom) {cowboy.vy = 0;} 
    //if (cowboy.top < canvas.top) {cowboy.vy = 1;} 
    if (cowboy.right >= canvas.right) {cowboy.x = canvas.right - cowboy.width, cowboy.vx = 0, console.log("hit right side");} 
    if (cowboy.left <= canvas.left) {cowboy.x = canvas.left, cowboy.vx = 0;}

    
    //horizontal movement
    if (kb.pressed.ArrowRight && touchingGround) {cowboy.vx += .1, lastKey = "right";}
    if (kb.pressed.ArrowLeft && touchingGround) {cowboy.vx -= .1, lastKey = "left";}
    if (kb.pressed.ArrowRight && !touchingGround) {cowboy.vx += .02, lastKey = "right";}
    if (kb.pressed.ArrowLeft && !touchingGround) {cowboy.vx -= .02, lastKey = "left";}
    
    if (cowboy.vx < 0) {frameNumStart = 9;}
    if (cowboy.vx > 0) {frameNumStart = 2;}
    if (cowboy.vx === 0) {
      if(lastKey === "right") {frameNumStart = 2;
      }
      else if(lastKey === "left") {frameNumStart = 9;
      }
    }

    //jump
    if (touchingGround && kb.pressed.ArrowUp) {cowboy.vy = -7;} 
    if (!touchingGround && lastKey === "right") {cowboyChar.texture = cowboyFrames[6];
    } 
    else if (!touchingGround && lastKey === "left") {cowboyChar.texture = cowboyFrames[13];
    } 
    else {cowboyChar.texture = cowboyFrames[frameNum];}
}
}
app.loader.onError.add((error) => console.error(error));

