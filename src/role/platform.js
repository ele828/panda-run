/**Platform
 * @param ctor : posX,posY,length
 * length can be 0..n
 */

var Platform = cc.Class.extend({

	// renderer related.
	spriteSheet: null,
	sprite: null,

	// physics related.
	space: null,
	body: null,
	shape: null,
	
	//platform
	platform: null,
	length : 0,
	width: null,

	/**
	 * Construct a new player.
	 */
	ctor: function (boardX, boardY, length) {
		this.length = length;

		//cc.spriteFrameCache.addSpriteFrames(res.platform.plist);
		this.spriteSheet = new cc.SpriteBatchNode(res.platform.png);
		
		//create platform
		this.platform = new cc.PhysicsSprite(cc.spriteFrameCache.getSpriteFrame("platform_"+ length +".png"));
		this.platform.retain();
		this.spriteSheet.addChild(this.platform);
		this.spriteSheet.retain();
		
		var cSize = this.platform.getContentSize();
		this.width = cSize.width;
		boardX += cSize.width/2;
		
		var body = new cp.StaticBody();
		body.setPos(cc.p(boardX, boardY));
		this.platform.setBody(body);
 
		this.shape = new cp.BoxShape(body, cSize.width, cSize.height );
		this.shape.setElasticity(0);
		this.shape.setCollisionType(SpriteTag.platform);
	},

	/**
	 * Called by layer initialization.
	 * 
	 */
	addToLayer: function(space, layer) {
		this.layer = layer;
		this.space = space;
		layer.addChild(this.spriteSheet);
		this.space.addStaticShape(this.shape);
	},

	/**
	 * Called by layer cleanup.
	 */
	removeFromLayer: function () {
		this.space.removeShape(this.shape);
//		this.shape = null;
//		
		this.platform.removeFromParent();
//		this.platform.release();
//		
		this.spriteSheet.removeFromParent();
//		this.spriteSheet.release();
//		this.spriteSheet = null;
	},
	
	getLastX: function() {
		return this.platform.getPositionX() + this.width / 2;
	},
	
	getX: function() {
		return this.platform.getPositionX() - this.width / 2;
	},
	
	getY: function() {
		return this.platform.getPositionY();
	}
}) 