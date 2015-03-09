/**Platform
 * @param ctor : posX,posY,length
 * length can be 0..n
 */

var Gold = cc.Class.extend({

	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,

	x: 0,
	y: 0,
	/**
	 * Construct a new player.
	 */
	ctor: function (posX, posY) {

		this.x = posX;
		this.y = posY;
		
		//cc.spriteFrameCache.addSpriteFrames(res.gold.plist);
		this.spriteSheet = new cc.SpriteBatchNode(res.gold.png);
		
		this.rotatingAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("gold" + i + ".png");
				}), 0.15)
		));
		this.rotatingAction.retain();

		this.sprite = new cc.PhysicsSprite("#gold0.png");
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.rotatingAction);
		this.sprite.retain();
		this.spriteSheet.retain();
		
		//physics
		var contentSize = this.sprite.getContentSize();
		var radius = 0.95 * this.sprite.getContentSize().width / 2;
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.applyForce(cp.v(0, 150), cp.v(0, 0));
		body.setPos(cc.p(posX, posY));
		this.body = body;
		this.sprite.setBody(body);
		body.spriteObj = this;

		this.shape = new cp.CircleShape(body, radius, cp.vzero);
		this.shape.setCollisionType(SpriteTag.gold);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);

	},

	/** 
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet, 10);

		this.space = space;
		space.addShape(this.shape);
	},
	
	initPos: function (pos) {
		this.sprite.stopAllActions();
		this.sprite.runAction(this.rotatingAction);
		this.sprite.setPosition(pos);
		this.available = true;
	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {
		var px = this.sprite.getPositionX();
		var py = this.sprite.getPositionY();
		var action = cc.MoveTo.create(0.8, cc.p(px-200,py+350)).easing(cc.easeBackIn());
		this.sprite.runAction(action);
	},
	
	getX : function() {
		return this.sprite.getPositionX();
	},

	getShape : function() {
		return this.shape;
	},
	
	getName: function() {
		return "gold";
	},
	
	onExit: function () {
//		this.sprite.release();
//		this.spriteSheet.release();
	}
}) 