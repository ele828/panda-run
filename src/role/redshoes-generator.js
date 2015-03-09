var RedshoesGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	shoesArr: [],

	ctor: function(layer) {
		this.layer = layer;
		this.redshoes = new Redshoes(-100, -100);
		this.layer.addRole(this.redshoes);
		this.layer.objects.push(this.redshoes);
	},

	addRandomRedhoes: function (platform) {
		if (! platform) return;
		this.px = platform.getLastX() - parseInt(Math.random()*300+200);
		this.py = platform.getY()+200;
		if(platform.length>=0){
			// add frog
//			var redshoes = new Redshoes(this.px, this.py);
//			this.layer.addRole(redshoes);
//			this.shoesArr.push(redshoes);
//			this.layer.objects.push(redshoes);
			if(this.layer.player.sprite.getPositionX() - this.redshoes.getX() > 250) {
				this.redshoes.body.setPos(cc.p(this.px,this.py));
			}
		}
	},

	//FIXME: remove frog
	removeRedshoes: function(){
		for(var i=0; i<this.shoesArr.length; i++) {
			if(this.shoesArr[i].getShape() != null && this.shoesArr[i] != undefined) {
				if(this.layer.player.sprite.getPositionX() > this.shoesArr[i].getX() + 300){
					this.shoesArr[i].removeFromLayer();
					delete this.shoesArr[i];
					this.shoesArr.splice(i, 1);
				}
			} else {
				this.shoesArr.splice(i, 1);
			}
		}
	},

	update: function (dt) {
		//this.removeRedshoes();
	}
});