import Tile from "./sprites/tile";

class TilesManager {

  constructor(game) {

    this.game = game;

    this.initialize();


  }
  initialize()
  {
    this.tilesCount = 0;
    this.isoMetric = true;
  }

  addTiles(Address)
  {
/*    var ads = Address.split("-");
    var city = ads[0].split("_")[1];
    var street = ads[1];
    var port = ads[2];*/

    var type;
    var x;
    var y;

    var w = this.game.tileWidth; // 128
    var h = this.game.tileHeight; // 73
    var levelArr = this.game.levelData.levelArr;

    var startX = 1000 + 133; //sidebar_width plus
    var startY = 100;
    var angle = 30*Math.PI/180;
    var originx = startX;
    var originy = startY;

    for(var l = 1;l <= 3;l++) {
      startX = originx + 64;
      startY = originy - h/2;
      for (var k = 1;k <= 3;k++) {
        startX = startX - 64;
        startY = startY + h/2;
        for (var j = 0; j < 50; j++)
        {
          if(k == 1 && j == 1 && i == 50) {
            originx = startX + 50 * h * Math.cos(angle);
            originy = startY + 50 * h * Math.sin(angle);
          }
          if(j > 0)
          {
            startX = startX - 64;
            startY = startY + h/2;
          }
          for (var i = 0; i < 50; i++) {
            x = startX + i * h * Math.cos(angle);
            y = startY + i * h * Math.sin(angle);
            if(l == 1 && k == 1)
              type = this.game.levelData.levelArr[j][i];
            else if(l == 1 && k == 2)
              type = this.game.levelData.levelArr_x_1[j][i];
            else if(l == 1 && k == 3)
              type = this.game.levelData.levelArrBottomLeftEdge[j][i];
            else if(l == 2 && k == 1)
              type = this.game.levelData.levelArr_1_x[j][i];
            else if(l == 2 && k == 2)
              type = this.game.levelData.levelArr_2_2[j][i];
            else if(l == 2 && k == 3)
              type = this.game.levelData.levelArr_2_3[j][i];
            else if(l == 3 && k == 1)
              type = this.game.levelData.levelArr_3_1[j][i];
            else if(l == 3 && k == 2)
              type = this.game.levelData.levelArr_3_2[j][i];
            else if(l == 3 && k == 3)
              type = this.game.levelData.levelArr_3_3[j][i];
            if(i < 30 && j < 30)  //Grand Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '1', l, k);
            else if(i >= 30 && j < 30) //Big Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '2', l, k);
            else if(i < 20 && j >= 30) //Medium Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '3', l, k);
            else if(i >= 20 && i < 40 && j >= 30) //Medium Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '4', l, k);
            else if(i >= 40 && j >= 30 && j < 40) //Small Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '5', l, k);
            else if(i >= 40 && j >= 40) //Small Land
              this.addTile(x,y,type,i,j,l + '-' + k + '-' + '6', l, k);
          }
        }
      }
    }

  }/* addTiles */

  addTile(x,y,type,i,j, position_string, l, k)
  {
    var tile = new Tile(this.game,x,y,type,position_string, l, k);

    tile.m = i;
    tile.n = j;

//      var tileId = tile.n.toString() + tile.m.toString();
    if(l == 2 && k == 2) {
      var tileId;

      tile.sno = this.tilesCount;
      this.tilesCount++;

      if(tile.n >= 0 && tile.n < 10)
        tileId = '0' + tile.n.toString();
      else
        tileId = tile.n.toString();
      if(tile.m >= 0 && tile.m < 10)
        tileId += '0' + tile.m.toString();
      else
        tileId += tile.m.toString();
  
      this.game['tile_'+tileId] = tile;
    }
    else
      tile.setTint(0x2d2d2d);
  }
} /*class*/

export default TilesManager;