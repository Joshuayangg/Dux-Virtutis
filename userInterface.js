//detect when player clicks to send troops
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
  lifeBar = lifeBar + 50 //adding tyranny 
  if (lifeBar >= 450) {
  	lifeBar = 450; //caps at 450
  }
  else if ((150 < lifeBar) && (lifeBar < 240)) {
  	el.style.backgroundColor = "yellow"; //approaching red
  }
  else if (lifeBar >= 350) {
  	el.style.backgroundColor = "red"; //approaching the cap level
  }
  el.style.width = lifeBar.toString() + "px"; //assigning lifeBar to el.style.width
}

//tyranny level change test
document.onkeydown = function(e) {
	e = e || window.event;
	switch(e.key) {
		//when t is pressed
		case "t": 
		changeElement("tyranny");
		break;
	}
}


  player.showInventory = function(yOffset){
     if(player.visibleItems.length === 0){
      player.itemSurface.draw(game.assets['items.png']);
      for (var i = 0; i < player.inventory.length; i++){
        var item = new Sprite(game.spriteWidth, game.spriteHeight);
        item.y = 130 + yOffset;
        item.x = 30 + 70*i;
        item.frame = player.inventory[i];
        item.scaleX = 2;
        item.scaleY = 2;
        item.image = player.itemSurface;
        player.visibleItems.push(item);
        game.currentScene.addChild(item);
      }
    }
  };
 