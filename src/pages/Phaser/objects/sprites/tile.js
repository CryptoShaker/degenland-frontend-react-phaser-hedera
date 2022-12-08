import Phaser from 'phaser';
import store from "../../../../store";

class Tile extends Phaser.GameObjects.Sprite {

	constructor(scene,x,y,type,position_string, city, street)
	{
		var frame = 57;
//    if(type === 0) { frame = 56; }

		if(type >= 0 && type < 7)
			var tileType = 'ground-' + type;
		else if(type >= 7 && type < 57)
			var tileType = 'road-' + (type - 6);
		else
			var tileType = 'building-' + (type - 56);

    super(scene,x,y,tileType);

		this.ground_count = 7;
		this.road_count = 50;
		this.building_count = 15;

		this.game = scene;
		this.frameId = frame;
		this.type = type;
		this.currentBuildingType = type;
		this.position_string = position_string;
		this.city = city;
		this.street = street;
		this.chatClicked = 0;

    this.initialize();
	}
  initialize()
  {
		this.add();
  }
	add()
	{
    this.game.add.existing(this);
		this.game.tilesGroup.add(this);

    this.game.tilesArr.push(this);
    this.game.posArr.push({x:this.x,y:this.y});

		this.isEmpty = true;

    /*water*/
		if(this.frameId === 15)
		{
      this.isEmpty = false;
		}

		this.setInteractive(new Phaser.Geom.Circle(128/2, 73/2, 73/2), Phaser.Geom.Circle.Contains);

		this.on('pointerup',this.onTileClick,this);
		this.on('pointerover', this.onTileOver,this);

	}

	decimalToHex(d, padding) {
		var hex = Number(d).toString(16);
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
	}

	hexToDecimal(h) {
		console.log(h.toString(10));
	}

	makeGroundMap() {
		var groundString = "";

		for(var i = 0;i < 50;i++) {
			for(var j = 0;j < 50;j++) {
				groundString += this.decimalToHex(this.game.levelData.levelArr[i][j], 2);
			}
		}
		this.createGroundMap(groundString);
	}

	createGroundMap(groundString) {
		var groundValue = [];
		for(var i = 0;i < groundString.length;i+=2) {
			groundValue[i/2] = parseInt(groundString[i] + groundString[i+1], 16);
		}
		for(var i = 0;i < 50;i++) {
			for(var j = 0;j < 50;j++) {
				this.game.levelData.levelArr[i][j] = groundValue[i*50 + j];
			}
		}
	}

	canBuild(sno) {
		var splitedType = this.game.currentBuilding.type.split("-");
		var buildingType = this.ground_count + this.road_count + parseInt(splitedType[1], 10) - 1;

		if(buildingType >= 72 && buildingType <= 85) {
			if(sno > 50 && sno % 50 != 0) {
				var ID1 = this.convertID(sno);
				var ID2 = this.convertID(sno - 1);
				var ID3 = this.convertID(sno - 50);
				var ID4 = this.convertID(sno - 51);
				if(this.game['tile_' + ID1].currentBuildingType == 0 && 
					 this.game['tile_' + ID2].currentBuildingType == 0 && 
					 this.game['tile_' + ID3].currentBuildingType == 0 && 
					 this.game['tile_' + ID4].currentBuildingType == 0 && 
					 this.game['tile_' + ID1].type == 0 && 
					 this.game['tile_' + ID2].type == 0 && 
					 this.game['tile_' + ID3].type == 0 && 
					 this.game['tile_' + ID4].type == 0)
					return true;
				else
					return false;
			}
			else
				return false;
		}
		else {
			if(sno >= 0) {
				var ID = this.convertID(sno);
				if(this.game['tile_' + ID].currentBuildingType == 0 && this.game['tile_' + ID].type == 0)
					return true;
				else
					return false;
			}
		}
	}

	convertID(sno) {
		var ID = "";
		var i = Math.floor(sno/this.game.mapsize);
		var j = sno%this.game.mapsize;
		if(i >= 0 && i < 10)
			ID = '0' + i.toString();
		else
			ID = i.toString();
		if(j >= 0 && j < 10)
			ID += '0' + j.toString();
		else
			ID += j.toString();
		return ID;
	}

	onTileOver() {
		if(this.game.isBuildingSelected == true || this.game.isRoadSelected == true || this.game.isGroundSelected == true)
		{
			if(this.m == this.game.player.m2 && this.n == this.game.player.n2) { return; }

			var buildflag = this.canBuild(this.sno);
			if(buildflag == true) {
				this.game.currentBuilding.clearTint();
				this.game.currentBuilding.canBuild = true;
			}
			else {
				this.game.currentBuilding.setTint(0x2d2d2d);
				this.game.currentBuilding.canBuild = false;
			}
		}
	}

	onTileClick()
	{
		/*
		const state = store.getState();
		store.subscribe(() => {
			const state = store.getState();

			if(state.Chat.clicked == 1) {
				console.log("subscribe");
				this.chatClicked = 1;
			}
		});*/

		if(this.game.mapTweenFlag == true) { return; }

		if(this.game.isRoadSelected == true && this.game.currentBuilding.canBuild == true)
		{
			if(this.m == this.game.player.m2 && this.n == this.game.player.n2) { return; }

			this.isEmpty = false;
			var splitedType = this.game.currentBuilding.type.split("-");
			var roadType = this.ground_count + parseInt(splitedType[1], 10) - 1;
			this.addBuilding(roadType);
		}

		if(this.game.isBuildingSelected == true && this.game.currentBuilding.canBuild == true) {
			if(this.m == this.game.player.m2 && this.n == this.game.player.n2) { return; }

			this.isEmpty = false;
			var splitedType = this.game.currentBuilding.type.split("-");
			var buildingType = this.ground_count + this.road_count + parseInt(splitedType[1], 10) - 1;
			this.addBuilding(buildingType);
		}

		if(this.game.isGroundSelected == true && this.game.currentBuilding.canBuild == true)
		{
			if(this.m == this.game.player.m2 && this.n == this.game.player.n2) { return; }

			this.isEmpty = false;
			var splitedType = this.game.currentBuilding.type.split("-");
			var groundType = parseInt(splitedType[1], 10);
			this.addBuilding(groundType);
		}

		if(this.game.player.isSelected == true)
		{
			if(this.city == 2 && this.street == 2) {
				if(this.chatClicked == 1)
					return;
				if(this.isEmpty == false) { return; }
				if(this.type !== 0) { return; }

	//			this.alpha = 0.85;
				this.game.socket.emit("playerMovement", {
					tilem: this.m,
					tilen: this.n
				});

				this.game.getPath(this.m,this.n, this.game.player);
			}
		}
		this.game.currentTile = this;
	}

	destroyObject(tempType, sno) {
		this.game.buildingGroup.children.iterate(function(child) {
			if(child != undefined && child.sno == sno) {
				child.destroy();
			}
		});
	}

	_setLevelData(sno, building_type) {
		var i = Math.floor(sno/this.game.mapsize);
		var j = sno%this.game.mapsize;

		this.game.levelData.levelArr_2_2[i][j] = building_type;
	}

	addBuilding(building_type) {
		if(this.currentBuildingType == 0) {	//new building
			if(building_type >= 73 && building_type <= 86) {
				var ID1 = this.convertID(this.sno);
				var ID2 = this.convertID(this.sno - 1);
				var ID3 = this.convertID(this.sno - 50);
				var ID4 = this.convertID(this.sno - 51);
				this._setLevelData(this.sno, building_type);
				this._setLevelData(this.sno - 1, building_type);
				this._setLevelData(this.sno - 50, building_type);
				this._setLevelData(this.sno - 51, building_type);
				this.game['tile_' + ID1].currentBuildingType = building_type;
				this.game['tile_' + ID2].currentBuildingType = building_type;
				this.game['tile_' + ID3].currentBuildingType = building_type;
				this.game['tile_' + ID4].currentBuildingType = building_type;

				this.game.currentBuilding.buildingType = building_type;
				this.game.buildingGroup.add(this.game.currentBuilding);
				this.game.currentBuilding.placeOnTile(this.x,this.y,this.sno);
			}
			else {
				this._setLevelData(this.sno, building_type);
				this.currentBuildingType = building_type;
				this.game.currentBuilding.buildingType = building_type;
				this.game.buildingGroup.add(this.game.currentBuilding);
				this.game.currentBuilding.placeOnTile(this.x,this.y,this.sno);
			}
		}
		else {	// destroy old building and new building
			var tempType = this.currentBuildingType;
			this.currentBuildingType = building_type;
			this.destroyObject(tempType, this.sno);	//delete old object
			this.game.currentBuilding.buildingType = building_type;
			this.game.buildingGroup.add(this.game.currentBuilding);
			this.game.currentBuilding.placeOnTile(this.x,this.y,this.sno);
		}
	}
/*
	addGround(ground_type) {
		if(this.currentBuildingType == 0) {	//new building
			this.currentBuildingType = ground_type;
			this.game.currentGround.groundType = ground_type;
			this.game.buildingGroup.add(this.game.currentGround);
		}
		else {	// destroy old building and new building
			var tempType = this.currentBuildingType;
			this.currentBuildingType = ground_type;
			this.destroyObject(tempType);	//delete old object
			this.game.currentGround.groundType = ground_type;
			this.game.buildingGroup.add(this.game.currentGround);
		}
		this.game.currentGround.placeOnTile(this.x,this.y,this.sno);
	}

	addRoad(road_type) {
		if(this.currentBuildingType == 0) {	//new building
			this.currentBuildingType = road_type;
			this.game.currentRoad.roadType = road_type;
			this.game.buildingGroup.add(this.game.currentRoad);
		}
		else {	// destroy old building and new building
			var tempType = this.currentBuildingType;
			this.currentBuildingType = road_type;
			this.destroyObject(tempType);	//delete old object
			this.game.currentRoad.roadType = road_type;
			this.game.buildingGroup.add(this.game.currentRoad);
		}
		this.game.currentRoad.placeOnTile(this.x,this.y,this.sno);
	}
*/
/*
		if(this.game["building_" + buildingID] == undefined && this.game["road_" + buildingID] == undefined && this.game["ground_" + buildingID] == undefined)
			this.game["building_" + buildingID] = this.game.currentBuilding;
		else {
			if(this.game["building_" + buildingID] != undefined) {
				console.log("building");
				this.game["building_" + buildingID].destroy();
			}
			if(this.game["road_" + buildingID] != undefined) {
				console.log("road");
				this.game["road_" + buildingID].destroy();
				console.log(this.game["road_" + buildingID]);
			}
			if(this.game["ground_" + buildingID] != undefined) {
				console.log("ground");
				this.game["ground_" + buildingID].destroy();
			}
			this.game["building_" + buildingID] = this.game.currentBuilding;
		}
		console.log(this.game);*/
//		this.game["building_" + buildingID].placeOnTile(this.x,this.y,this.sno);
/*
	addBuilding() {
		var buildingID;
		var i = Math.floor(this.sno/this.game.mapsize);
		var j = this.sno%this.game.mapsize;
		if(i >= 0 && i < 10)
			buildingID = '0' + i.toString();
		else
			buildingID = i.toString();
		if(j >= 0 && j < 10)
			buildingID += '0' + j.toString();
		else
			buildingID += j.toString();

		if(this.game["building_" + buildingID] == undefined && this.game["road_" + buildingID] == undefined && this.game["ground_" + buildingID] == undefined)
			this.game["building_" + buildingID] = this.game.currentBuilding;
		else {
			if(this.game["building_" + buildingID] != undefined) {
				console.log("building");
				this.game["building_" + buildingID].destroy();
			}
			if(this.game["road_" + buildingID] != undefined) {
				console.log("road");
				this.game["road_" + buildingID].destroy();
				console.log(this.game["road_" + buildingID]);
			}
			if(this.game["ground_" + buildingID] != undefined) {
				console.log("ground");
				this.game["ground_" + buildingID].destroy();
			}
			this.game["building_" + buildingID] = this.game.currentBuilding;
		}
		console.log(this.game);
//		this.game["building_" + buildingID].placeOnTile(this.x,this.y,this.sno);
	}

	addRoad() {
		var roadID;
		var i = Math.floor(this.sno/this.game.mapsize);
		var j = this.sno%this.game.mapsize;
		if(i >= 0 && i < 10)
			roadID = '0' + i.toString();
		else
			roadID = i.toString();
		if(j >= 0 && j < 10)
			roadID += '0' + j.toString();
		else
			roadID += j.toString();

		if(this.game["road_" + roadID] == undefined)
			this.game["road_" + roadID] = this.game.currentRoad;
		else {
			this.game["road_" + roadID].destroy();
			this.game["road_" + roadID] = this.game.currentRoad;
		}
		this.game["road_" + roadID].placeOnTile(this.x,this.y,this.sno);
	}

	addGround() {
		var groundID;
		var i = Math.floor(this.sno/this.game.mapsize);
		var j = this.sno%this.game.mapsize;
		if(i >= 0 && i < 10)
			groundID = '0' + i.toString();
		else
			groundID = i.toString();
		if(j >= 0 && j < 10)
			groundID += '0' + j.toString();
		else
			groundID += j.toString();

		if(this.game["ground_" + groundID] == undefined)
			this.game["ground_" + groundID] = this.game.currentGround;
		else {
			this.game["ground_" + groundID].destroy();
			this.game["ground_" + groundID] = this.game.currentGround;
		}
		this.game["ground_" + groundID].placeOnTile(this.x,this.y,this.sno);
	}
*/
}/*class*/

export default Tile;