enchant();
gridXMax = 26;
gridYMax = 19;
unitArr = [];
unitCount = 0;
production = 0;
manpower = 0;
displayinglabels = false;

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
    resetButtons();
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
      this.xInt = x;
      this.yInt = y;
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
      Unit.prototype.setUnit.call(this,x,y,4,1);
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
       Unit.prototype.setUnit.call(this,x,y,4,14);
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
       Unit.prototype.setUnit.call(this,x,y,6,12);
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
       Unit.prototype.setUnit.call(this,x,y,5,10);
    }
    this.setUnit(options.x,options.y);
  }
  Tank.prototype = Object.create(Unit.prototype);
  Tank.prototype.constructor = Tank;
  //End of Tank

  function enemySoldier(options){
    this.HP = 15;
    this.atk = 9;
    this.def = 1;
    this.armored = false;
    this.piercing = false;
    this.personCost = 150;
    this.productionCost = 100;
    this.setUnit = function(x,y){
      Unit.prototype.setUnit.call(this,x,y,3,2);
      this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
    //enemyMove(this.unit);
    this.unit.canMove = false;
  }
  enemySoldier.prototype = Object.create(Unit.prototype);
  enemySoldier.prototype.constructor = enemySoldier;
  //End of Soldier

  function enemyRPG(options){
    this.HP = 15;
    this.atk = 7;
    this.def = 1;
    this.armored = false;
    this.piercing = true;
    this.personCost = 200;
    this.productionCost = 150;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,3,13);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
    //enemyMove(this.unit);
    this.unit.canMove = false;
  }
  enemyRPG.prototype = Object.create(Unit.prototype);
  enemyRPG.prototype.constructor = enemyRPG;
  //End of RPG

  function enemyJeep(options){
    this.HP = 20;
    this.atk = 10;
    this.def = 2;
    this.armored = true;
    this.piercing = false;
    this.personCost = 200;
    this.productionCost = 250;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,5,11);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
    //enemyMove(this.unit);
    this.unit.canMove = false;
  }
  enemyJeep.prototype = Object.create(Unit.prototype);
  enemyJeep.prototype.constructor = enemyJeep;
  //End of Jeep

  function enemyTank(options){
    this.HP = 26;
    this.atk = 13;
    this.def = 4;
    this.armored = true;
    this.piercing = false;
    this.personCost = 300;
    this.productionCost = 400;
    this.setUnit = function(x,y){
       Unit.prototype.setUnit.call(this,x,y,3,9);
       this.unit.isEnemy = true;
    }
    this.setUnit(options.x,options.y);
    //enemyMove(this.unit);
    this.unit.canMove = false;
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
        unitArr.splice(unit2.currentBlock.unitIndex, 1);
        setUnits();
        console.log("dead");
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
          game.scene.removeChild(unit1);
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
          }else if(grid[x1][y1+1].occupied&&unitArr[grid[x1][y1+1].unitIndex].isEnemy&&unitArr[grid[x1][y1].unitIndex].canAttack){
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
      alert("You Lose!");
    }else if(!grid[targetX+1][targetY].occupied&&distance<=enemy.movement){
      enemy.move(targetX+1,targetY);
      enemy.canMove = false;
      alert("You Lose!");
    }else if(!grid[targetX][targetY+1].occupied&&distance<=enemy.movement){
      enemy.move(targetX,targetY+1);
      enemy.canMove = false;
      alert("You Lose!");
    }else if(!grid[targetX][targetY-1].occupied&&distance<=enemy.movement){
      enemy.move(targetX,targetY-1);
      enemy.canMove = false;
        alert("You Lose!");
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

  var checkTurn = function(){
    var count = 0;
    for(var x = 0; x < unitArr.length; x++){
      if(!unitArr[x].canMove){
        count++;
      }
    }
    if(count===unitArr.length){
      for(var x = 0; x < unitArr.length; x++){
        unitArr[x].canMove = true;
        unitArr[x].canAttack = true;
        if(unitArr[x].isEnemy){
          enemyMove(unitArr[x]);
        }
      }
      alert("Your Turn");
      production+=200;
      manpower+=200;
    }
  }

//var soldier = Object.create(unit);
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

//background box for policies page
var box = document.getElementById("box");
box.disabled = true;

var resetStatusLabel = function() {
    box.disabled = true;
    var resetPolicies = document.querySelectorAll('.upgradePolicies');
    for (var k = 0; k<resetPolicies.length; k++) {
        resetPolicies[k].style.display = "none";
    }
    displayingLabel= false;
  }
  console.log(game.width,game.height);

var setLabels = function() {
  if (!displayingLabel) {
       box.disabled = false;
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
var displayStatus = function(which){
    switch (which) {
      case "policies":
      setLabels();
      break;
    }
};

//display either lab or policies page
document.onkeydown = function(e) {
  e = e || window.event;
  switch(e.keyCode) {
    //when i is pressed
    case 73:
    displayStatus("policies");
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
  displayStatus("policies");
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
  lifeBar = lifeBar + 115 //adding tyranny 
  if (lifeBar >= 450) {
    lifeBar = 450; //caps at 450
  }
  if ((160 < lifeBar) && (lifeBar < 260)) {
    el.style.backgroundColor = "yellow"; //approaching red
  }
  if (lifeBar >= 350) {
    el.style.backgroundColor = "red"; //approaching the cap level
  }
  el.style.width = lifeBar.toString() + "px"; //assigning lifeBar to el.style.width
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
    var enemySoldier = factory.createUnit({unitType: 'enemySoldier', x: 14, y: 7});
    var enemySoldier1 = factory.createUnit({unitType: 'enemySoldier', x: 14, y: 4});
    var enemyRPG = factory.createUnit({unitType: 'enemyRPG', x: 14, y: 6});
    var enemyJeep = factory.createUnit({unitType: 'enemyJeep', x: 14, y: 2});
    var enemyTank = factory.createUnit({unitType: 'enemyTank', x: 14, y: 9});
    setUnits();
    game.rootScene.on('enterframe', function(e){
      checkTurn();
    });
  };
  game.start();

};
