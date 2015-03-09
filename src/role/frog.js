/*
 * Frog Enemy Class
 * 
 */

var Frog = cc.Class.extend({
	
	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,
	runningSpeed: -10,
	/**
	 * Construct a new player.
	 */
	ctor: function (posX, posY) {

		this.spriteSheet = new cc.SpriteBatchNode(res.enemy.png);

		this.frogAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("enemy_frog_" + i + ".png");
				}), 0.15)
		));
		this.frogAction.retain();

		this.sprite = new cc.PhysicsSprite("#enemy_frog_1.png");
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.frogAction);
		this.sprite.retain();
		this.spriteSheet.retain();
		
		//get random speed
		this.runningSpeed = -parseInt(Math.random()*10+1);
		
		//physics
		var contentSize = this.sprite.getContentSize();
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.applyImpulse(cp.v(this.runningSpeed, 0), cp.v(0, 0));
		body.applyForce(cp.v(0, 150), cp.v(0, 0));
		body.setPos(cc.p(posX, posY));
		this.body = body;
		this.sprite.setBody(body);

		var shape = new cp.BoxShape(body, contentSize.width - 14, contentSize.height-28);
		this.shape = shape;
		this.shape.setElasticity(0);
		this.shape.setCollisionType(SpriteTag.frog);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);
	},

	/**
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet,9);
		
		this.space = space;
		space.addBody(this.body);
		space.addShape(this.shape);
	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {

//		if(this.sprite == null) return;
//		this.sprite.removeFromParent();
//		this.sprite.release();
//		this.sprite = null;
//		
//		this.space.removeShape(this.shape);
//		this.space.removeBody(this.shape.getBody());
//		this.shape = null;
		
//		this.sprite.setVisible(false);
//		setTimeout(function(){
//			this.sprite.setVisible(true);
//		}.bind(this),1000);
		var px = this.sprite.getPositionX();
		var py = this.sprite.getPositionY();
		this.action = cc.MoveTo.create(0.5, cc.p(px+30,py-300)).easing(cc.easeBackIn());
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
		return "frog";
	},
	
	getShape : function() {
		return this.shape;
	}
});