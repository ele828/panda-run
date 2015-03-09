var PlatformGenerator = cc.Class.extend({
	
	layer: null,
	platformGeneratorFunc: null,
	platformArr : [],
	lastPlatform: null,
	
	ctor : function(layer, more, platformGeneratorFunc, pos) {
		this.layer = layer;
		
		// Check the position.
		if (!pos) {
			var winSize = cc.director.getWinSize();
			pos = {
					x: winSize.width / 2,
					y: winSize.height / 2 - 50
			};
		}
		
		// Check the generator func.
		if (!platformGeneratorFunc) {
			platformGeneratorFunc = function (x, y, length) {
				return new Platform(x, y, length);
			};
		}
		
		this.platformGeneratorFunc = platformGeneratorFunc;
		
		var platform = this.platformGeneratorFunc(pos.x, pos.y, 2);
		layer.addRole(platform);
		this.platformArr.push(platform);
		
		if (more) {
			this.generate(platform.getLastX());
		}
	},
	
	generate: function (x, y) {
		var gap = parseInt(Math.random()*200+100); //100~200
		var height = parseInt(Math.random()*150+100) //100~300
		var block = parseInt(Math.random()*4);

		var platform = this.platformGeneratorFunc(x + gap, height, block);

		this.layer.addRole(platform);
		this.platformArr.push(platform);
		
		return this.lastPlatform = platform;
	},
	
	update: function () {
		var layer = this.layer;
		var i = 0;
		var winSize = cc.director.getWinSize();
		
		for (i = 0; i<this.platformArr.length; i++) {
			if (layer.getEyeX() - this.platformArr[i].getLastX() < 0) {
				break;
			} else if(this.platformArr[i] != undefined) {
				this.platformArr[i].removeFromLayer();
			}
		}

		this.platformArr.splice(0, i);
		
		var mostX = this.platformArr[this.platformArr.length - 1].getLastX();
		if (mostX < layer.getEyeX() + winSize.width) {
			return this.generate(mostX);
		}
		
//		cc.log("Lenght: " + this.platformArr.length);
		
		return null;
	}
});