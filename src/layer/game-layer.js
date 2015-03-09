var GameLayer = cc.Layer.extend({

	// the physics space.
	space: null,

	// the hero sprite.
	player: null,
	
	//all objects
	objects: [],
	
	// the recognizer.
	recognizer: null,

	// virtual Pos of player on the scene.
	playerPosOfScene: {
		x: 230,
		y: 250
	},

	ctor: function(space) {
		this._super();
		this.space = space;
		
		//index init
		this.index = 0;
		this.goldInx = 0; 
		
		var winSize = cc.director.getWinSize();
		var centerPos = cc.p(winSize.width / 2-100, 400);
		
		// Role init.
		var player = this.player = new Player(centerPos.x, centerPos.y+50);
		this.addRole(player);
		
		// Event handling.
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan
		}, this);
		//this.recognizer = new SimpleTouchRecognizer();
		
//		//physic Debug
//		this._debugNode = cc.PhysicsDebugNode.create(this.space);
//		this._debugNode.setVisible(true);
//		this.addChild(this._debugNode);
		
		this.platformGenerator = new PlatformGenerator(this);
		this.goldGenerator = new GoldGenerator(this);
		this.frogGenerator = new FrogGenerator(this);
		this.birdGenerator = new BirdGenerator(this);
		this.magnetGenerator = new MagnetGenerator(this);
		this.springGenerator = new SpringGenerator(this);
		this.shoesGenerator = new ShoesGenerator(this);
		this.redshoesGenerator = new RedshoesGenerator(this);
		
		this.scheduleUpdate();
		
	},

	update: function (dt) {
		this.player.update(dt);
		
		var platform = this.platformGenerator.update(dt);
		
		if(diffDeg == 0) {
			birdChance = 1.7;
			frogChance = 1.5;
		} else if (diffDeg == 1) {
			birdChance = 1.4;
			frogChance = 1;
			if(Math.random()*2 > 1.8) {
				this.player.speedUp();
			}
		}

		//add gold randomly
		if (platform && Math.random() * 2 > 1.2) {
			this.goldGenerator.addRandomGold(platform);
		}
		
		//add frog enemy randomly
		if (platform && Math.random() * 2 > frogChance) {
			this.frogGenerator.addRandomFrog(platform);
		}
		
		if(platform && Math.random() * 2 > birdChance) {
			this.birdGenerator.addRandomBird(platform);
		}
		
		//PROP BELOW
		if(platform && Math.random() * 2 > 1.5) {
			this.magnetGenerator.addRandomMagnet(platform);
		}
		
		if(platform && Math.random() * 2 > 1.3 && !this.player.gotMagnet) {
			this.springGenerator.addRandomSpring(platform);
		}
		
		if(platform && Math.random() * 3 >0 && !this.player.gotShoes ) {
			this.shoesGenerator.addRandomShoes(platform);
		}

		if(platform && Math.random() * 2 > 1.6 && this.player.gotShoes) {
			this.redshoesGenerator.addRandomRedhoes(platform);
		}
	},
	
	//create
	addRole: function (role) {
		role.addToLayer(this.space, this);
	},
	
	//remove
	removeObjectByShape:function (shape) {
//		for (var i = 0; i < this.objects.length; i++) {
//			if (this.objects[i].getShape() == shape) {
//				this.objects[i].removeFromLayer();
//				this.objects.splice(i, 1);
//				break;
//			}
//		}
	},
	
	//Tap to jump
	onTouchBegan: function (touch, event) {
		var self = event.getCurrentTarget();
		if(self.player.status == "running"){
			self.player.jump();
		} else if( (self.player.status == "jumpUp" || self.player.status == "jumpDown") && !self.player.doubleJumpAlready) {
			self.player.doubleJump();
		}
		return true;
	},

	onTouchMoved: function (touch, event) {
//		var pos = touch.getLocation();
//		var self = event.getCurrentTarget();
//		self.player.quickDown();
//		self.recognizer.movePoint(pos.x, pos.y);
	},

	onTouchEnded: function (touch, event) {
//		var pos = touch.getLocation();
//		var self = event.getCurrentTarget();
//		
//		self.recognizer.endPoint(pos.x, pos.y);
//		
//		switch (self.recognizer.result) {
//		case 'down':
//			self.player.quickDown();
//			break;
//		case 'up':
//			self.player.doubleJump();
//			break;
//		}
	},

	getEyeX: function () {
		return this.player.sprite.getPositionX() - this.playerPosOfScene.x;
	},
	
	getEyeY: function () {
		return this.player.sprite.getPositionY() - this.playerPosOfScene.y;
	}
});