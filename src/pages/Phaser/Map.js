import Phaser from 'phaser';
import store from "../../store";
import { setgameScene, clickPosition, setVisit, setVisitPark } from "../../components/Features/GameScene";
import LevelTotalMap from './objects/level-totalmap';

class Map extends Phaser.Scene {

  constructor()
  {
		super({key:"map"});
  }

  init() {
    this.beforeGroundNumber = "";
    this.mapsize = 50;

    //zoom flag
    this.grandflag = 0;
    this.bigflag = 0;
    this.mediumflag = 0;
    this.smallflag = 0;

    this.levelTotalMap = new LevelTotalMap();

    //search flag
    this.searchflag = 0;

    //scene flag
    this.sceneflag = 1;

    //pointer flag
    this.pointerflag = 0;

    this.grand_created = 0;
    this.big_created = 0;
    this.medium_created = 0;
    this.small_created = 0;

    this.selectedAddress = '';
    this.selectedPos = '';
  }

  preload ()
  {
    store.dispatch(setgameScene("totalmap"));
    this.load.spritesheet('avatar',require('../../assets/imgs/spritesheets/avatar-32x64-1.png'),{frameWidth:32,frameHeight:64});
    this.load.image('game_bg',require("../../assets/imgs/sky.jpg"));
    this.load.image('map1', require('../../assets/imgs/map-img-1.png'));
    this.load.image('map2', require('../../assets/imgs/map-img-2.png'));
    this.load.image('map3', require('../../assets/imgs/map-img-3.png'));
    this.load.image('pos_red', require('../../assets/imgs/pos_red.png'));
    this.load.image('pos_blue', require('../../assets/imgs/pos_blue.png'));
    this.load.image('pos_green', require('../../assets/imgs/pos_green.png'));
    this.load.image('land-back', process.env.PUBLIC_URL + "imgs/ground.png");
    this.load.image('fun-park-1', process.env.PUBLIC_URL + "imgs/fun-park-1.png");
    this.load.image('fun-park-2', process.env.PUBLIC_URL + "imgs/fun-park-2.png");
    this.load.image('avatar1', process.env.PUBLIC_URL + "imgs/avatars/1.jpg");
    this.load.image('avatar2', process.env.PUBLIC_URL + "imgs/avatars/2.jpg");
    this.load.image('avatar3', process.env.PUBLIC_URL + "imgs/avatars/3.jpg");
    this.load.image('avatar4', process.env.PUBLIC_URL + "imgs/avatars/4.jpg");
    this.load.image('avatar5', process.env.PUBLIC_URL + "imgs/avatars/5.jpg");
    this.load.image('avatar6', process.env.PUBLIC_URL + "imgs/avatars/6.jpg");
    this.load.image('avatar7', process.env.PUBLIC_URL + "imgs/avatars/7.jpg");
  }

  create ()
  {
    store.subscribe(() => {
      if(this.sceneflag == 1) {
        const state = store.getState();

        if(state.groundNumber.value != "") {
          var groundNumber = state.groundNumber.value;
          this.cameras.main.pan(this['pos_' + groundNumber].x, this['pos_' + groundNumber].y, 1000);
  
          if(this.beforeGroundNumber != "") {
            this['pos_' + this.beforeGroundNumber].setScale(0.2);
            this['avatar_' + this.beforeGroundNumber].setScale(0.23);
            this['avatar_' + this.beforeGroundNumber].y += this['avatar_' + this.beforeGroundNumber].height/5;
            //            this['pos_' + this.beforeGroundNumber].visible = false;
          }

          this['pos_' + groundNumber].setScale(0.4);
          this['avatar_' + groundNumber].setScale(0.46);
          this['avatar_' + groundNumber].y -= this['avatar_' + groundNumber].height/5;
          this['pos_' + groundNumber].visible = true;
          this.beforeGroundNumber = groundNumber;
          this.cameras.main.zoomTo(0.8, 500);
        }

        if(state.gameScene.visit == true) {
          this.sceneflag = 0;
          store.dispatch(setVisit(false));
          this.scene.start('singlezone', {Address: this.selectedAddress, pos: this.selectedPos });
        }
      }
    })
    this.setScreen();
    this.createPos();
    this.addEvents();

    this.cameras.main.setBounds(-15000,-1600, 32000, 22000);
    this.cameras.main.setZoom(0.1);
    this.cameras.main.centerOn(3500, 6000);
  }

  createPos() {
    var ratex = 1/5;
    var ratey = 7/5;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_red', ratex, ratey, '1', j, i);
      }
    }
  
    ratex = 7/10;
    ratey = 19/10;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_green', ratex, ratey, '2', j, i);    
      }
    }
  
    ratex = -(2/5);
    ratey = 9/5;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_blue', ratex, ratey, '3', j, i);
      }
    }
    ratex = 0;
    ratey = 2;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_blue', ratex, ratey, '4', j, i);
      }
    }
  
    ratex = 2/5;
    ratey = 23/10;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_red', ratex, ratey, '5', j, i);
      }
    }
    ratex = 1/5;
    ratey = 25/10;
    for (var j = 0; j < this.mapsize; j++)
    {
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0)
          this.setPos('pos_green', ratex, ratey, '6', j, i);
      }
    }
  }

  setScreen() {
    var x;
    var y;
    var h = 292;
    var startX = 1000 + 133; //sidebar_width plus
    var startY = 100;
    var angle = 30*Math.PI/180;

    this.add.image(-15000, -1600, 'game_bg').setOrigin(0).setScale(25);
    this.add.image(-14300, -4000, 'land-back').setOrigin(0).setScale(10);
    var fun_park_1 = this.add.image(-2200, 7000, 'fun-park-1').setOrigin(0).setScale(3);

    fun_park_1.setInteractive({useHandCursor:true});
    fun_park_1.on('pointerup', () => {
      store.dispatch(clickPosition(2));
    });

    var fun_park_2 = this.add.image(-700, 5500, 'fun-park-2').setOrigin(0).setScale(3);
    fun_park_2.setInteractive({useHandCursor:true});
    fun_park_2.on('pointerup', () => {
      store.dispatch(clickPosition(2));
    });

    //set map
    for (var j = 0; j < this.mapsize; j++)
    {
      if(j > 0)
      {
        startX = startX - h * Math.cos(angle);
        startY = startY + h/2;
      }
      for (var i = 0; i < this.mapsize; i++) {
        if(this.levelTotalMap.levelArr[j][i] == 0) {
          var mapID;
          x = startX + i * h * Math.cos(angle);
          y = startY + i * h * Math.sin(angle);
  
          if(j >= 0 && j < 10)
            mapID = 'map_' + '0' + j;
          else
            mapID = 'map_' + j;
          if(i >= 0 && i < 10)
            mapID += '0' + i;
          else
            mapID += i;
          this[mapID] = this.add.image(x, y, 'map' + Math.floor(Math.random() * 3 + 1)).setOrigin(0);
        }
      }
    }
  }

  addEvents() {
    this.input.on("wheel",  (pointer, gameObjects, deltaX, deltaY, deltaZ) => {

      if (deltaY > 0) {
          var newZoom = this.cameras.main.zoom - 0.05;
          if (newZoom > 0.1) {
              this.cameras.main.zoom = newZoom;     
          }
      }

      if (deltaY < 0) {
          var newZoom = this.cameras.main.zoom + 0.05;
          if (newZoom < 1.3) {
              this.cameras.main.zoom = newZoom;     
          }
      }
    });

    this.input.on('pointermove', (pointer) => {
        if (!pointer.isDown) return;

        this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
    });
  }

  setPos(pos_type, ratex, ratey, pos_size, j, i) {
    var h = 292;
    var angle = 30*Math.PI/180;
    
    var mapID;

    if(j >= 0 && j < 10)
      mapID = 'map_' + '0' + j;
    else
      mapID = 'map_' + j;
    if(i >= 0 && i < 10)
      mapID += '0' + i;
    else
      mapID += i;

    //set pos
    var unitx = h*Math.cos(angle);
    var unity = h*Math.sin(angle);
    var defaultx = this[mapID].x + this[mapID].width/2 - 50;
    var defaulty = this[mapID].y - this[mapID].height/2 + 50;

    //avatar
    var avatarID = 'avatar_' + (j + 1) + '-' + (i + 1) + '-' + pos_size;
    this[avatarID] = this.add.image(defaultx + unitx * ratex, defaulty + unity * ratey - 45, 'avatar' + Math.floor(Math.random() * 7 + 1)).setOrigin(0.5, 1).setScale(0.23);
    this[avatarID].visible = false;

    //pos
    var posID = 'pos_' + (j + 1) + '-' + (i + 1) + '-' + pos_size;
    this[posID] = this.add.image(defaultx + unitx * ratex, defaulty + unity * ratey, pos_type).setOrigin(0.5, 1).setScale(0.2);
    this[posID].visible = false;
    this[posID].setInteractive({useHandCursor:true});
    var pointedflag = 0;
    this[posID].on('pointermove', (pointer) => {
      if (pointer.isDown) {
        pointedflag = 1;
      }
    }, this);

    this[posID].on('pointerup', (pointer) => {
      if (pointedflag != 1) {
        pointedflag = 0;
        this.selectedAddress = (j + 1) + '-' + (i + 1);
        this.selectedPos = pos_size;
        store.dispatch(clickPosition(1));
      }
      pointedflag = 0;
    }, this);
  }

  update ()
  {
    //grandpos
    if(this.cameras.main.zoom > 0.28 && this.cameras.main.zoom <= 0.38 && this.grandflag == 0) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-1'].visible = true;
            this['avatar_' + i + '-' + j +'-1'].visible = true;
          }
        }
      }
      this.grandflag = 1;
    }
    else if(this.cameras.main.zoom <= 0.28 && this.grandflag == 1) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-1'].visible = false;
            this['avatar_' + i + '-' + j +'-1'].visible = false;
          }
        }
      }
      this.grandflag = 0;
    }

    //bigpos
    if(this.cameras.main.zoom > 0.38 && this.cameras.main.zoom <= 0.48 && this.bigflag == 0) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-2'].visible = true;
            this['avatar_' + i + '-' + j +'-2'].visible = true;
          }
        }
      }
      this.bigflag = 1;
    }
    else if(this.cameras.main.zoom <= 0.38 && this.bigflag == 1) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-2'].visible = false;
            this['avatar_' + i + '-' + j +'-2'].visible = false;
          }
        }
      }
      this.bigflag = 0;
    }

    //mediumpos
    if(this.cameras.main.zoom > 0.48 && this.cameras.main.zoom <= 0.58 && this.mediumflag == 0) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-3'].visible = true;
            this['pos_' + i + '-' + j +'-4'].visible = true;
            this['avatar_' + i + '-' + j +'-3'].visible = true;
            this['avatar_' + i + '-' + j +'-4'].visible = true;
          }
        }
      }
      this.mediumflag = 1;
    }
    else if(this.cameras.main.zoom <= 0.48 && this.mediumflag == 1) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-3'].visible = false;
            this['pos_' + i + '-' + j +'-4'].visible = false;
            this['avatar_' + i + '-' + j +'-3'].visible = false;
            this['avatar_' + i + '-' + j +'-4'].visible = false;
          }
        }
      }
      this.mediumflag = 0;
    }

    //smallpos
    if(this.cameras.main.zoom > 0.68 && this.cameras.main.zoom <= 0.78 && this.smallflag == 0) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-5'].visible = true;
            this['pos_' + i + '-' + j +'-6'].visible = true;
            this['avatar_' + i + '-' + j +'-5'].visible = true;
            this['avatar_' + i + '-' + j +'-6'].visible = true;
          }
        }
      }
      this.smallflag = 1;
    }
    else if(this.cameras.main.zoom <= 0.68 && this.smallflag == 1) {
      for(var i = 1;i <= this.mapsize;i++) {
        for(var j = 1;j <= this.mapsize;j++) {
          if(this.levelTotalMap.levelArr[i - 1][j - 1] == 0) {
            this['pos_' + i + '-' + j +'-5'].visible = false;
            this['pos_' + i + '-' + j +'-6'].visible = false;
            this['avatar_' + i + '-' + j +'-5'].visible = false;
            this['avatar_' + i + '-' + j +'-6'].visible = false;
          }
        }
      }
      this.smallflag = 0;
    }
  }
}/*class*/

export default Map;