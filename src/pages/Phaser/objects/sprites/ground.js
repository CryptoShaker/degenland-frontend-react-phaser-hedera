import store from "../../../../store";
import { setGroundBuilding } from "../../../../components/Features/GroundBuilding";
import Phaser from 'phaser';

class Ground extends Phaser.GameObjects.Sprite {

	constructor(scene,GroundBtn)
	{
		var type = GroundBtn.type;
		var x = scene.input.mousePointer.x;
    var y  = scene.input.mousePointer.y;

		super(scene,x,y,type);

    this.game = scene;
		this.groundType = GroundBtn.groundType;
    this.type = type;
		this.canBuild = false;

    this.initialize();
	}
  initialize()
  {
		this.add();
  }
	add()
	{
    this.game.add.existing(this);
//		this.game.buildingGroup.add(this);

		this.game.UICam.ignore(this);

//    this.setScale(0.5);
		this.setOrigin(0.5,1);
		this.alpha = 0.5;
    this.game.isGroundSelected = true;

	}
	followMouse()
	{
		this.game.children.bringToTop(this);
		this.x = this.game.input.mousePointer.worldX;
		this.y = this.game.input.mousePointer.worldY + 40;
	}
	placeOnTile(x,y,sno)
	{
		//this.game.buildingContainer.add(this);

//		this.game.sideBar.resetBuildingButton(this.buildingBtn);

		this.alpha = 1;

		this.x = x;
		this.y = y + this.game.tileHeight/2;

		this.game.currentBuilding = undefined;
		this.game.isGroundSelected = false;

		this.sno = sno;
		this.setDepth(this.sno);

		this.getPlacement();
    store.dispatch(setGroundBuilding(-1));
	}

	getPlacement() {
		var placementString = "";
		for(var i = 0;i < this.game.mapsize;i++) {
      for(var j = 0;j < this.game.mapsize;j++) {
        var tileID;
        if(i >= 0 && i < 10)
          tileID = 'tile_' + '0' + i;
        else
          tileID = 'tile_' + i;
        if(j >= 0 && j < 10)
          tileID += '0' + j;
        else
          tileID += j;

				this.game.levelData.levelArr_2_2[i][j] = this.game[tileID].currentBuildingType;
				if(this.game[tileID].currentBuildingType >=0 && this.game[tileID].currentBuildingType < 10)
					placementString += "0" + this.game[tileID].currentBuildingType;
				else
					placementString += this.game[tileID].currentBuildingType;
      }
    }
		this.game.socket.emit("mapMovement", {
			address: this.game.Address,
			mapInfo: placementString
		});
	}
} /*class*/

export default Ground;