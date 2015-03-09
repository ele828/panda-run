var GoldGenerator = cc.Class.extend({
	px : 0,
	py : 0,
	
	layer : null,
	goldArr: [],
	gold: [],
	
	ctor : function(layer) {
		this.layer = layer;
		//create all gold
		for(var i=0; i<22; i++) {
			//this.tmpgold = new Gold(-100, -100);
			this.gold[i] = new Gold(-100, -100);
			this.layer.addRole(this.gold[i]);
			this.layer.objects.push(this.gold[i]);
		}
	},

	create : function(type, platform) {
		switch(type) {
			case 0 :   //bridge shape
				var x = this.px + 200;
				var y = this.py + 140;
				var radius = Math.random()*6+5;

				for(var i=-4; i<5; i++) {
					x += 60;
					dy = -i*i*radius+100;
					//var gold = new Gold(x, y+dy);
					this.gold[4+i].body.setPos(cc.p(x, y+dy));
//					this.goldArr.push(gold);
//					this.layer.objects.push(gold);
//					this.layer.addRole(gold);
				}

				break;
			case 1 :   // rectangle shape
				var x = this.px + 130;
				var y = this.py + 150;
				
				var k = 0;
				for(var i =0; i<4; i++) {
					for(var j=0; j<3; j++) {
						this.gold[k].body.setPos(cc.p(x+i*60, y+j*60));
						++k;
//						this.goldArr.push(gold);
//						this.layer.objects.push(gold);    //collide use
//						this.layer.addRole(gold);
					}
				}
				
				break;
			case 2 :   //line
				var x = this.px + 130;
				var y = this.py + 130;
				var nums = 6;
				
				for(var i = 0; i<nums; i++) {
					this.gold[i].body.setPos(cc.p(x+i*60, y));
//					this.goldArr.push(gold);
//					this.layer.objects.push(gold);    //collide use
//					this.layer.addRole(gold);    //display
				}
			break;
			case 3 : //two lines
				var x = this.px + 130;
				var y = this.py + 110;
				var nums = 6;

				var k = 0;
				for(var i =0; i<nums; i++) {
					for(var j=0; j<2; j++) {
						this.gold[k].body.setPos(cc.p(x+i*60, y+j*50));
						++k;
//						this.goldArr.push(gold);
//						this.layer.objects.push(gold);    //collide use
//						this.layer.addRole(gold);    //display
					}
				}
			break;
			case 4 : //two bridges
				var x = this.px + 200;
				var y = this.py + 140;
				var radius = Math.random()*5+5;

				for(var i=-4; i<5; i++) {
					x += 60;
					dy = -i*i*radius+100;
//					var gold = new Gold(x, y+dy);
					this.gold[i+4].body.setPos(cc.p(x, y+dy));
//					this.goldArr.push(gold);
//					this.layer.objects.push(gold);
//					this.layer.addRole(gold);
					
					dy2 = -i*i*radius+150;
					//var gold = new Gold(x, y+dy2);
					this.gold[i+13].body.setPos(cc.p(x, y+dy2));
//					this.goldArr.push(gold);
//					this.layer.objects.push(gold);
//					this.layer.addRole(gold);
				}
				break;
			case 5 : //triangle shape
				var x = this.px + 220;
				var y = this.py + 130;
				var dx = 0;
				var dy = 0;
				
				var k =0;
				for(var i = 0; i < 6; i++) {
					dy = i*40;
					dx = 25*i;
					for(var j =0; j<6-i; j++) {
						//var gold = new Gold(x+dx+j*50, y+dy);
						this.gold[k].body.setPos(cc.p(x+dx+j*50, y+dy));
						++k;
//						this.goldArr.push(gold);
//						this.layer.objects.push(gold);    //collide use
//						this.layer.addRole(gold);    //display
					}
				}
			break;
			case 6 : ////prismatic shape
				var x = this.px + 200;
				var y = this.py + 120;
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
//						var gold = new Gold(x+ offsetLeft + 60*j, y+dy);
						this.gold[k].body.setPos(cc.p(x+ offsetLeft + 60*j, y+dy));
						++k;
//						this.goldArr.push(gold);
//						this.layer.objects.push(gold);    //collide use
//						this.layer.addRole(gold);    //display
					}
				}
			break;
				
			default:break;
				
		}
		
	},
	
	removeGold : function() {
//			for(var i=0; i<this.goldArr.length; i++) {
//				if(this.goldArr[i].getShape() != null && this.goldArr[i] != undefined) {
//					if(this.layer.player.sprite.getPositionX() > this.goldArr[i].getX() + 300){
//						this.goldArr[i].removeFromLayer();
//						delete this.goldArr[i];
//						this.goldArr.splice(i, 1);
//					}
//				} else {
//					this.goldArr.splice(i, 1);
//				}
//			}
	},
	
	addRandomGold: function (platform) {
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
	
	update: function (dt) {
		//this.removeGold();
//		cc.log(this.gold[0].sprite.getPositionY());
//		cc.log(this.gold[0].sprite.getPositionX());
	},
	
	onExit: function () {
		this.gold.forEach(function (g) {
			g.onExit();
		});
	}
}); 