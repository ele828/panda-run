var BirdGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	birdArr: [],

	ctor: function(layer) {
		this.layer = layer;

		this.bird = new Bird(-100, -100);

		this.layer.addRole(this.bird);
		this.layer.objects.push(this.bird);
	},

	addRandomBird: function (platform) {
		if (! platform) return;
		this.px = platform.getLastX()-parseInt(Math.random()*180+80);
		this.py = platform.getY()+250;
		if(platform.length>=1){
			// add frog
//			var bird = new Bird(this.px, this.py);
//			this.layer.addRole(bird);
//			this.birdArr.push(bird);
//			this.layer.objects.push(bird);
			if(this.layer.player.sprite.getPositionX() - this.bird.getX() > 250) {
				this.bird.body.setPos(cc.p(this.px, this.py));
				cc.audioEngine.playEffect(res.sound.alert);
			}
		}
	},

	removeBird: function(){
//		for(var i=0; i<this.birdArr.length; i++) {
//			if(this.birdArr[i].getShape() != null && this.birdArr[i] != undefined) {
//				if(this.layer.player.sprite.getPositionX() > this.birdArr[i].getX() + 300){
//					this.birdArr[i].removeFromLayer();
//					delete this.birdArr[i];
//					this.birdArr.splice(i, 1);
//				}
//			} else {
//				this.birdArr.splice(i, 1);
//			}
//		}
	},

	update: function () {
		//this.removeBird();
	}

});