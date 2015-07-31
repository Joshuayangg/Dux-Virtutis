enchant();
gridXMax = 26;
gridYMax = 19;
unitArr = [];
unitCount = 0;
production = 0;
manpower = 0;
//Initializing global variables
window.onload = function(){
  var game = new Game(480, 480);
  game.spriteSheetWidth = 480;
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
  function Unit(options){
    this.armored = options.armored;
    this.piercing = options.piercing;
    this.personCost = options.personCost;
    this.productionCost = options.productionCost;
    this.atk = options.atk;
    this.HP = options.HP;
    this.def = options.def;
    //Unit parameters

  }

  Unit.prototype.setUnit = function(x,y,mov,offset){
    this.unit = new Sprite(game.spriteWidth, game.spriteHeight);
    this.unit.isEnemy = false;
    this.unit.parentObject = this;
    this.unit.isDead = false;
    this.unit.canAttack = true;
    this.unit.movement = mov;
    this.unit.spriteOffset = offset;
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
    this.unit.move = function(x,y){
      this.moveTo(x*game.spriteWidth,y*game.spriteHeight);
      this.currentBlock.occupied = false;
      var index = this.currentBlock.unitIndex;
      grid[x][y].unitIndex = index;
      this.currentBlock.unitIndex = null;
      grid[x][y].occupied = true;
      this.currentBlock = grid[x][y];
    }
    unitArr.push(this.unit);
    //Position and sprite variables
  }

  function buildingObject(buildingType){
    this.buildingType = buildingType;
    this.building = new Sprite(game.spriteWidth,game.spriteHeight);
    this.setBuilding = function(x,y){
      this.building.spriteOffset = offset;
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

  function Soldier(options){
    this.HP = 20;
    this.atk = 12;
    this.def = 2;
    this.armored = false;
    this.piercing = false;
    this.personCost = 150;
    this.productionCost = 100;
    this.setUnit = function(x,y){
      Unit.prototype.setUnit.call(this,x,y,3,1);
    }
    this.setUnit(options.x,options.y);
  }
  Soldier.prototype = Object.create(Unit.prototype);
  Soldier.prototype.constructor = Soldier;
  //End of Soldier

  function RPG(options){
    this.HP = 22;
    this.atk = 8;
    this.def = 2;
    this.armored = false;
    this.piercing = true;
    this.personCost = 200;
    this.productionCost = 150;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,3,14);
    }
    this.setUnit(options.x,options.y);
  }
  RPG.prototype = Object.create(Unit.prototype);
  RPG.prototype.constructor = RPG;
  //End of RPG

  function Jeep(options){
    this.HP = 25;
    this.atk = 12;
    this.def = 2;
    this.armored = true;
    this.piercing = false;
    this.personCost = 200;
    this.productionCost = 250;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,5,12);
    }
    this.setUnit(options.x,options.y);
  }
  Jeep.prototype = Object.create(Unit.prototype);
  Jeep.prototype.constructor = Jeep;
  //End of Jeep

  function Tank(options){
    this.HP = 32;
    this.atk = 15;
    this.def = 6;
    this.armored = true;
    this.piercing = false;
    this.personCost = 300;
    this.productionCost = 400;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,4,10);
    }
    this.setUnit(options.x,options.y);
  }
  Tank.prototype = Object.create(Unit.prototype);
  Tank.prototype.constructor = Tank;
  //End of Tank

  function enemySoldier(options){
    this.HP = 20;
    this.atk = 12;
    this.def = 2;
    this.armored = false;
    this.piercing = false;
    this.personCost = 150;
    this.productionCost = 100;
    this.setUnit = function(x,y){
      Unit.prototype.setUnit.call(this,x,y,3,2);
      this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
  }
  enemySoldier.prototype = Object.create(Unit.prototype);
  enemySoldier.prototype.constructor = enemySoldier;
  //End of Soldier

  function enemyRPG(options){
    this.HP = 22;
    this.atk = 8;
    this.def = 2;
    this.armored = false;
    this.piercing = true;
    this.personCost = 200;
    this.productionCost = 150;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,3,13);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
  }
  enemyRPG.prototype = Object.create(Unit.prototype);
  enemyRPG.prototype.constructor = enemyRPG;
  //End of RPG

  function enemyJeep(options){
    this.HP = 25;
    this.atk = 12;
    this.def = 4;
    this.armored = true;
    this.piercing = false;
    this.personCost = 200;
    this.productionCost = 250;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,5,11);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
  }
  enemyJeep.prototype = Object.create(Unit.prototype);
  enemyJeep.prototype.constructor = enemyJeep;
  //End of Jeep

  function enemyTank(options){
    this.HP = 32;
    this.atk = 15;
    this.def = 6;
    this.armored = true;
    this.piercing = false;
    this.personCost = 300;
    this.productionCost = 400;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,3,9);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
  }
  enemyTank.prototype = Object.create(Unit.prototype);
  enemyTank.prototype.constructor = enemyTank;
  //End of Tank

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
      case "enemySoldier":
        this.unitClass = enemySoldier;
        break;
      case "enemyRPG":
        this.unitClass = enemyRPG;
        break;
      case "enemyJeep":
        this.unitClass = enemyJeep;
        break;
      case "enemyTank":
        this.unitClass = enemyTank;
        break;

      //defaults to soldier
    }

    return new this.unitClass(options);
  
  };

  var battle = function(unit1,unit2){
    var object1 = unit1.parentObject;
    var object2 = unit2.parentObject;
    console.log(unit1);
    var attack = object1.atk;
    var defense = object2.def;
    if(object1.piercing&&object2.armored){
      attack+=6;
    }else if(object2.armored){
      defense+=4;
    }
    if(attack>defense){
      object2.HP-=(attack-defense);
      if(object2.HP<=0){
        unit2.removeFromScene();
        unit2.isDead = true;
        unit2.currentBlock.occupied = false;
        //Handle death
      }
    }
    //Initial DMG calculations

    var attack1 = object2.atk;
    var defense1 = object1.def;
    if(!unit2.isDead){
      if(object2.piercing&&object1.armored){
        attack+=6;
      }else if(object1.armored){
        defense+=4;
      }
      if(attack>defense){
        object1.HP-=((attack+(Math.random()*2-2)-defense));
        if(object1.HP<=0){
          unit1.removeFromScene();
          unit1.isDead = true;
          unit1.currentBlock.occupied = false;
          //Handle death
        }
      }
    }
    //Second DMG calculation
    unit1.canAttack = false;
    console.log(object1.HP);
    console.log(object2.HP);
  }

  game.rootScene.addEventListener('touchend', function(e){
    var x = Math.floor(e.x/game.spriteWidth);
    var y = Math.floor(e.y/game.spriteHeight);

    var moveClick = function(e){
      var x1 = Math.floor(e.x/game.spriteWidth);
      var y1 = Math.floor(e.y/game.spriteHeight);
      var spot1 = unitArr[grid[x][y].unitIndex];
      var spot2 = unitArr[grid[x1][y1].unitIndex];
      if(!grid[x1][y1].occupied){
        if(Math.abs(x-x1)+Math.abs(y-y1)<=unitArr[grid[x][y].unitIndex].movement){
          if(!(grid[x1][y1]===grid[x][y])){
            spot1.move(x1,y1);
            unitArr[grid[x1][y1].unitIndex].canMove = false;
          }
          if(grid[x1+1][y1].occupied&&unitArr[grid[x1+1][y1].unitIndex].isEnemy&&unitArr[grid[x1][y1].unitIndex].canAttack){
            if(confirm("Attack the enemy?")){
              battle(spot1,unitArr[grid[x1+1][y1].unitIndex]);
            }
          }else if(grid[x1-1][y1].occupied&&unitArr[grid[x1-1][y1].unitIndex].isEnemy&&unitArr[grid[x1][y1].unitIndex].canAttack){
            if(confirm("Attack the enemy?")){
              battle(spot1,unitArr[grid[x1-1][y1].unitIndex]);
            }
          }else if(grid[x1][y1+1].occupied&&unitArr[grid[x1][y1+1].unitIndex].isEnemy&&sunitArr[grid[x1][y1].unitIndex].canAttack){
            if(confirm("Attack the enemy?")){
              battle(spot1,unitArr[grid[x1][y1+1].unitIndex]);
            }
          }else if(grid[x1][y1-1].occupied&&unitArr[grid[x1][y1-1].unitIndex].isEnemy&&unitArr[grid[x1][y1].unitIndex].canAttack){
            if(confirm("Attack the enemy?")){
              battle(spot1,unitArr[grid[x1][y1-1].unitIndex]);
            }
          }
        }
      }
    }

    if(grid[x][y].occupied&&unitArr[grid[x][y].unitIndex].canMove&&!(unitArr[grid[x][y].unitIndex].isEnemy)){
      game.rootScene.addEventListener('touchstart', moveClick);
      game.rootScene.addEventListener('touchend', function(f){
      game.rootScene.removeEventListener('touchstart', moveClick);
      })
    }
    });
  
  var enemyMove = function(enemy){
    var targetX = 0;
    var targetY = 6;
    var movementLeft = enemy.movement;
    var distance = Math.abs(enemy.xInt-targetX)+Math.abs(enemy.yInt-targetY);
    if(!grid[targetX][targetY].occupied&&distance<=enemy.movement){
      enemy.move(targetX,targetY);
      enemy.canMove = false;
    }else if(!grid[targetX+1][targetY].occupied&&distance<=enemy.movement){
      enemy.move(targetX+1,targetY);
      enemy.canMove = false;
    }else if(!grid[targetX][targetY+1].occupied&&distance<=enemy.movement){
      enemy.move(targetX,targetY+1);
      enemy.canMove = false;
      }else if(!grid[targetX][targetY-1].occupied&&distance<=enemy.movement){
        enemy.move(targetX,targetY-1);
        enemy.canMove = false;
      }else{
        while(enemy.canMove){
          if(targetX!=enemy.xInt){
            if(enemy.xInt-movementLeft>=0){
              if(!grid[enemy.xInt-movementLeft][enemy.yInt].occupied){
               enemy.move(enemy.xInt-movementLeft,enemy.yInt);
               enemy.canMove = false;
               movementLeft = 0;
              }
            }else if(!grid[targetX,enemy.yInt].occupied){
              movementLeft-=enemy.xInt;
              enemy.move(targetX,enemy.yInt);
              enemy.canMove = false;
            }
          }else if(targetY!=enemy.yInt){
            if(enemy.yInt-movementLeft>=0){
              if(!grid[enemy.xInt][enemy.yInt-movementLeft].occupied){
                enemy.move(enemy.xInt,targetY-movementLeft);
                enemy.canMove = false;
                movementLeft = 0;
              }
            }else if(!grid[enemy.xInt][targetY].occupied){
              movementLeft-=enemy.yInt;
              enemy.move(enemy.xInt,targetY);
              enemy.canMove = false;
            }
          }
          if(enemy.canMove){
            movementLeft-=1;
          }
        } 
      }
    setUnits();
  }

  game.onload = function(){
    setMaps();
    setStage();
    //Factory creation
    var factory = new unitFactory();
    var soldier = factory.createUnit({unitType: 'Soldier', x: 5, y: 4});
    var soldier1 = factory.createUnit({unitType: 'Soldier', x: 5, y: 5});
    var rpg = factory.createUnit({unitType: 'RPG', x: 5, y: 6});
    var jeep = factory.createUnit({unitType: 'Jeep', x: 5, y: 7});
    var tank = factory.createUnit({unitType: 'Tank', x: 5, y: 8});
    var enemySoldier = factory.createUnit({unitType: 'enemySoldier', x: 14, y: 5});
    var enemySoldier1 = factory.createUnit({unitType: 'enemySoldier', x: 14, y: 4});
    var enemyRPG = factory.createUnit({unitType: 'enemyRPG', x: 14, y: 6});
    var enemyJeep = factory.createUnit({unitType: 'enemyJeep', x: 14, y: 7});
    var enemyTank = factory.createUnit({unitType: 'enemyTank', x: 14, y: 8});

    var targetDummy = factory.createUnit({unitType: 'enemySoldier', x: 9, y: 5});
    setUnits();
    enemyMove(enemySoldier.unit);
  };
  game.start();
};