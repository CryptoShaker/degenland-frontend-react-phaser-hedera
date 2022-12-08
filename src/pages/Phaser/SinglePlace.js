import Phaser from 'phaser';

import LevelData from "./objects/level-data";
import Methods from "./objects/methods";
import TilesManager from "./objects/tiles-manager";
import LandsManager from "./objects/lands-manager";
import Anim from "./objects/anims";
import Player from "./objects/sprites/player";
import Building from "./objects/sprites/building";
import SideBar from "./objects/side-bar-container";
import Ground from "./objects/sprites/ground";
import Road from "./objects/sprites/road";
//import io from "../../assets/lib/socket.io/socket.io";
import io from 'socket.io-client';

import store from "../../store";
import { setgameScene, backtoTotalMap } from "../../components/Features/GameScene";
import { setBuilding } from "../../components/Features/BuildingNumber";
import { setChat } from "../../components/Features/Chat";
import { setGroundNumber } from "../../components/Features/GroundNumber";
import { setRoadBuilding } from "../../components/Features/RoadBuilding";
import { setGroundBuilding } from "../../components/Features/GroundBuilding";
import { connect } from 'react-redux';

import axios from 'axios';

class SinglePlace extends Phaser.Scene {

  constructor()
  {
		super({key:"singlezone"});
  }
  init(data)
  {
    this.mapsize = 50;
    this.targetPos = data.pos;
    this.Address = data.Address;
    this.cX = this.game.config.width * 0.5;
    this.cY = this.game.config.height * 0.5;
    this.gW = this.game.config.width;
    this.gH = this.game.config.height;

    this.zoomX = this.cX;
    this.zoomY = this.cY;

    this.tileWidth = 128;
    this.tileHeight = 73;

    this.levelData = new LevelData();
    this.methods = new Methods(this);
//    this.landsMngr = new LandsManager(this);
    new Anim(this);

    this.tilesArr = [];
    this.posArr = [];
    this.buildingsArr = [];
    this.pointerflag = false;

    this.zoomValue = 1;

    this.isBuildingSelected = false;
    this.isGroundSelected = false;
    this.isRoadSelected = false;

    this.currentRoad = undefined;
    this.currentGround = undefined;
    this.currentTile = undefined;

    this.mapTweenFlag = false;


    this.screenDragged = false;
    this.yArr = [80,240,440];
    this.beforeGroundNumber = "";

    //timer
    this.timer = 0;
    this.timing = 0;

    //bubble
    this.chatValue = "";
    this.bubbleWidth = 0;
    this.bubbleHeight = 0;
    this.bubblecreated = 0;

    //player group
    this.otherPlayers = this.add.group();

    //player state
    this.playerCreated = 0;

    //player animation
    this.animsStr = "";

    //walletid
    this.walletid = '';

    this.chatMessages = [];

    this.tilesGroup = this.add.group();
    this.buildingGroup = this.add.group();

    this.tilesMngr = new TilesManager(this);
  }
  preload() {
    store.dispatch(setgameScene("singlezone"));
/*    this.load.html("form", "form.html");*/
    this.load.image('game_bg','sky.jpg');
    this.load.image('land-back-single-map', require('../../assets/imgs/land-back.png'));
    for(var i = 1;i <= 31;i++)
      this.load.image('building-' + i, process.env.PUBLIC_URL + "imgs/building/b (" + i + ").png");
    for(var i = 0;i <= 6;i++)
      this.load.image('ground-' + i, process.env.PUBLIC_URL + "imgs/ground/g(" + i + ").png");
    for(var i = 1;i <= 50;i++)
      this.load.image('road-' + i, process.env.PUBLIC_URL + "imgs/road/r (" + i + ").png");
  }

  create()
  {
    const { walletData } = store.getState();
    this.walletid = walletData.data.accountIds[0];

//    this._timerSample();
    this.setCamera();
    this.tilesMngr.addTiles(this.Address);
    this.setchatroom();
    this.setScreen();
//    this.setPlayer(this.targetPos);
    this.setEasyStar();
    this.addEvents();

/*    this._updatePlayer();
    this._getPlayers();
    this._getPlacement();*/

    this.socket = io("http://95.217.63.153:3306", { autoConnect: false });
    this.socket.connect();

    this.socket.on("connect", async () => {
      var tileInfo = [
        [15,15],
        [15,40],
        [40,10],
        [40,30],
        [35,45],
        [45,45]
      ];
      var tileID = 'tile_' + tileInfo[this.targetPos - 1][0] + tileInfo[this.targetPos - 1][1];
  
      this.socket.emit("join", this.Address, this.targetPos, this[tileID].x, this[tileID].y - 25);
    });

    this.socket.on("mapInit", async (placementstring) => {
      var map = new Array(50);
      for(var i = 0;i < 50;i++) {
        map[i] = new Array(50);
        for(var j = 0;j < 50;j++) {
          map[i][j] = placementstring.slice(i * 100 + j * 2, i * 100 + j * 2 + 2);
          if(map[i][j][0] == '0')
            map[i][j] = map[i][j][1];
        }
      }
      this._buildingPlacement(map);
    });

    this.socket.on("currentPlayers", async (players) => {
      Object.keys(players).forEach((id, index) => {
        if(players[id].address == this.Address && players[id].playerId == this.socket.id) {
          this.setPlayer(players[id]);
          this.playerCreated = 1;
        }
        else if(players[id].address == this.Address && players[id].playerId != this.socket.id)
          this._addOtherPlayer(players[id]);
      });
    });

    this.socket.on("newPlayer", async (playerInfo) => {
      if(playerInfo.address == this.Address)
        this._addNewPlayer(playerInfo);
    });

    this.socket.on("playerMoved", async (playerInfo, tilem, tilen) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId == otherPlayer.playerInfo.playerId) {
          this.getPath(tilem,tilen, otherPlayer);
        }
      });
    });

    store.subscribe(() => {
      if(this.scene.key == "singlezone") {
        const state = store.getState();

        if(state.roadBuilding.value != -1) {
          var roadBuilding = state.roadBuilding.value;

          var roadBtn = this.add.sprite(60, this.yArr[roadBuilding - 1], 'road-' + roadBuilding);

          roadBtn.setScale(2);
          roadBtn.setInteractive({useHandCursor:true});
          roadBtn.type = 'road-' + roadBuilding;
          roadBtn.buildingType = 0;
          roadBtn.alpha = 0.5;

          this.addRoad(roadBtn);
          roadBtn.destroy();
        }

        if(state.groundBuilding.value != -1) {
          var selected_ground = state.groundBuilding.value;
          var groundBtn = this.add.sprite(60, this.yArr[selected_ground], 'ground-' + selected_ground);

          groundBtn.setScale(2);
          groundBtn.setInteractive({useHandCursor:true});
          groundBtn.type = 'ground-' + selected_ground;
          groundBtn.buildingType = 0;
          groundBtn.alpha = 0.5;

          this.addGround(groundBtn);
          groundBtn.destroy();
        }

        if(state.buildingNumber.value != -1) {
          var selected_building = state.buildingNumber.value;

          var buildingBtn = this.add.sprite(60, this.yArr[selected_building - 1], 'building-' + selected_building);

          buildingBtn.setScale(2);
          buildingBtn.setInteractive({useHandCursor:true});
          buildingBtn.type = 'building-' + selected_building;
          buildingBtn.buildingType = 0;
          buildingBtn.alpha = 0.5;
//          buildingBtn.setScale(0.45);
      
          this.addBuilding(buildingBtn);
          buildingBtn.destroy();
        }
        if(state.groundNumber.value != "") {
          var groundNumber = state.groundNumber.value;
          var splitnum = groundNumber.split('-');
          if(Number(splitnum[0]) == 1 && Number(splitnum[1]) == 1) {
            var camera_posx;
            var camera_posy;
            switch(Number(splitnum[2])) {
              case 1:
                camera_posx = 15;
                camera_posy = 15;
                break;
              case 2:
                camera_posx = 15;
                camera_posy = 40;
                break;
              case 3:
                camera_posx = 40;
                camera_posy = 10;
                break;
              case 4:
                camera_posx = 40;
                camera_posy = 30;
                break;
              case 5:
                camera_posx = 35;
                camera_posy = 45;
                break;
              case 6:
                camera_posx = 45;
                camera_posy = 45;
                break;
            }
            if(this.beforeGroundNumber != "")
              this.clearGroundAlpha(this.beforeGroundNumber);
            this.setGroundAlpha(groundNumber);
            this.beforeGroundNumber = groundNumber;
            this.cameras.main.pan(this['tile_' + camera_posx + camera_posy].x, this['tile_' + camera_posx + camera_posy].y, 1000);
            this.cameras.main.zoomTo(0.5, 500);
          }
        }
        if(state.Chat.value != "") {
          this.chatValue = state.Chat.value;
          this.timing = 0;
          this.createBubble();
        }
        if(state.gameScene.isbacked != 0) {
          store.dispatch(backtoTotalMap(0));
          this.scene.start('map');
        }
      }
    })
  }

  async _axiosGet(_url) {
    try {
      const res = await axios.get(_url);
      return res.data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async _axiosPost(_url, _body) {
    try {
      const res = await axios.post(_url, _body);
      return res.data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async _updatePlayer() {
    var tileInfo = [
      [15,15],
      [15,40],
      [40,10],
      [40,30],
      [35,45],
      [45,45]
    ];
    var tileID = 'tile_' + tileInfo[this.targetPos - 1][0] + tileInfo[this.targetPos - 1][1];

    const body = {
      walletid: this.walletid,
      address: this.Address,
      targetPos: this.targetPos,
      x: this[tileID].x,
      y: this[tileID].y - 25
    };

    await this._axiosPost('http://95.217.63.153:3306/api/user', body);
  }

  async _getPlacement() {
    const body = {
      address: this.Address
    };

    var placementstring = await this._axiosPost('http://95.217.63.153:3306/api/placement', body);

    var map = new Array(50);
    for(var i = 0;i < 50;i++) {
      map[i] = new Array(50);
      for(var j = 0;j < 50;j++) {
        map[i][j] = placementstring.slice(i * 100 + j * 2, i * 100 + j * 2 + 2);
        if(map[i][j][0] == '0')
          map[i][j] = map[i][j][1];
      }
    }
    this._buildingPlacement(map);
  }

  async _getPlayers() {
    const players = await this._axiosGet('http://95.217.63.153:3306/api/user');
    console.log(players.length);
    for(var i = 0;i < players.length;i++) {
      console.log(players[i].address, players[i].walletid);
      console.log(this.Address, this.walletid);
      if(players[i].address == this.Address && players[i].walletid == this.walletid) {
        console.log(players[i]);
        this.setPlayer(players[i]);
        this.playerCreated = 1;
      }
      else if(players[i].address == this.Address && players[i].walletid != this.walletid)
        this._addOtherPlayer(players[i]);
    }
/*    Object.keys(players).forEach((id, index) => {
      if(players[id].address == this.Address && players[id].playerId == this.socket.id) {
        this.setPlayer(players[id]);
        this.playerCreated = 1;
      }
      else if(players[id].address == this.Address && players[id].playerId != this.socket.id)
        this._addOtherPlayer(players[id]);
    });*/
  }
  /*
  this.socket.on("currentPlayers", async (players) => {
    Object.keys(players).forEach((id, index) => {
      if(players[id].address == this.Address && players[id].playerId == this.socket.id) {
        this.setPlayer(players[id]);
        this.playerCreated = 1;
      }
      else if(players[id].address == this.Address && players[id].playerId != this.socket.id)
        this._addOtherPlayer(players[id]);
    });
  });

  this.socket.on("newPlayer", async (playerInfo) => {
    if(playerInfo.address == this.Address)
      this._addNewPlayer(playerInfo);
  });*/
/*
  _updateTimer() {
    var currentTime = new Date();
    var timeDifference = this.startTime.getTime() - currentTime.getTime();
    //Time elapsed in seconds
    this.timeElapsed = Math.abs(timeDifference / 1000);
    //Time remaining in seconds
    var timeRemaining = this.totalTime - this.timeElapsed;
    //Convert seconds into minutes and seconds
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);
    //Display minutes, add a 0 to the start if less than 10
    var result = (minutes < 10) ? "0" + minutes : minutes;
    //Display seconds, add a 0 to the start if less than 10
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
    this.timeLabel.text = result;
  }

  _createTimer() {
    this.timeLabel = me.game.add.text(me.game.world.centerX, 100, "00:00", {font: "100px Arial", fill: "#fff"});
    this.timeLabel.anchor.setTo(0.5, 0);
    this.timeLabel.align = 'center';
  }

  _timerSample() {
    this.startTime = new Date();
    this.totalTime = 120;
    this.timeElapsed = 0;

    this._createTimer();

    this.gameTimer = this.time.events.loop(100, () => {
      this._updateTimer();
    });
  }*/

  _getTileID(i, j) {
    var tileID;
    if(i >= 0 && i < 10)
      tileID = 'tile_' + '0' + i;
    else
      tileID = 'tile_' + i;
    if(j >= 0 && j < 10)
      tileID += '0' + j;
    else
      tileID += j;
    return tileID;
  }

  _buildingPlacement(map) {
    for(var i = 0;i < this.mapsize;i++) {
      for(var j = 0;j < this.mapsize;j++) {
        if(map[i][j] != 0) {
          var type = map[i][j];
          var tileID = this._getTileID(i, j);
          this[tileID].currentBuildingType = type;
          this.levelData.levelArr_2_2[i][j] = type;

          var buildingType;
          if(type >= 0 && type < 7) {
            buildingType = 'ground-' + type.replace("0", "");
          }
          else if(type >= 7 && type < 57) {
            if(type >=7 && type <= 9) {
              buildingType = 'road-' + (type.replace("0", "") - 6);
            }
            else {
              buildingType = 'road-' + (type - 6);
            }
          }
          else if(type >= 73 && type <= 86) {
            this.levelData.levelArr_2_2[i][j + 1] = type;
            this.levelData.levelArr_2_2[i + 1][j] = type;
            this.levelData.levelArr_2_2[i + 1][j + 1] = type;
  
            buildingType = 'building-' + (type - 56);

            var tileID = this._getTileID(i, j + 1);
            this[tileID].currentBuildingType = type;
            tileID = this._getTileID(i + 1, j);
            this[tileID].currentBuildingType = type;
            tileID = this._getTileID(i + 1, j + 1);
            this[tileID].currentBuildingType = type;
    
            map[i][j + 1] = 0;
            map[i + 1][j] = 0;
            map[i + 1][j + 1] = 0;
          }
          else {
            buildingType = 'building-' + (type - 56);
          }

          var building = this.add.sprite(this[tileID].x, this[tileID].y + this.tileHeight/2, buildingType);
          building.setOrigin(0.5,1);
          building.setDepth(this[tileID].sno);
          this.buildingGroup.add(building);
        }
      }
    }
  }

  _addOtherPlayer(playerInfo) {
    var tileInfo = [
      [15,15],
      [15,40],
      [40,10],
      [40,30],
      [35,45],
      [45,45]
    ];

    var pos = playerInfo.targetPos;
    var tileID = 'tile_' + tileInfo[pos - 1][0] + tileInfo[pos - 1][1];
    var n = tileInfo[pos - 1][0];
    var m = tileInfo[pos - 1][1];

    var player = new Player(this, playerInfo, tileID, n, m, playerInfo.x, playerInfo.y);
    this.otherPlayers.add(player);
  }

  _addNewPlayer(playerInfo) {
    var tileInfo = [
      [15,15],
      [15,40],
      [40,10],
      [40,30],
      [35,45],
      [45,45]
    ];

    var pos = playerInfo.targetPos;
    var tileID = 'tile_' + tileInfo[pos - 1][0] + tileInfo[pos - 1][1];
    var n = tileInfo[pos - 1][0];
    var m = tileInfo[pos - 1][1];

    var player = new Player(this, playerInfo, tileID, n, m);
    this.otherPlayers.add(player);
  }

  clearGroundAlpha(groundNumber) {
    for(var i = 0;i < 50;i++) {
      for(var j = 0;j < 50;j++) {
        var tileID;
        if(i >= 0 && i < 10)
          tileID = 'tile_' + '0' + i;
        else
          tileID = 'tile_' + i;
        if(j >= 0 && j < 10)
          tileID += '0' + j;
        else
          tileID += j;
        if(this[tileID].position_string == groundNumber)
          this[tileID].alpha = 1;
      }
    }
  }

  setGroundAlpha(groundNumber) {
    for(var i = 0;i < 50;i++) {
      for(var j = 0;j < 50;j++) {
        var tileID;
        if(i >= 0 && i < 10)
          tileID = 'tile_' + '0' + i;
        else
          tileID = 'tile_' + i;
        if(j >= 0 && j < 10)
          tileID += '0' + j;
        else
          tileID += j;
        if(this[tileID].position_string == groundNumber && this[tileID].type == 0) {
          this[tileID].alpha = 0.2;
        }
      }
    }
  }

  update()
  {
/*    for(var i = 0;i < this.mapsize;i++) {
      for(var j = 0;j < this.mapsize;j++) {
        var tileID;
        if(i >= 0 && i < 10)
          tileID = 'tile_' + '0' + i;
        else
          tileID = 'tile_' + i;
        if(j >= 0 && j < 10)
          tileID += '0' + j;
        else
          tileID += j;
        if(this[tileID].currentBuildingType != 0)
          console.log(this[tileID].currentBuildingType);
      }
    }*/

    if(this.playerCreated == 1) {
      if(this.player.movingFlag == true) {
        this.socket.emit("playerPosition", {
          x: this.player.x,
          y: this.player.y
        });
      }
  
      if(this.player.bubble != undefined) {
        this.player.bubble.x = this.player.x;
        this.player.bubble.y = this.player.y - this.bubbleHeight - 50;
  
        var b = this.player.chatContent.getBounds();
        this.player.chatContent.x = this.player.bubble.x + (this.bubbleWidth / 2) - (b.width / 2);
        this.player.chatContent.y = this.player.bubble.y + (this.bubbleHeight / 2) - (b.height / 2);
      }
    }

    if(this.currentBuilding != undefined) {
      this.currentBuilding.followMouse();
    }

    if(this.easystar) {
      this.easystar.calculate();
    }
  }

  /*--------------------------------------------------------------------------*/

  setchatroom() {
    this.textInput = this.add.dom(150, 120).createFromCache("form").setOrigin(0.5);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

/*    this.enterKey.on("down", event => {
      if (this.chatValue != "") {
        this.createBubble();
        this.chatValue = "";
//        this.socket.emit("message", this.chatValue);

      }
    })*/

/*
    this.socket.on("connect", async () => {
        this.socket.emit("join", "mongodb");
    });

    this.socket.on("joined", async (gameId) => {
        let result = await fetch("http://localhost:3000/chats?room=" + gameId).then(response => response.json());
        this.chatMessages = result.messages;
        this.chatMessages.push("Welcome to " + gameId);
        if (this.chatMessages.length > 20) {
            this.chatMessages.shift();
        }
//        this.chat.setText(this.chatMessages);
    });

    this.socket.on("message", (message) => {
        this.chatMessages.push(message);
        if(this.chatMessages.length > 20) {
            this.chatMessages.shift();
        }
//        this.chat.setText(this.chatMessages);
    });*/
  }

  createBubble() {
    if(this.bubblecreated == 0) {
      this.createSpeechBubble(this.player.x, this.player.y, 150, 100, this.chatValue);
      this.bubblecreated = 1;
      //set timer
      this.time.addEvent({ delay: 5000, callback: this.onEvent, callbackScope: this, loop: false });
      this.time.addEvent({ delay: 1000, callback: this.onSetEvent, callbackScope: this, loop: false });
    }
    else {
      this.player.chatContent.text = this.chatValue;
      this.player.bubble.visible = true;
      this.player.chatContent.visible = true;

      //set timer
      this.time.addEvent({ delay: 5000, callback: this.onEvent, callbackScope: this, loop: false });
      this.time.addEvent({ delay: 1000, callback: this.onSetEvent, callbackScope: this, loop: false });
    }
    store.dispatch(setChat(""));
  }

  onSetEvent() {
    this.timing = 1;
  }

  onEvent() {
    if(this.timing == 1) {
      this.player.bubble.visible = false;
      this.player.chatContent.visible = false;
    }
  }

  createSpeechBubble (x, y, width, height, quote)
  {
      this.bubbleWidth = 200;
      this.bubbleHeight = 100;
      var bubblePadding = 10;
      var arrowHeight = this.bubbleHeight / 4;
  
      var bubble = this.add.graphics({ x: x + 100, y: y - this.bubbleHeight - 80 });
      this.UICam.ignore(bubble);
      this.physics.world.enable(bubble);
  
      //  Bubble shadow
      bubble.fillStyle(0x222222, 0.5);
      bubble.fillRoundedRect(6, 6, this.bubbleWidth, this.bubbleHeight, 16);
  
      //  Bubble color
      bubble.fillStyle(0xffffff, 1);
  
      //  Bubble outline line style
      bubble.lineStyle(4, 0x565656, 1);
  
      //  Bubble shape and outline
      bubble.strokeRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
      bubble.fillRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
  
      //  Calculate arrow coordinates
      var point1X = Math.floor(this.bubbleWidth / 7);
      var point1Y = this.bubbleHeight;
      var point2X = Math.floor((this.bubbleWidth / 7) * 2);
      var point2Y = this.bubbleHeight;
      var point3X = Math.floor(this.bubbleWidth / 7);
      var point3Y = Math.floor(this.bubbleHeight + arrowHeight);
  
      //  Bubble arrow shadow
      bubble.lineStyle(4, 0x222222, 0.5);
      bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);
  
      //  Bubble arrow fill
      bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
      bubble.lineStyle(2, 0x565656, 1);
      bubble.lineBetween(point2X, point2Y, point3X, point3Y);
      bubble.lineBetween(point1X, point1Y, point3X, point3Y);
  
      var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: this.bubbleWidth - (bubblePadding * 2), useAdvancedWrap: true } });
  
      var b = content.getBounds();
  
      content.setPosition(bubble.x + (this.bubbleWidth / 2) - (b.width / 2), bubble.y + (this.bubbleHeight / 2) - (b.height / 2));
      this.UICam.ignore(content);
      this.player.bubble = bubble;
      this.player.chatContent = content;
  }

  setCamera()
  {
    var background = this.add.image(-10000, -500, 'game_bg').setOrigin(0).setScale(15);
    var land_back = this.add.image(-9200, -300, 'land-back-single-map').setOrigin(0).setScale(7.2);

    this.myCamera = this.cameras.main;
    this.myCamera.setBounds(-3000,3000, 9000, 5000);
    this.myCamera.setZoom(0.3);
    this.myCamera.centerOn(1920,1080);

//    this.UICam = this.cameras.add(0, 0, 133, 1080);
    this.UICam = this.cameras.add(0, 0, 1920, 1080);
    this.UICam.ignore(background);
    this.UICam.ignore(land_back);
  }

  setPlayer(playerInfo) {
    var tileInfo = [
      [15,15],
      [15,40],
      [40,10],
      [40,30],
      [35,45],
      [45,45]
    ];
    var tileID = 'tile_' + tileInfo[this.targetPos - 1][0] + tileInfo[this.targetPos - 1][1];
    var n = tileInfo[this.targetPos - 1][0];
    var m = tileInfo[this.targetPos - 1][1];

    this.setGroundAlpha('2-2-' + this.targetPos);
    this.myCamera.centerOn(this[tileID].x, this[tileID].y);
    this.player = new Player(this,playerInfo, tileID, n, m);
    this.playerGroup.add(this.player);
  }

  setScreen()
  {
    this.playerGroup = this.add.group();

//    this.landsMngr.setLand();
//    this.sideBar = new SideBar(this,0,0);

    this.UICam.ignore(this.tilesGroup);
    this.UICam.ignore(this.playerGroup);
//    this.myCamera.ignore(this.sideBar);

  }
  addBuilding(buildingBtn)
  {
    var building = new Building(this,buildingBtn);
    this.currentBuilding = building;
  }

  addRoad(roadBtn) {
    var road = new Road(this, roadBtn);
    this.currentBuilding = road;
  }

  addGround(groundBtn) {
    var ground = new Ground(this, groundBtn);
    this.currentBuilding = ground;
  }

  addEvents()
  {

    this.input.on('wheel',this.onWheelMove,this);

    this.input.on('pointerdown',(pointer)=>{
      this.pointerflag = true;
    },this);

    this.input.on('pointerup',(pointer)=>{
      this.player.isSelected = true;
      this.screenDragged = false;
      this.pointerflag = false;
    },this);

    this.input.on('pointermove', (pointer) => {
        if(this.pointerflag == true)
          this.player.isSelected = false;

        if (!pointer.isDown) return;

        this.screenDragged = true;

        this.myCamera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.myCamera.zoom;
        this.myCamera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.myCamera.zoom;

    },this);

  }


  onWheelMove(pointer, gameObjects, deltaX, deltaY, deltaZ)
  {
      if (deltaY > 0)
      {
          var newZoom = this.myCamera.zoom - 0.1;
          if (newZoom > 0.3) { this.myCamera.zoom = newZoom;

          }
      }

      if (deltaY < 0) {

          var newZoom = this.myCamera.zoom + 0.1;
          if (newZoom < 1) { this.myCamera.zoom = newZoom; }
      }


//      this.myCamera.centerOn(pointer.x, pointer.y);
      //this.myCamera.pan(pointer.x, pointer.y, 5000, "Linear")

  }

  /*------------------------------Path Finding ------------------------------------------*/

  getPath(m2,n2,player)
  {
    if(player.walkFlag === true){ return; }
    if(player.m === m2 && player.n === n2) { return; }

    player.walkFlag = true;
    player.movingFlag = true;

    var m1 = player.m;
    var n1 = player.n;

    player.m2 = m2;
    player.n2 = n2;

    this.easystar.findPath(m1,n1,m2,n2,(path) => {
      if(path === null)
      {
          //console.log("Path was not found.");
          return;
      }
  
      var startX = 960 + 69/2 - 20 * this.tileWidth/2;
      var startY = 0;
      var w = this.tileWidth;
  
      if(this.tilesMngr.isoMetric === true)
      {
        startX = 600;
        startY = -400;
      }
  
       for(var i = 0; i < path.length; i++)
       {
         var m = path[i].x;
         var n = path[i].y;
         var tileId;
  
  //       var tileId = n.toString() + m.toString();
  
         if(n >= 0 && n < 10)
          tileId = '0' + n.toString();
         else
          tileId = n.toString();
         if(m >= 0 & m < 10)
          tileId += '0' + m.toString();
         else
          tileId += m.toString();
  
         var tile = this['tile_'+tileId];
  
         player.pathXY.push({x:tile.x,y:tile.y,m:m,n:n,sno:tile.sno});
  
       }
  
       var k = 1;
       var m = 0;
       var n = 0;
  
       var tConfig = {
          targets:player,
          alpha:0.99,
          duration:500,
          ease:Phaser.Math.Easing.Linear,
          callbackScope:this,
          loop: player.pathXY.length-1,
          onLoop: () => { this.movePlayer(k, player); k++; },
          onComplete:function() {
  
            //player.isSelected = false;
            player.m = player.m2;
            player.n = player.n2;
            player.walkFlag = false;
            player.movingFlag = false;
            player.pathXY = [];
  
            if(player.bubble != undefined) {
              player.bubble.x = player.x;
              player.bubble.y = player.y - this.bubbleHeight - 50;
  
              var b = player.chatContent.getBounds();
              player.chatContent.x = player.bubble.x + (this.bubbleWidth / 2) - (b.width / 2);
              player.chatContent.y = player.bubble.y + (this.bubbleHeight / 2) - (b.height / 2);
            }
          }
        };
        this.tweens.add(tConfig);
    });
  }

  movePlayer(k, player)
  {
    //      var prev_tileId = 'tile_' + this.player.n.toString()+this.player.m.toString();
      var prev_tileId;

      if(player.n >= 0 && player.n < 10)
        prev_tileId = '0' + player.n.toString();
      else
        prev_tileId = player.n.toString();
      if(player.m >= 0 && player.m < 10)
        prev_tileId += '0' + player.m.toString();
      else
        prev_tileId += player.m.toString();

      var px = this['tile_' + prev_tileId].x;
      var py = this['tile_' + prev_tileId].y;

      var x = player.pathXY[k].x;
      var y = player.pathXY[k].y-25;
      console.log(y-py, x-px);

      var a = Math.atan2(y-py,x-px);
      a = Math.round(a*180/Math.PI);
      console.log(a);

      var str = '';
      var speed = 500;

      if(a === -136)  { player.setFrame(0); str = 'left'; } //left
      else if(a === 10)  { player.setFrame(4);  str = 'right'; } // right
      else if(a === 170)  { player.setFrame(0);  str = 'left'; } //down
      else if(a === -44)  { player.setFrame(4); str = 'right'} //up

      else if(a === -169)
      {
        player.setFrame(0); str = 'left'
//        speed = 1000;
      } //diagnol
      else if(a === -11)
      {
        player.setFrame(4); str = 'right'
//        speed = 1000;
      } //diagnol

      else if(a === -90)  { player.setFrame(12); str = 'back'} //diagnol
      else if(a === 91)  { player.setFrame(11); str = 'front'} //diagnol

      if(str !== '') {
        this.animsStr = str;
        player.anims.play(str);
      }
      console.log(speed);

      var Config = {
         targets:player,
         x:x,
         y:y,
         duration:speed,
         ease:Phaser.Math.Easing.Linear,
         callbackScope:this,
         onComplete:function(){ },
       };

      this.tweens.add(Config);

      player.m = player.pathXY[k].m;
      player.n = player.pathXY[k].n;
      player.setDepth(player.pathXY[k].sno);
  }

  setEasyStar()
  {
     const EasyStar = require('easystarjs');
     this.easystar = new EasyStar.js();

     this.easystar.setGrid(this.levelData.levelArr_2_2);
     this.easystar.setAcceptableTiles([0]);

     this.easystar.enableDiagonals();
     this.easystar.disableCornerCutting();
     this.easystar.setIterationsPerCalculation(1000);

  }
}/*class*/

export default SinglePlace;
//export default SinglePlace;