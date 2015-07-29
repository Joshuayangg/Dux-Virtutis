enchant();
gridXMax = 26;
gridYMax = 19;
unitArr = [];
unitCount = 0;
//Initializing global variables
window.onload = function(){
  var game = new Game(480, 480);
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
    unit.movement = 3;
    unit.atk;
    unit.HP;
    unit.def;
    //Unit parameters

    unit.spriteOffset = 1;
    unit.canMove = true;
    unit.currentBlock = grid[x][y];
    unit.currentBlock.occupied = true;
    unit.currentBlock.unitIndex = unitCount;
    unitCount++;
    unit.x = unit.currentBlock.xPos;
    unit.y = unit.currentBlock.yPos;
    unit.xInt = unit.currentBlock.xIndex;
    unit.yInt = unit.currentBlock.yIndex;
    unit.frame = unit.spriteOffset;
    unit.image = new Surface(game.spriteSheetWidth,game.spriteSheetHeight);
    unit.image.draw(game.assets['sprites.png']);
    unitArr.push(unit);
    //Position and sprite variables
  }
  unit.move = function(x,y){
    unit.moveTo(x*game.spriteWidth,y*game.spriteHeight);
    unit.currentBlock.occupied = false;
    var index = unit.currentBlock.unitIndex;
    grid[x][y].unitIndex = index;
    unit.currentBlock.unitIndex = null;
    grid[x][y].occupied = true;
    unit.currentBlock = grid[x][y];
  }

  /*var Soldier = new Sprite(game.spriteWidth, game.spriteHeight);
  var RPG = new Sprite(game.spriteWidth, game.spriteHeight);
  var Jeep = new Sprite(game.spriteWidth, game.spriteHeight);
  var Tank = new Sprite(game.spriteWidth, game.spriteHeight);

  function unitFactory(){}
  //Skeleton factory
  unitFactory.prototype.unitClass = Soldier;
  //Defualt Class

  unitFactory.prototype.createUnit = function (options){
    //Factory method
    switch(options.unitType){
      case "Soldier":
        this.unitClass = Soldier;
        break;
      case "RPG":
        this.unitClass = RPG;
        break;
      case "Jeep":
        this.unitClass = Jeep;
        break;
      case "Tank":
        this.unitClass = Tank;
        break;
    }

    return new this.unitClass(options);
  
  }
  //Factory test
  var factory = new unitFactory();
  var soldier = factory.createUnit({unitType: 'Soldier'});*/

  game.rootScene.addEventListener('touchend', function(e){
    var x = Math.floor(e.x/game.spriteWidth);
    var y = Math.floor(e.y/game.spriteHeight);

    var moveClick = function(e){
      var x1 = Math.floor(e.x/game.spriteWidth);
      var y1 = Math.floor(e.y/game.spriteHeight);
      if(Math.abs(x-x1)+Math.abs(y-y1)<=unit.movement){
        if(!(grid[x1][y1]===grid[x][y])){
          unitArr[grid[x][y].unitIndex].move(x1,y1);
          unitArr[grid[x1][y1].unitIndex].canMove = false;
        }
      }
    }

    if(grid[x][y].occupied&&unitArr[grid[x][y].unitIndex].canMove){
      game.rootScene.addEventListener('touchstart', moveClick);
      game.rootScene.addEventListener('touchend', function(f){
        game.rootScene.removeEventListener('touchstart', moveClick);
      })
    }
    });

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