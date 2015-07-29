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
  };

  var setStage = function(){
    var stage = new Group();
    stage.addChild(map);
    stage.addChild(unit);
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
  var setUnit = function(x,y){
    unit.mov;
    unit.atk;
    unit.HP;
    unit.def;
    //Unit parameters

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
  game.onload = function(){
    setMaps();
    setUnit(3,6);
    setStage();
  };
  game.start();
};

/*
  var building = new Sprite(game.spriteWidth, game.spriteHeight);
    var setBuilding = function(){
    	building.spriteOffset = 5;
    	building.startingX = 10;
    	building.startingY = 10;
    	building.x = building.startingX * game.spriteWidth;
    	building.y = building.startingY * game.spriteHeight;
    	}

  var posConversion = function(x,y){
  	x = Math.floor(x/game.spriteWidth);
  	y = Math.floor(y/game.spriteHeight);
  }

  var researchScene = new Scene();
  var lab = {
  	action: function(){
  		game.pushScene(reseachScene);
  	}
  };
  var setResearch = function(){
  	var reseach = new Group();
  	shop.drawResearch = function(){

  	}
  }*/