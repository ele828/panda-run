var ObjectRandomGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	objArr: [],
	opt: null,
	previousX: 0,

	ctor: function(layer, generatorFunc, opt) {
		this.layer = layer;
		
		if (! generatorFunc) {
			var shoe = new DoubleJumpShoe(-100, -100);
			generatorFunc = function(x, y) {
				shoe.sprite.setPosition(cc.p(x, y));
				return shoe;
			};
		}
		this.generatorFunc = generatorFunc;

		// process the options.
		this.opt = opt || {
			height: 200,
			gap: 250
		};
		
		this.obj = generatorFunc(-100, -100);
		this.layer.addRole(this.obj);
		this.layer.objects.push(this.obj);
	},

	generate: function (platform, hero) {
		if (! platform || this.obj.unavailable) return;
		
		this.px = platform.getLastX() - parseInt(Math.random()*300+200);
		this.py = platform.getY() + this.opt.height;
		if(platform.length >= 0) {
			if(this.layer.player.sprite.getPositionX() - this.obj.sprite.getPosition().x > this.opt.gap) {
				this.obj = this.generatorFunc(this.px, this.py);
				this.previousX = this.px;
//				this.layer.objects.push(this.obj);
			}
		}
	},
	
	cleanup: function(){
		for(var i=0; i<this.objArr.length; i++) {
			if(this.objArr[i].getShape() != null && this.objArr[i] != undefined) {
				if(this.layer.player.sprite.getPositionX() > this.objArr[i].getX() + 300){
					this.objArr[i].removeFromLayer();
					delete this.objArr[i];
					this.objArr.splice(i, 1);
				}
			} else {
				this.objArr.splice(i, 1);
			}
		}
	}
});