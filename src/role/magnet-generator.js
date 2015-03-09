var MagnetGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	magnetArr: [],

	ctor: function(layer) {
		this.layer = layer;
		this.magnet = new Magnet(-100, -100, 0.5);
		this.layer.addRole(this.magnet);
		this.layer.objects.push(this.magnet);
	},

	addRandomMagnet: function (platform) {
		if(!this.layer.player.gotMagnet) {
			if (! platform) return;
			this.px = platform.getX()+parseInt(Math.random()*180+150);
			this.py = platform.getY()+238;
			if(platform.length>=1){
				// add magnet
//				var magnet = new Magnet(this.px, this.py, 0.5);
//				this.layer.addRole(magnet);
//				this.magnetArr.push(magnet);
//				this.layer.objects.push(magnet);
				if(this.layer.player.sprite.getPositionX() - this.magnet.getX() > 250) {
					this.magnet.body.setPos(cc.p(this.px,this.py));
				}
			}
		}
	},

	//FIXME: remove frog
//	removeMagnet: function(){
//		for(var i=0; i<this.magnetArr.length; i++) {
//			if(this.magnetArr[i].getShape() != null && this.magnetArr[i] != undefined) {
//				if(this.layer.player.sprite.getPositionX() > this.magnetArr[i].getX() + 300){
//					this.magnetArr[i].removeFromLayer();
//					delete this.magnetArr[i];
//					this.magnetArr.splice(i, 1);
//				}
//			} else {
//				this.magnetArr.splice(i, 1);
//			}
//		}
//	},

	update: function (dt) {
		//this.removeMagnet();
	}

});