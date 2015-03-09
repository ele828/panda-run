/**
 * select which mode to play
 */
var GameModeLayer = cc.Layer.extend({
	
	ctor: function() {
		this._super();
		var winsize = cc.director.getWinSize();
		this.draw = new cc.DrawNode();
		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
		this.addChild(this.draw, 4, 1);

		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){return true;},
		}, this.draw);
		this.board = new cc.Sprite(res.mode.board);
		this.board.setPosition(cc.p(winsize.width/2, winsize.height));
		this.addChild(this.board,10);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.board.runAction(actionTo);
		
		this.modeone = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.mode.mode1),
				new cc.Sprite(res.mode.mode1),
				this.relaxMode, this));
		this.modeone.setPosition(cc.p(winsize.width/2-120, winsize.height+30));
		this.addChild(this.modeone, 11);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2-120, winsize.height/2)).easing(cc.easeElasticOut());
		this.modeone.runAction(actionTo);
		
		this.modetwo = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.mode.mode2),
				new cc.Sprite(res.mode.mode2),
				this.relayMode, this));
		this.modetwo.setPosition(cc.p(winsize.width/2+120, winsize.height+30));
		this.addChild(this.modetwo, 11);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2+120, winsize.height/2)).easing(cc.easeElasticOut());
		this.modetwo.runAction(actionTo);
	},
	
	relaxMode: function() {
		cc.director.runScene(new PlayScene());
	},
	
	relayMode: function() {
		cc.director.runScene(new NetworkPlayScene());
	}
});