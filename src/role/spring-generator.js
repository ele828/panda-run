var SpringGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	springArr: [],

	ctor: function(layer) {
		this.layer = layer;
		this.spring = new Spring(-100, -100, 0.7);
		this.layer.addRole(this.spring);
		this.layer.objects.push(this.spring);
		this.springArr.push(this.spring);
	},

	addRandomSpring: function (platform) {
			if (!platform) return;
			this.px = platform.getLastX() - parseInt(Math.random()*200+200);
			this.py = platform.getY()+53;
			if(platform.length>=1){
				// add frog
//				var spring = new Spring(this.px, this.py, 0.7);
//				this.layer.addRole(spring);
//				this.springArr.push(spring);
//				this.layer.objects.push(spring);
				
				if(this.layer.player.sprite.getPositionX() - this.spring.getX() > 250) {
						this.spring.body.setPos(cc.p(this.px, this.py));
				}
			}
	},

	//FIXME: remove frog
	removeSpring: function(){
		for(var i=0; i<this.springArr.length; i++) {
			if(this.springArr[i].getShape() != null && this.springArr[i] != undefined) {
				if(this.layer.player.sprite.getPositionX() > this.springArr[i].getX() + 300){
					this.springArr[i].removeFromLayer();
					delete this.springArr[i];
					this.springArr.splice(i, 1);
				}
			} else {
				this.springArr.splice(i, 1);
			}
		}
	},

	update: function (dt) {
		this.removeSpring();
	}

});