import Phaser from 'phaser';

class SideBar extends Phaser.GameObjects.Container {

	constructor(scene,x=0,y=0)
	{
		super(scene,x,y);

    this.game = scene;

    this.initalize();

    this.setBar();

	}

  initalize()
  {
    this.cX = this.game.cX;
		this.cY = this.game.cY;
		this.gW = this.gW;
		this.gH = this.gH;

    this.game.add.existing(this);
  }

  setBar()
  {
    var verticalBar = this.game.add.sprite(0,0,'vertical-bar');
    verticalBar.setOrigin(0);
    this.add(verticalBar);

    verticalBar.alpha = 0.95;

		this.addButtons();

  }
	addButtons()
	{
		var i = 0;
		var yArr = [80,240,440,630,800,980];
		var str = "";
		var n = 1;

		for(i = 0; i < 3; i++)
		{
			if(n === 4) {	n = 1; }
			str = "building" + n.toString();
			n++;

      this.addBuildingButton(yArr[i],str);

		}
	}

	addBuildingButton(y,str)
	{
		var buildingBtn = this.game.add.sprite(60,y,str);
		this.add(buildingBtn);

		buildingBtn.setScale(0.4);
		buildingBtn.setInteractive({useHandCursor:true});
		buildingBtn.on('pointerdown',() => { this.onBuildingDown(buildingBtn); },this);
		buildingBtn.type = str;
	}
	onBuildingDown(buildingBtn)
	{
		console.log(buildingBtn);
		console.log("onBuildingDown");
		if(this.game.isBuildingSelected === true) { return; }
		if(this.game.mapTweenFlag === true) { return; }

    buildingBtn.alpha = 0.5;
		buildingBtn.setScale(0.45);

		this.game.addBuilding(buildingBtn);

	}

	resetBuildingButton(buildingBtn)
	{
		buildingBtn.alpha = 1;
		buildingBtn.setScale(0.4);
	}

}/* class */

export default SideBar;