"use strict";

class LandsManager {

	constructor(game)
	{
    this.game = game;
	}

	setLand() {
/*		this.setGrandLand();
		this.setBigLand();
		this.setMediumLand();
		this.setSmallLand();*/
	}

	setGrandLand() {
		for(var i = 0;i < 30;i++) {
			for(var j = 0;j < 30;j++) {
				var position_string = this.game['tile_' + '00' + i + '00' + j].getData('position');
				console.log(this.game['tile_' + '00' + i + '00' + j].getData('position'));
				this.game['tile_' + '00' + i + '00' + j].setData('position', position_string + '-1');
				console.log(this.game['tile_' + '00' + i + '00' + j].getData('position'));
//				this.game['tile_' + '00' + i + '00' + j].setTint(0xff0000);
			}
		}
	}

	setBigLand() {
		for(var i = 0;i < 30;i++) {
			for(var j = 30;j < 50;j++) {
				this.game['tile_' + '00' + i + '00' + j].setTint(0xff0ff);
			}
		}
	}

	setMediumLand() {
		for(var i = 30;i < 50;i++) {
			for(var j = 0;j < 20;j++) {
				this.game['tile_' + '00' + i + '00' + j].setTint(0x303000);
			}
		}
		for(var i = 30;i < 50;i++) {
			for(var j = 20;j < 40;j++) {
				this.game['tile_' + '00' + i + '00' + j].setTint(0x500555);
			}
		}
	}

	setSmallLand() {
		for(var i = 30;i < 40;i++) {
			for(var j = 40;j < 50;j++) {
				this.game['tile_' + '00' + i + '00' + j].setTint(0xAAAAAA);
			}
		}
		for(var i = 40;i < 50;i++) {
			for(var j = 40;j < 50;j++) {
				this.game['tile_' + '00' + i + '00' + j].setTint(0xAA00AA);
			}
	}	}
}

export default LandsManager;