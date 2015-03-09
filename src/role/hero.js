var Hero = cc.Class.extend({

	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,

	// animations.
	runningAction: null,
	jumpUpAction: null,
	jumpDownAction: null,

	// the status.
	status: 'running',

	// player speed.
	runningSpeed: 2500,
	stars: null,
	
	x: 0,
	y: 0,
	
	inventory: [],
	
	scaleOne: 0,
	gotMagnet: false,
	gotShoes: false,
	gotRedshoes: false,
	speedX: 0,
	doubleJumpAlready: false,
	
	/**
	 * Construct a new player.
	 */
	ctor: function (x, y) {
		this.x = x;
		this.y = y;
		// cc.spriteFrameCache.addSpriteFrames(res.panda.plist);
		this.spriteSheet = new cc.SpriteBatchNode(res.panda.png);

		this.runningAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("panda_run_0" + i + ".png");
				}), 0.05)
		));
		this.runningAction.retain();

		this.jumpUpAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("panda_jump_0" + i + ".png");
				}), 0.08)
		));	
		this.jumpUpAction.retain();

		this.jumpDownAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("panda_roll_0" + i + ".png");
				}), 0.08)
		));
		this.jumpDownAction.retain();

		this.sprite = new cc.PhysicsSprite("#panda_run_01.png");
		this.spriteSheet.addChild(this.sprite);

		var contentSize = this.sprite.getContentSize();

		var body = new cp.Body(5, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.setPos(cc.p(x, y));
		body.applyImpulse(cp.v(this.runningSpeed, 0), cp.v(0, 0));
// body.applyForce(cp.v(0, 7500), cp.v(0, 0));
		body.spriteObj = this;
		this.body = body;
		this.sprite.setBody(body);

		var shape = new cp.BoxShape(body, contentSize.width - 14, contentSize.height-10);
		this.shape = shape;
		this.shape.setCollisionType(SpriteTag.player);
		this.shape.setElasticity(1);

		this.sprite.runAction(this.runningAction);
		this.status = "running";
		this.sprite.retain();
		this.spriteSheet.retain();
	},

	/**
	 * Called by layer initialization.
	 * 
	 * @param space
	 *            the physics space.
	 * @param layer
	 *            the game layer.
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet);

		this.space = space;
		space.addBody(this.body);
		space.addShape(this.shape);

		// jump effect init
// this.stars = cc.ParticleSystem(res.particle.stars);
// this.stars.setPosition(100, 100);
// this.layer.addChild(this.stars,3);

	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {
		// TODO: do some cleanups.
// this.runningAction.release();
// this.jumpUpAction.release();
// this.jumpDownAction.release();

	},
	
	addToInventory: function (object) {
		this.inventory.push(object);
	},
	
	removeFromInventory: function(object) {
		var inventory = this.inventory;
		for (var i=0; i<inventory.length; i++) {
			if (inventory[i] == object) {
				inventory.splice(i, 1);
				break;
			}
		}
	},

	/**
	 * Called by layer update.
	 * 
	 * @param dt
	 *            delta time.
	 */
	update: function (dt) {
		// update the jump action.
		var vel = this.body.getVel();
		if (this.status.startsWith('jump')) {
			if (this.status.endWith('down')) {
				if (vel.y == 0) {
					this.status = 'running';
					this.sprite.stopAllActions();
					this.sprite.runAction(this.runningAction);
				}
			} else if (vel.y < 0.1) {
				this.status = this.status.slice(0, 7) + 'down';
				this.sprite.stopAllActions();
				this.sprite.runAction(this.jumpDownAction);
			}
		}
		
		for (var i=0; i<this.inventory.length; i++) {
			var inv = this.inventory[i];
			if (inv.update) {
				inv.update(dt, this, i+1);
			}
		}

		// move magnet
		if(this.gotMagnet) {
			this.moveMagnet();
		}
	}, 

	/**
	 * Trigger a jump action.
	 */
	jump: function () {
		this.simpleJump();
	},
	
	simpleJump: function() {
		this.isJump = true;
		if (this.status == 'running') {
			this.body.applyImpulse(cp.v(0, 4000), cp.v(0, 0));
			this.status = 'jump-1-up';
			this.sprite.stopAllActions();
			this.sprite.runAction(this.jumpUpAction);
		}
	},

	doubleJump: function () {
		switch (this.status) {
		case 'running':
			this.body.applyImpulse(cp.v(0, 4000), cp.v(0, 0));
			this.status = 'jump-1-up';
			this.sprite.stopAllActions();
			this.sprite.runAction(this.jumpUpAction);
			break;
		case 'jump-1-up':
		case 'jump-1-down':
			this.body.applyImpulse(cp.v(0, 2500), cp.v(0, 0));
			this.status = 'jump-2-up';
			this.sprite.stopAllActions();
			this.sprite.runAction(this.jumpUpAction);
			break;
		}
	},

	quickDown: function () {
		if (this.status.startsWith('jump')) {
			this.body.applyImpulse(cp.v(0, -150), cp.v(0, 0));
			this.status = 'quick-down';
			this.sprite.stopAllActions();
			this.sprite.runAction(this.jumpUpAction);
		}
	},

	speedUp : function() {
		this.speedX = 5;
		this.body.applyImpulse(cp.v(this.speedX, 0), cp.v(0, 0));
	},

	getX : function() {
		return this.sprite.getPositionX();
	},

	died: function() {
		this.shape.setSensor(true);
		this.body.applyImpulse(cp.v(0, 4000), cp.v(0, 0));
		this.body.applyImpulse(cp.v(-this.runningSpeed, 0), cp.v(0, 0));
	},

	getMagnet: function() {
// this.magnet = new Magnet(0, 0, 0.2);
// this.magnet.addToLayer(null, this.layer);
		this.gotMagnet = true;	
	},

	loseMagnet: function(){
		this.gotMagnet = false;
	},

	moveMagnet: function() {
		// this.magnet.sprite.setPosition(cc.p(this.layer.player.sprite.getPositionX()-20,
		// this.layer.player.sprite.getPositionY()+50));
	},

	getSpring: function() {
		if(this.status == "running") {
			this.body.applyImpulse(cp.v(1500, 5000), cp.v(0, 0));
			this.body.applyForce(cp.v(0, 500), cp.v(0, 0));
		} else if (this.status == "jumpDown") {
			this.body.applyImpulse(cp.v(1500, 6000), cp.v(0, 0));
			this.body.applyForce(cp.v(0, 500), cp.v(0, 0));
		}
	},

	loseSpring: function() {
		this.body.applyImpulse(cp.v(-1500, 1000), cp.v(0, 0));
		this.body.applyForce(cp.v(0, -500), cp.v(0, 0));
	},

	getShoesAndSpeedUp: function() {
		this.body.applyImpulse(cp.v(500, 0), cp.v(0, 0));
		this.body.applyForce(cp.v(0, 200), cp.v(0, 0));
		this.gotShoes = true;
	},

	getRedshoesAndSlowDown: function() {
		this.body.applyImpulse(cp.v(-500, 0), cp.v(0, 0));
		this.body.applyForce(cp.v(0, -500), cp.v(0, 0));
		this.gotRedshoes = true;
		this.gotShoes = false;
	}
}) 