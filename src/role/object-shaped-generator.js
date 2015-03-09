var ObjectShapedGenerator = cc.Class.extend({

	px : 0,
	py : 0,
	
	objectGeneratorFunc: null,

	layer : null,
	gold: [],

	ctor : function(layer, objectGeneratorFunc) {
		if (! objectGeneratorFunc) {
			objectGeneratorFunc = function(x, y) {
				return new Gold(x, y);
			}
		}
		
		this.objectGeneratorFunc = objectGeneratorFunc;
		this.layer = layer;
		//create all gold
		for(var i=0; i<22; i++) {
			//this.tmpgold = new Gold(-100, -100);
			this.gold[i] = objectGeneratorFunc(-100, -100);
			this.layer.addRole(this.gold[i]);
			this.layer.objects.push(this.gold[i]);
		}
	},

	create : function(type, platform) {
		var x, y, dy, dy2;
		switch(type) {
		case 0 :   //bridge shape
			x = this.px + 200;
			y = this.py + 140;
			var radius = Math.random()*6+5;

			for(var i=-4; i<5; i++) {
				x += 60;
				dy = -i*i*radius+100;
				this.gold[4+i].initPos(cc.p(x, y+dy));
			}

			break;
		case 1 :   // rectangle shape
			x = this.px + 130;
			y = this.py + 150;

			var k = 0;
			for(var i =0; i<4; i++) {
				for(var j=0; j<3; j++) {
					this.gold[k].initPos(cc.p(x+i*60, y+j*60));
					++k;
				}
			}

			break;
		case 2 :   //line
			x = this.px + 130;
			y = this.py + 130;
			var nums = 6;

			for(var i = 0; i<nums; i++) {
				this.gold[i].initPos(cc.p(x+i*60, y));
			}
			break;
		case 3 : //two lines
			x = this.px + 130;
			y = this.py + 110;
			var nums = 6;

			var k = 0;
			for(var i =0; i<nums; i++) {
				for(var j=0; j<2; j++) {
					this.gold[k].initPos(cc.p(x+i*60, y+j*50));
					++k;
				}
			}
			break;
		case 4 : //two bridges
			x = this.px + 200;
			y = this.py + 140;
			var radius = Math.random()*5+5;

			for(var i=-4; i<5; i++) {
				x += 60;
				dy = -i*i*radius+100;
				this.gold[i+4].initPos(cc.p(x, y+dy));

				dy2 = -i*i*radius+150;
				this.gold[i+13].initPos(cc.p(x, y+dy2));
			}
			break;
		case 5 : //triangle shape
			x = this.px + 220;
			y = this.py + 130;
			var dx = 0;
			var dy = 0;

			var k =0;
			for(var i = 0; i < 6; i++) {
				dy = i*40;
				dx = 25*i;
				for(var j =0; j<6-i; j++) {
					this.gold[k].initPos(cc.p(x+dx+j*50, y+dy));
					++k;
				}
			}
			break;
		case 6 : ////prismatic shape
			x = this.px + 200;
			y = this.py + 120;
			var k = 0;
			for(var i=0; i<7; i++){
				dy = i*35; 
				if(i<4) {
					var nums = i+1;
					var offsetLeft = (3-i)*30;
				}else{
					var nums = 7-i;
					var offsetLeft = (i-3)*30;
				}
				for(var j=0; j<nums; j++) {
					this.gold[k].initPos(cc.p(x+ offsetLeft + 60*j, y+dy));
					++k;
				}
			}
			break;
		}

	},

	generate: function (platform) {
		if (! platform) return;
		if(platform.length <=1 ){
			return;
		}
		this.px = platform.getX();
		this.py = platform.getY();
		var randType = parseInt(Math.random() * 7);
		//this.create(randType, platform);
		if(this.layer.player.sprite.getPositionX() - this.gold[0].getX() > 800) {
			this.create(randType, platform);
		}
	},
	
	cleanup: function () {
		this.gold.forEach(function (g) {
			if (g.onExit) {
				g.onExit();
			}
		});
	}
}); 