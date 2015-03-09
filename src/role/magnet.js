var Magnet = cc.Class.extend({
	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,
	runningSpeed: -10,
	
	x: 0,
	y: 0,
	/**
	 * Construct a new player.
	 */
	ctor: function (posX, posY, scale) {
		
		this.x = posX;
		this.y = posY;
		
		this.spriteSheet = new cc.SpriteBatchNode(res.magnet.png);

		this.magnetAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("magnet_0" + i + ".png");
				}), 0.08)
		));
		this.magnetAction.retain();

		this.sprite = new cc.PhysicsSprite("#magnet_01.png");
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.magnetAction);
		this.sprite.retain();
		this.spriteSheet.retain();

		//physics
		var contentSize = this.sprite.getContentSize();
		var radius = 0.95 * this.sprite.getContentSize().width / 4;
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.applyForce(cp.v(0, 150), cp.v(0, 0));
		body.setPos(cc.p(posX, posY));
		this.sprite.setBody(body);
		this.body = body;

		this.shape = new cp.CircleShape(body, radius, cp.vzero);
		this.shape.setCollisionType(SpriteTag.magnet);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);
	},

	/**
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet);

		if(space != null){
			this.space = space;
			//space.addBody(this.body);
			space.addShape(this.shape);
		}
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
//			this.shape = null;
//		}
//		this.sprite.setVisible(false);
//		setTimeout(function(){
//			this.sprite.setVisible(true);
//		}.bind(this),1000);
		var px = this.sprite.getPositionX();
		var py = this.sprite.getPositionY();
		this.action = cc.MoveTo.create(0.5, cc.p(px+200,py+300)).easing(cc.easeBackIn());
		this.action.retain();
		this.sprite.runAction(this.action);
//		setTimeout(function(){
//			this.sprite.stopAction(this.action);
//		}.bind(this), 500);
	},

	getX : function() {
		return this.sprite.getPositionX();
	},
	
	getName: function() {
		return "magnet";
	},

	getShape : function() {
		return this.shape;
	}
});