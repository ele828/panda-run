var ObjectIOGenerator =  cc.Class.extend({

	layer: null,
	px: 0,
	py: 0,
	objArr: [],
	opt: null,
	previousX: 0,
	posStack: [],
	
	sioclient: null,

	ctor: function(layer, channel, generatorFunc) {
		this.layer = layer;
		
		var posStack = this.posStack;
		var sioclient = this.sioclient = SocketIO.connect("127.0.0.1:8080");
		sioclient.on('connect', function(socket) {
			cc.log('connected.');
		});
		sioclient.on(channel, function (data) {
			data = JSON.parse(data);
			posStack.push(data.args[0]);
		});
		sioclient.on('error', function(err) {
			// TODO Exit!
		});

		if (! generatorFunc) {
			var shoe = new DoubleJumpShoe(-100, -100);
			generatorFunc = function(x, y) {
				shoe.unavailable = false;
				shoe.sprite.setPosition(cc.p(x, y));
				return shoe;
			};
		}
		this.generatorFunc = generatorFunc;

		this.obj = generatorFunc(-100, -100);
		this.layer.addRole(this.obj);
		this.layer.objects.push(this.obj);
	},

	generate: function (platform, hero) {
		if (! platform || this.obj.unavailable) return;
		var pos = this.posStack.pop();
		if (!pos) return;
		this.px = pos.x;
		this.py = pos.y;
		this.obj = this.generatorFunc(this.px, this.py);
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
		this.sioclient.close();
	}
});