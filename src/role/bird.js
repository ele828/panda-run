var Bird = cc.Class.extend({
	
	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,
	runningSpeed: -10,

	ctor: function (posX, posY) {

		this.spriteSheet = new cc.SpriteBatchNode(res.bird.png);

		this.birdAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("bird_0" + i + ".png");
				}), 0.15)
		));
		this.birdAction.retain();

		this.sprite = new cc.PhysicsSprite("#bird_01.png");
		//this.sprite.setScale(0.8);
		this.spriteSheet.addChild(this.sprite);
		this.sprite.runAction(this.birdAction);
		this.sprite.retain();
		this.spriteSheet.retain();

		//get random speed
		this.runningSpeed = -parseInt(Math.random()*30+10);

		//physics
		var contentSize = this.sprite.getContentSize();
		var body = new cp.Body(0.1, cp.momentForBox(Number.POSITIVE_INFINITY, contentSize.width, contentSize.height));
		body.applyImpulse(cp.v(this.runningSpeed, 0), cp.v(0, 0));
		body.applyForce(cp.v(0, 150), cp.v(0, 0));
		body.setPos(cc.p(posX, posY));
		this.body = body;
		this.sprite.setBody(body);

		var shape = new cp.BoxShape(body, contentSize.width - 14, contentSize.height-18);
		this.shape = shape;
		this.shape.setElasticity(0);
		this.shape.setCollisionType(SpriteTag.bird);
		//Sensors only call collision callbacks, and never generate real collisions
		this.shape.setSensor(true);
	},

	addToLayer: function(space, layer) {
		this.layer = layer;
		layer.addChild(this.spriteSheet);

		this.space = space;
		space.addBody(this.body);
		space.addShape(this.shape);
	},

	removeFromLayer: function () {
		//this.body.applyImpulse(cp.v(0, -10), cp.v(0, 0));
		//this.shape.setSensor(true);
		
//		setTimeout(function(){
////			this.sprite.removeFromParent();
////			this.sprite.release();
////			this.sprite = null;
////
////			this.space.removeShape(this.shape);
////			this.space.removeBody(this.shape.getBody());
////			this.shape = null;
//			this.body.applyImpulse(cp.v(0, 10), cp.v(0, 0));
//		}.bind(this),800);
		
//		this.sprite.setVisible(false);
//		setTimeout(function(){
//			this.sprite.setVisible(true);
//		}.bind(this),1000);
		var px = this.sprite.getPositionX();
		var py = this.sprite.getPositionY();
		this.action = cc.MoveTo.create(0.5, cc.p(px-100,py-500)).easing(cc.easeBackIn());
		this.action.retain();
		this.sprite.runAction(this.action);
	},

	getX : function() {
		return this.sprite.getPositionX();
	},
	
	getName: function() {
		return "bird";
	},

	getShape : function() {
		return this.shape;
	}
});