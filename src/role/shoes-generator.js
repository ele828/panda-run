var ShoesGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	shoesArr: [],

	ctor: function(layer) {
		this.layer = layer;

		this.shoes = new Shoes(-100, -100);
		this.layer.addRole(this.shoes);
		this.layer.objects.push(this.shoes);
	},

	addRandomShoes: function (platform) {
		if (! platform) return;
		this.px = platform.getLastX() - parseInt(Math.random()*300+200);
		this.py = platform.getY()+200;
		if(platform.length>=0){
			// add frog
//			var shoes = new Shoes(this.px, this.py);
//			this.layer.addRole(shoes);
//			this.shoesArr.push(shoes);
//			this.layer.objects.push(shoes);
			if(this.layer.player.sprite.getPositionX() - this.shoes.getX() > 250) {
					this.shoes.body.setPos(cc.p(this.px,this.py));
					this.layer.objects.push(this.shoes);
			}
		}
	},

	//FIXME: remove frog
	removeShoes: function(){
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
		//this.removeShoes();
		cc.log(this.shoes.body);
	}
});