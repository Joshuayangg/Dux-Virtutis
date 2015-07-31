/*
enchant();
window.onload = function(){
  var game = new Game(300, 300);
  game.keybind(32, 'a');
  game.spriteSheetWidth = 256;
  game.spriteSheetHeight = 16;
  game.itemSpriteSheetWidth = 64;
  game.preload(['sprites.png', 'items.png']);
  game.items = [{price: 1000, description: "Hurter", id: 0}, 
               {price: 5000, description: "Drg. Paw", id: 1},
               {price: 5000, description: "Ice Magic", id: 2},
               {price: 60, description: "Chess Set", id: 3}]
  game.fps = 15;
  game.spriteWidth = 16;
  game.spriteHeight = 16;
  var map = new Map(game.spriteWidth, game.spriteHeight);
  var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);
  var setMaps = function(){
    map.image = game.assets['sprites.png'];
    map.loadData(mapData);
    foregroundMap.image = game.assets['sprites.png'];
    foregroundMap.loadData(foregroundData);
    var collisionData = [];
    for(var i = 0; i< foregroundData.length; i++){
      collisionData.push([]);
      for(var j = 0; j< foregroundData[0].length; j++){
        var collision = foregroundData[i][j] %13 > 1 ? 1 : 0;
        collisionData[i][j] = collision;
      }
    }
    map.collisionData = collisionData;
  };
  var setStage = function(){
    var stage = new Group();
    stage.addChild(map);
    stage.addChild(player);
    stage.addChild(foregroundMap);
    stage.addChild(player.statusLabel);
    game.rootScene.addChild(stage);
  };
  var player = new Sprite(game.spriteWidth, game.spriteHeight);
  var setPlayer = function(){
    player.spriteOffset = 5;
    player.startingX = 6;
    player.startingY = 14;
    player.x = player.startingX * game.spriteWidth;
    player.y = player.startingY * game.spriteHeight;
    player.direction = 0;
    player.walk = 0;
    player.frame = player.spriteOffset + player.direction; 
    player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
    player.image.draw(game.assets['sprites.png']);

    player.name = "Roger";
    player.characterClass = "Rogue";
    player.exp = 0;
    player.level = 1;
    player.gp = 100;
    if (window.localStorage.getItem('exp')) {
      player.exp = parseInt(window.localStorage.getItem('exp'));
    } else {
      player.exp = 0;
    }
    if (window.localStorage.getItem('level')) {
      player.level = parseInt(window.localStorage.getItem('level'));
    } else {
      player.level = 1;
    }
    if (window.localStorage.getItem('gp')) {
      player.gp = parseInt(window.localStorage.getItem('gp'));
    } else {
      player.gp = 100;
    }
    if (window.localStorage.getItem('inventory')) {
      player.inventory = JSON.parse(window.localStorage.getItem('inventory'));
    } else {
      player.inventory = []; 
    }
    player.levelStats = [{},{attack: 4, maxHp: 10, maxMp: 0, expMax: 10},
                         {attack: 6, maxHp: 14, maxMp: 0, expMax: 30},
                         {attack: 7, maxHp: 20, maxMp: 5, expMax: 50}
    ];
    player.attack = function(){
      return player.levelStats[player.level].attack;
    };
    player.hp = player.levelStats[player.level].maxHp;
    player.mp = player.levelStats[player.level].maxMp;
      
    player.statusLabel = new Label("");
    player.statusLabel.width = game.width;
    player.statusLabel.y = undefined;
    player.statusLabel.x = undefined;
    player.statusLabel.color = '#fff';
    player.statusLabel.backgroundColor = '#000';
  };
  

  player.move = function(){
    this.frame = this.spriteOffset + this.direction * 2 + this.walk;
    if (this.isMoving) {
      this.moveBy(this.xMovement, this.yMovement);
      if (!(game.frame % 2)) {
        this.walk++;
        this.walk %= 2;
      }
      if ((this.xMovement && this.x % 16 === 0) || (this.yMovement && this.y % 16 === 0)) {
        this.isMoving = false;
        this.walk = 1;
      }
    } else {
      this.xMovement = 0;
      this.yMovement = 0;
      if (game.input.up) {
        this.direction = 1;
        this.yMovement = -4;
        player.clearStatus();
      } else if (game.input.right) {
        this.direction = 2;
        this.xMovement = 4;
        player.clearStatus();
      } else if (game.input.left) {
        this.direction = 3;
        this.xMovement = -4;
        player.clearStatus();
      } else if (game.input.down) {
        this.direction = 0;
        this.yMovement = 4;
        player.clearStatus();
      }
      if (this.xMovement || this.yMovement) {
        var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
        var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);
      if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
          this.isMoving = true;
          this.move();
        }
      }
    }
  };
  player.square = function(){
    return {x: Math.floor(this.x /game.spriteWidth), y: Math.floor(this.y/game.spriteHeight)}
  }
  player.facingSquare = function(){
    var playerSquare = player.square();
    var facingSquare;
    if(player.direction === 0){
      facingSquare = {x: playerSquare.x, y: playerSquare.y + 1}
    }else if (player.direction === 1) {
      facingSquare = {x: playerSquare.x, y: playerSquare.y - 1}
    }else if (player.direction === 2) {
      facingSquare = {x: playerSquare.x + 1, y: playerSquare.y}
    }else if (player.direction === 3) {
      facingSquare = {x: playerSquare.x - 1, y: playerSquare.y}
    }
    if ((facingSquare.x < 0 || facingSquare.x >= map.width/16) || (facingSquare.y < 0 || facingSquare.y >= map.height/16)) {
      return null;
    } else {
      return facingSquare;
    }
  }
  player.facing = function(){
    var facingSquare = player.facingSquare();
    if (!facingSquare){
      return null;
    }else{
      return foregroundData[facingSquare.y][facingSquare.x];
    }
  }
  player.visibleItems = [];
  player.itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
  player.inventory = [];
  */





enchant();
gridXMax = 26;
gridYMax = 19;
unitArr = [];
unitCount = 0;
//Initializing global variables
window.onload = function(){
  var game = new Game(500, 500);
  game.spriteSheetWidth = 160;
  game.spriteSheetHeight = 32;
  game.keybind(32, 'a');
  game.fps = 15;
  game.spriteWidth = 32;
  game.spriteHeight = 32;
  game.preload('sprites.png');
  //Loading sprites and setting parameters
  var map = new Map(game.spriteWidth, game.spriteHeight);
  var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);
  var setMaps = function(){
    map.image = game.assets['sprites.png'];
    map.loadData(mapData);
    foregroundMap.image = game.assets['sprites.png'];
    foregroundMap.loadData(foregroundData);
    //Loading maps
    var collisionData = [];
    for(var i = 0; i< foregroundData.length; i++){
      collisionData.push([]);
      for(var j = 0; j< foregroundData[0].length; j++){
        var collision = foregroundData[i][j] %13 > 1 ? 1 : 0;
        collisionData[i][j] = collision;
      }
    }
    map.collisionData = collisionData;
    //Setting collision map

    resetButtons();
  };

  var setStage = function(){
    var stage = new Group();
    stage.addChild(map);
    stage.addChild(unit);
    stage.addChild(unit.statusLabel);
    stage.addChild(foregroundMap);
    game.rootScene.addChild(stage);
    //Adding chilcren to root scene
  };
  function Block(x,y){
  this.occupied = false;
  this.xIndex = x;
  this.yIndex = y;
  this.xPos = this.xIndex*game.spriteWidth;
  this.yPos = this.yIndex*game.spriteHeight;
  this.unitIndex;
    this.toString = function(){
      return this.xIndex+","+this.yIndex;
    }
    this.getUnit = function(){
      if(this.occupied){
        return unitArr[unitIndex];
      }
    }
    //Block data structure
  }
  var grid = [];
  for(var row = 0; row < gridYMax; row++){
    grid.push([]);
  }
  for(var a = 0; a < gridYMax; a++){
    for(var  b = 0; b < gridXMax; b++){
      var thisBlock = new Block(a,b);
      grid[a].push(thisBlock);
    }
  }
  //Initializing a grid of blocks

  var unit = new Sprite(game.spriteWidth, game.spriteHeight);
  var displayingLabel = false;
  var setUnit = function(x,y){
    unit.mov;
    unit.atk = 5;
    unit.hp=6;
    unit.def;
    //Unit parameters

    //setting upgrade platform
    unit.statusLabel = new Label("");
    unit.statusLabel.y = undefined;
    unit.statusLabel.x = undefined;
    unit.statusLabel.color = '#fff';
    unit.statusLabel.backgroundColor = '#000';

    unit.spriteOffset = 1;
    unit.startBlock = grid[x][y];
    unit.startBlock.occupied = true;
    unit.startBlock.unitIndex = unitCount;
    unitCount++;
    unit.x = unit.startBlock.xPos;
    unit.y = unit.startBlock.yPos;
    unit.xInt = unit.startBlock.xIndex;
    unit.yInt = unit.startBlock.yIndex;
    unit.frame = unit.spriteOffset;
    unit.image = new Surface(game.spriteSheetWidth,game.spriteSheetHeight);
    unit.image.draw(game.assets['sprites.png']);
    unitArr.push(unit);
    //Position and sprite variables
  }
  unit.move = function(x,y){
    unit.moveTo(x*spriteWidth,y*spriteHeight);
    unit.startBlock.occupied = false;
    grid[x][y].occupied = true;
  }

var soldier = Object.create(unit);
//calling buttons
var recruitingI = document.getElementById("recruitingI");
var totalWarfareI = document.getElementById("totalWarfareI");
var conscriptionI = document.getElementById("conscriptionI");
var recruitingII = document.getElementById("recruitingII");
var totalWarfareII = document.getElementById("totalWarfareII");
var conscriptionII = document.getElementById("conscriptionII");
var patriotismI = document.getElementById("patriotismI");
var childSoldiers = document.getElementById("childSoldiers");
var conscriptionIII = document.getElementById("conscriptionIII");
var patriotismII = document.getElementById("patriotismII");


  var resetStatusLabel = function() {
    unit.statusLabel.width = 0;
    unit.statusLabel.height = 0;
    unit.statusLabel.text = "";
    var resetPolicies = document.querySelectorAll('.upgradePolicies');
    for (var k = 0; k<resetPolicies.length; k++) {
        resetPolicies[k].style.display = "none";
    }
    displayingLabel= false;
  }

var setLabels = function() {
  if (!displayingLabel) {

       unit.statusLabel.width = game.width;
       unit.statusLabel.height = game.height;
       displayingLabel = true; 
       var policies = document.querySelectorAll(".upgradePolicies");
       for (var k = 0; k<policies.length; k++) {
        policies[k].style.display = "block";
        }
    }
    else {
      resetStatusLabel();
    }
}
unit.displayStatus = function(which){
    switch (which) {
      case "policies":
      setLabels();
      break;
}
    
  };
  unit.clearStatus = function(){
    unit.statusLabel.text = "";
    unit.statusLabel.height = 0;
  };

//display either lab or policies page
document.onkeydown = function(e) {
  e = e || window.event;
  switch(e.keyCode) {
    //when i is pressed
    case 73:
    unit.displayStatus("policies");
    break;
  }
}
//when upgrade buttons are clicked, disable button and raise tyranny bar
var buttonClick = function(button) {
  switch (button){
    case "recruitingI":
      recruitingI.disabled = true;
      totalWarfareI.disabled = false;
      conscriptionI.disabled = false;
      recruitingII.disabled = false;
    break;
    case "recruitingII":
      recruitingII.disabled = true;
      patriotismI.disabled = false;
      conscriptionI.disabled = true;
      totalWarfareI.disabled = true;
    break;
    case "conscriptionI":
      conscriptionI.disabled = true;
      conscriptionII.disabled = false;
      totalWarfareI.disabled = true;
      recruitingII.disabled = true;
    break;
    case "totalWarfareI":
      totalWarfareI.disabled = true;
      totalWarfareII.disabled = false;
      conscriptionI.disabled = true;
      recruitingII.disabled = true;
    break;
    case "conscriptionII":
      conscriptionII.disabled = true;
      conscriptionIII.disabled = false;
    break;
    case "totalWarfareII":
      totalWarfareII.disabled = true;
      childSoldiers.disabled = false;
    break;
    case "patriotismI":
      patriotismI.disabled = true;
      patriotismII.disabled = false;
    break;
    case "childSoldiers":
      childSoldiers.disabled=true;
    break;
    case "conscriptionIII":
      conscriptionIII.disabled=true;
    break;
    case "patriotismII":
      patriotismII.disabled=true;
    break;

};
  displayingLabel = false;
  unit.displayStatus("policies");
  changeElement("tyranny");
}

//button click detection
recruitingI.onclick = function() {
  buttonClick("recruitingI");
};
recruitingII.onclick = function() {
  buttonClick("recruitingII");
};
conscriptionI.onclick = function() {
  buttonClick("conscriptionI");
};
totalWarfareI.onclick = function() {
  buttonClick("totalWarfareI");
};
conscriptionII.onclick = function() {
  buttonClick('conscriptionII');
};
totalWarfareII.onclick = function() {
  buttonClick('totalWarfareII');
};
patriotismI.onclick = function() {
  buttonClick('patriotismI');
};
childSoldiers.onclick = function() {
  buttonClick('childSoldiers');
}
conscriptionIII.onclick = function() {
  buttonClick('conscriptionIII');
};
patriotismII.onclick = function() {
  buttonClick('patriotismII');
};
//detect when player clicks to send troops
//Trying to get whole array of items and loop through each to check if clicked.
var items = document.querySelectorAll('.item');
  for (var i=0; i<items.length; i++){
      items[i].onmousedown = function() {
        console.log(this.id);
      };
  }

var resetButtons = function() {
  //reseting which buttons are acivated and which are not
  var policies = document.querySelectorAll(".button");
       for (var k = 0; k<policies.length; k++) {
        policies[k].disabled = true;
        }
  recruitingI.disabled = false;
}
  
game.onload = function(){
    setMaps();
    setUnit(3,6);
    setStage();
  };
  game.start();
};


//Trying to get whole array of items and loop through each to check if clicked.
var items = document.querySelectorAll('.item');
  for (var i=0; i<items.length; i++){
      items[i].onmousedown = function() {
        console.log(this.id);
      };
  }
  


 //tyranny bar
var lifeBar = 20

var changeElement = function(id) {
  var el = document.getElementById(id);
  lifeBar = lifeBar + 100 //adding tyranny 
  if (lifeBar >= 450) {
    lifeBar = 450; //caps at 450
  }
  if ((150 < lifeBar) && (lifeBar < 240)) {
    el.style.backgroundColor = "yellow"; //approaching red
  }
  if (lifeBar >= 350) {
    el.style.backgroundColor = "red"; //approaching the cap level
  }
  el.style.width = lifeBar.toString() + "px"; //assigning lifeBar to el.style.width
}




