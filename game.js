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
    stage.addChild(foregroundMap);
    game.rootScene.addChild(stage);
    //Adding chilcren to root scene
  };
  var setUnits = function(){
    var troops = new Group();
    for(var x = 0; x < unitArr.length; x++){
      troops.addChild(unitArr[x])
      game.rootScene.addChild(troops);
    }
  }
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
  function unitObject(unitType){
    this.unitType = unitType;
    this.unit = new Sprite(game.spriteWidth, game.spriteHeight);
    this.movement = 3;
    this.isEnemy;
    this.armored;
    this.piercing;
    this.personCost;
    this.productionCost;
    this.atk;
    this.HP;
    this.def;
    //Unit parameters
    this.setUnit = function(x,y){
      this.unit.unitobject = this;
      this.unit.spriteOffset = 1;
      this.unit.canMove = true;
      this.unit.currentBlock = grid[x][y];
      this.unit.currentBlock.occupied = true;
      this.unit.currentBlock.unitIndex = unitCount;
      unitCount++;
      this.unit.x = this.unit.currentBlock.xPos;
      this.unit.y = this.unit.currentBlock.yPos;
      this.unit.xInt = this.unit.currentBlock.xIndex;
      this.unit.yInt = this.unit.currentBlock.yIndex;
      this.unit.frame = this.unit.spriteOffset;
      this.unit.image = new Surface(game.spriteSheetWidth,game.spriteSheetHeight);
      this.unit.image.draw(game.assets['sprites.png']);
      unitArr.push(this.unit);
      //Position and sprite variables
    }
    this.unit.move = function(x,y){
      this.moveTo(x*game.spriteWidth,y*game.spriteHeight);
      this.currentBlock.occupied = false;
      var index = this.currentBlock.unitIndex;
      grid[x][y].unitIndex = index;
      this.currentBlock.unitIndex = null;
      grid[x][y].occupied = true;
      this.currentBlock = grid[x][y];
    }
  }
  
  function buildingObject(buildingType){
    this.buildingType = buildingType;
    this.building = new Sprite(game.spriteWidth,game.spriteHeight);
    this.setBuilding = function(x,y){
      this.building.spriteOffset = 0;
      this.building.currentBlock = grid[x][y];
      this.building.currentBlock.occupied = true;
      this.building.x = this.building.currentBlock.xPos;
      this.building.y = this.building.currentBlock.yPos;
      this.building.xInt = this.building.currentBlock.xIndex;
      this.building.yInt = this.building.currentBlock.yIndex;
      this.building.frame = this.building.spriteOffset;
      this.building.image = new Surface(game.spriteSheetWidth,game.spriteSheetHeight);
      this.building.image.draw(game.assets['sprites.png']);
    }
  }

  Soldier.prototype = unitObject;
  function Soldier(){

    this.HP = 20;
    this.atk = 12;
    this.def = 2;
    this.movement = 3;
    this.armored = false;
    this.piercing = false;
    this.personCost = 150;
    this.productionCost = 100;
  }

  RPG.prototype = unitObject;
  function RPG(){

  }

  Jeep.prototype = unitObject;
  function Jeep(){

  }

  Tank.prototype = unitObject;
  function Tank(){

  }

  function unitFactory(){}
  //Skeleton factory
  unitFactory.prototype.unitClass = Soldier;
  //Defualt Class

  unitFactory.prototype.createUnit = function (unitType){
    //Factory method
    return new unitObject(unitType);
  
  }

  var battle = function(){
    if(grid[x1][y1].occupied&&spot2.isEnemy){
      if(spot2.def-spot1.atk<0){
        spot2.HP-=(spot2.def-spot1.atk);
      }
    }
  }

  game.rootScene.addEventListener('touchend', function(e){
    var x = Math.floor(e.x/game.spriteWidth);
    var y = Math.floor(e.y/game.spriteHeight);

    var moveClick = function(e){
      var x1 = Math.floor(e.x/game.spriteWidth);
      var y1 = Math.floor(e.y/game.spriteHeight);
      if(!grid[x1][y1].occupied){
        var spot1 = unitArr[grid[x][y].unitIndex];
        var spot2 = unitArr[grid[x1][y1].unitIndex];
        if(Math.abs(x-x1)+Math.abs(y-y1)<=spot1.unitobject.movement){
          if(!(grid[x1][y1]===grid[x][y])){
            spot1.move(x1,y1);
            unitArr[grid[x1][y1].unitIndex].canMove = false;
          }
        }
      }else if(grid[x1][y1].isEnemy){
        battle();
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
    setStage();
    //Factory test
    var factory = new unitFactory();
    var soldier = factory.createUnit({unitType: 'Soldier'});
    var soldier1 = factory.createUnit({unitType: 'Soldier'});
    //var soldier2 = factory.createUnit({unitType: 'Soldier'});
    soldier.setUnit(5,5);
    console.log(soldier.unit.x + ',' + soldier.unit.y);
    console.log(soldier1.unit.x + ',' + soldier1.unit.y);
    soldier1.setUnit(5,6);
    console.log(soldier.unit.x + ',' + soldier.unit.y);
    console.log(soldier1.unit.x + ',' + soldier1.unit.y);
    //soldier2.setUnit(5,4);
    setUnits();
  };
  game.start();
};

/*
  
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