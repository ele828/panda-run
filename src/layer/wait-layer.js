var WaitLayer= cc.Layer.extend({
	
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
		
		this.board = new cc.Sprite(res.menu.wait);
		this.board.setPosition(cc.p(winsize.width/2, winsize.height/2));
		this.addChild(this.board, 100);
	}
});