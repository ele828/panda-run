var FrogGenerator =  cc.Class.extend({
	
	layer: null,
	px: 0,
	py: 0,
	frogArr: [],
	
	ctor: function(layer) {
		this.layer = layer;

		this.frog = new Frog(-100, -100);
		this.layer.addRole(this.frog);
		this.layer.objects.push(this.frog);
	},
	
	addRandomFrog: function (platform) {
		if (! platform) return;
		this.px = platform.getLastX()-parseInt(Math.random()*180+80);
		this.py = platform.getY()+60;
		if(platform.length>=2){
			// add frog
//			var frog = new Frog(this.px, this.py);
//			this.layer.addRole(frog);
//			this.frogArr.push(frog);
//			this.layer.objects.push(frog);
			if(this.layer.player.sprite.getPositionX() - this.frog.getX() > 250) {
					this.frog.body.setPos(cc.p(this.px,this.py));
			}
		}
	},
	
	//FIXME: remove frog
	removeFrog: function(){
//		for(var i=0; i<this.frogArr.length; i++) {
//			if(this.frogArr[i].getShape() != null && this.frogArr[i] != undefined) {
//				if(this.layer.player.sprite.getPositionX() > this.frogArr[i].getX() + 300){
//					this.frogArr[i].removeFromLayer();
//					delete this.frogArr[i];
//					this.frogArr.splice(i, 1);
//				}
//			} else {
//				this.frogArr.splice(i, 1);
//			}
//		}
	},

	update: function () {
		//this.removeFrog();
	}
	
});