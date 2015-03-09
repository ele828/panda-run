var Spring = cc.Class.extend({
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
	ctor: function (posX, posY, scale) {

		this.x = posX;
		this.y = posY;

		this.spriteSheet = new cc.SpriteBatchNode(res.spring.png);

		this.springAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("block-bounce-stone0" + i + ".png");
				}), 0.15)
		));
		this.springAction.retain();

		this.sprite = new cc.PhysicsSprite("#block-bounce-stone01.png");
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.springAction);
		this.sprite.retain();
		this.spriteSheet.retain();

		//physics
		var contentSize = this.sprite.getContentSize();
		var radius = 0.95 * this.sprite.getContentSize().width / 4;
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.setPos(cc.p(posX, posY));
		this.sprite.setBody(body);
		this.body = body;
		
		this.shape = new cp.CircleShape(body, radius, cp.vzero);
		this.shape.setCollisionType(SpriteTag.spring);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);
	},

	/**
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet,10);

		this.space = space;
			//space.addBody(this.body);
		space.addShape(this.shape);
	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {

//		this.sprite.removeFromParent();
//		this.sprite.release();
//		this.sprite = null;
//		
//		if(this.space != null){
//			this.space.removeShape(this.shape);
//			//this.space.removeBody(this.shape.getBody());
//			this.shape = null;
//		}

	},

	getX : function() {
		return this.sprite.getPositionX();
	},

	getName: function() {
		return "spring";
	},

	getShape : function() {
		return this.shape;
	}
});