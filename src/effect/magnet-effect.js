var MagnetEffect = cc.Layer.extend({
	
	ctor: function() {
		this._super();
	},
	
	getMagnet: function() {
		var winSize = cc.director.getWinSize();
		this.effect = new cc.Sprite(res.magnet.effect);
		this.effect.setPosition(cc.p(winSize.width/2, winSize.height/2));
		this.addChild(this.effect);

		this.effect.setScale(0.5);
		var rotateTo = cc.RotateTo.create(0.5, 300,300);
		var actionScaleTo = cc.ScaleTo.create(0.5, 20, 20);
		//this.effect.runAction(rotateTo);
		this.effect.runAction(actionScaleTo);

//		this.scheduleOnce(function(){
//			this.effect.removeFromParent();
//		}.bind(this),500);
		
	},
	
	loseMagnet: function() {
		cc.audioEngine.playEffect(res.sound.lose_prop);
	}
});