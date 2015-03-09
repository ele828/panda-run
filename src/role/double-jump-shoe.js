/**
 * The shoe that could enable hero to jump twice.
 * 
 */

var DoubleJumpShoe = cc.Class.extend({

	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,
	
	continuedTime: 5000,
	
	unavailable: false,

	x: 0,
	y: 0,
	/**
	 * Construct a new player.
	 */
	ctor: function (posX, posY, continuedTime) {
		this.x = posX;
		this.y = posY;

		this.spriteSheet = new cc.SpriteBatchNode(res.shoes.png);
		
		// set the continued time if present.
		if (continuedTime) {
			this.continuedTime = continuedTime;
		}

		this.rotatingAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([0, 1, 2, 3, 4].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("shoes_0" + i + ".png");
				}), 0.15)
		));
		this.rotatingAction.retain();

		this.sprite = new cc.PhysicsSprite("#shoes_00.png");
		this.sprite.setScale(0.4);
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.rotatingAction);
		this.sprite.retain();
		this.spriteSheet.retain();

		//physics
		var contentSize = this.sprite.getContentSize();
		var radius = 0.95 * this.sprite.getContentSize().width / 4;
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.applyForce(cp.v(0, 150), cp.v(0, 0));
		body.setPos(cc.p(posX, posY));
		body.spriteObj = this;
		this.sprite.setBody(body);
		this.body = body;

		this.shape = new cp.CircleShape(body, radius, cp.vzero);
		this.shape.setCollisionType(SpriteTag.inventory);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);
	},

	/** 
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet,5);

		this.space = space;
		space.addShape(this.shape);
	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {
		var px = this.sprite.getPositionX();
		var py = this.sprite.getPositionY();
		var action = (new cc.MoveTo(0.5, cc.p(px+200,py+300))).easing(cc.easeBackIn());
		this.sprite.runAction(action);
	},
	
	equip: function (hero, scene) {
		if (this.unavailable) return;
		this.removeFromLayer();
		hero.jump = hero.doubleJump;
		hero.addToInventory(this);
		this.unavailable = true;
		setTimeout(function () {
			hero.jump = hero.simpleJump;
			hero.removeFromInventory(this);
			this.unavailable = false;
		}.bind(this), this.continuedTime);
	},
	
	update: function (dt, hero, index) {
		if (this.unavailable) {
			var pos = cc.p(hero.sprite.getPosition());
			pos.x -= hero.sprite.height * Math.cos(index * Math.PI / 12);
			pos.y += hero.sprite.height * Math.sin(index * Math.PI / 12);
			this.sprite.setPosition(pos);
		}
	},
	
	getX: function() {
		return this.sprite.getPositionX();
	},

	getShape : function() {	
		return this.shape;
	},

	getName: function() {
		return "double-jump-shoes";
	}
});