import Phaser from 'phaser';

class Player extends Phaser.GameObjects.Sprite {

	constructor(scene,playerInfo,tileId,n, m, x=0, y=0, fno=8)
	{

		super(scene,x,y,'avatar',fno);

    this.game = scene;
		this.playerInfo = playerInfo;
		this.tileId = tileId;
		this.x = x;
		this.y = y;
		this.m = m;
		this.n = n;

		this.walkFlag = false;
		this.movingFlag = false;
    this.pathXY = [];

    this.initialize();
	}
  initialize()
  {
		this.add();

		this.addEvents();
  }
	add()
	{
    this.game.add.existing(this);
		this.isSelected = true;

//		var tileId = 'tile_' + this.n.toString() + this.m.toString();

//		this.sno = this.game[this.tileId].sno;
		if(this.x == 0 && this.y == 0) {
			this.x = this.game[this.tileId].x;
			this.y = this.game[this.tileId].y - 25;	
		}
		this.bubble = undefined;
		this.chatContent = undefined;
	}

	addEvents()
	{
		this.setInteractive({useHandCursor:true});
    this.on('pointerup',this.onPlayerClick,this);
	}
	onPlayerClick()
	{
		if(this.game.isBuildingSelected === true) { return; }
		if(this.game.mapTweenFlag === true) { return; }

		this.isSelected = true;
	}
}

export default Player;