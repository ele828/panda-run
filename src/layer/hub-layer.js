var HubLayer = cc.Layer.extend({

	labelCoin: null,
	pLayer: null,
	statistics: null,
	indicators: [],
	
	ctor: function (player, statistics, settings, camera) {
		this._super();
		this.player = player;
		this.statistics = statistics;
		this.camera = camera;
		
		var winSize = cc.director.getWinSize();
		
		var goldbar = new cc.Sprite(res.ui.goldbar);
		goldbar.attr({
			x: 120,
			y: winSize.height - 40
		});
		this.addChild(goldbar);
		
		this.energybar = new cc.Sprite(res.ui.energybar);
		this.energybar.attr({
			x: 350,
			y: winSize.height - 40
		});
		this.addChild(this.energybar);
		
		this.progress = new cc.Sprite(res.ui.progress);
		this.progress.attr({
			x: 303.5,
			y: winSize.height - 41,
			anchorX:0,
		});
		this.progress.setScaleX(0.00001);
		this.progress.setScaleY(0.9);
		this.addChild(this.progress);
		
		this.labelCoin = new cc.LabelTTF(statistics.score, "Helvetica", 50);
		this.labelCoin.setColor(cc.color(255, 255, 255));// white color
		this.labelCoin.setPosition(cc.p(130, winSize.height - 43));
		this.labelCoin.setScale(0.4);
		this.addChild(this.labelCoin);
		
		// running distance
		this.distance = new cc.Sprite(res.ui.distance);
		this.distance.attr({
			x: 490,
			y: winSize.height - 40,
			anchorX: 0
		});
		this.addChild(this.distance);
		
		this.labelrun = new cc.LabelTTF("0m", "Helvetica", 50);
		this.labelrun.setColor(cc.color(255, 255, 255));// white color
		this.labelrun.setPosition(cc.p(605, winSize.height - 43));
		this.labelrun.setScale(0.4);
		this.addChild(this.labelrun);
		
		// sound control btn
		var soundOn = new cc.MenuItemImage(res.ui.soundOn);
		var soundOff = new cc.MenuItemImage(res.ui.soundOff);
		var toggler = new cc.MenuItemToggle( soundOn, soundOff,
				function(){
						if(settings.audioEnabled){
							settings.audioEnabled = false;
						} else {
							settings.audioEnabled = true;
						}
				},this);
		
		var soundBtn = new cc.Menu(toggler);
		
		soundBtn.setPosition(cc.p(winSize.width-50, winSize.height - 45));
		this.addChild(soundBtn);

		// prop set
//		this.magnetProp = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.magnetProp),
//				new cc.Sprite(res.ui.magnetProp),
//				function(){
//					if(this.mNum > 0) {
//						this.magnetEffect = new MagnetEffect();
//						this.addChild(this.magnetEffect, 2);
//						this.magnetEffect.getMagnet();
//
//						this.player.getMagnet();
//						this.consumeMagnet();
//						setTimeout(function(){
//							this.player.loseMagnet();
//							this.magnetEffect.loseMagnet();
//						}.bind(this), 15000);
//
//						cc.audioEngine.playEffect(res.sound.magnet);
//						
//						this.mNum--;
//						sys.localStorage.setItem("magnet", this.mNum);
//						this.MagentNum.setString(this.mNum);
//					}
//				}, this));
//		this.magnetProp.setPosition(cc.p(winSize.width/2+150, winSize.height/2+10));
//		this.magnetProp.setScale(0.5);
//		this.addChild(this.magnetProp);
//		
//		this.shoesProp = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.shoesProp),
//				new cc.Sprite(res.ui.shoesProp),
//				function(){
//					if(this.sNum > 0) {
//						this.player.getShoesAndSpeedUp();
//						this.sNum--;
//						sys.localStorage.setItem("shoes", this.sNum);
//						this.ShoesNum.setString(this.sNum);
//						
//						this.magnetEffect = new MagnetEffect();
//						this.addChild(this.magnetEffect, 2);
//						this.magnetEffect.getMagnet();
//
//						setTimeout(function(){
//							this.player.loseMagnet();
//							this.magnetEffect.loseMagnet();
//						}.bind(this), 15000);
//
//						cc.audioEngine.playEffect(res.sound.speedup);
//					}
//					
//				}, this));
//		this.shoesProp.attr({
//			x: winSize.width/2+150,
//			y: winSize.height/2-50
//		});
//		this.shoesProp.setScale(0.5);
//		this.addChild(this.shoesProp);
//		
//		this.redshoesProp = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.redshoesProp),
//				new cc.Sprite(res.ui.redshoesProp),
//				function(){
//					
//					if(this.rNum > 0) {
//						this.player.getRedshoesAndSlowDown();
//						this.rNum--;
//						sys.localStorage.setItem("redshoes", this.rNum);
//						this.RedshoesNum.setString(this.rNum);
//						
//						this.magnetEffect = new MagnetEffect();
//						this.addChild(this.magnetEffect, 2);
//						this.magnetEffect.getMagnet();
//
//						setTimeout(function(){
//							this.player.loseMagnet();
//							this.magnetEffect.loseMagnet();
//						}.bind(this), 15000);
//
//						cc.audioEngine.playEffect(res.sound.magnet);
//					}
//					
//				}, this));
//		this.redshoesProp.setPosition(cc.p(winSize.width/2+150, winSize.height/2-110));
//		this.redshoesProp.setScale(0.5);
//		this.addChild(this.redshoesProp);
//		
//		// nums of prop
//		this.mNum = sys.localStorage.getItem("magnet");
//		this.sNum = sys.localStorage.getItem("shoes");
//		this.rNum = sys.localStorage.getItem("redshoes");
//		
//		this.MagentNum = new cc.LabelTTF(this.mNum, "Helvetica", 14);
//		this.MagentNum.setColor(cc.color(168, 117, 56));// white color
//		this.MagentNum.setPosition(cc.p(winSize.width-68, winSize.height/2+148));
//		this.addChild(this.MagentNum, 10);
//		
//		this.ShoesNum = new cc.LabelTTF(this.sNum, "Helvetica", 14);
//		this.ShoesNum.setColor(cc.color(168, 117, 56));// white color
//		this.ShoesNum.setPosition(cc.p(winSize.width-68, winSize.height/2+88));
//		this.addChild(this.ShoesNum, 10);
//		
//		this.RedshoesNum = new cc.LabelTTF(this.rNum, "Helvetica", 14);
//		this.RedshoesNum.setColor(cc.color(168, 117, 56));// white color
//		this.RedshoesNum.setPosition(cc.p(winSize.width-68, winSize.height/2+28));
//		this.addChild(this.RedshoesNum, 10);
				
		this.scheduleUpdate();
	},

	update: function (dt) {
		var statistics = this.statistics;
		var indicators = this.indicators;
		var hero = this.player;
		
		// update the coins and meters.
		this.labelCoin.setString(statistics.coins);
		this.labelrun.setString(statistics.meter + " m");
		
		// update the indicators.
		for (var i=0; i<indicators.length; i++) {
			if (ind.update) {
				ind.update(dt, hero);
			}
		}
		
	},
	
	addIndicator: function(ind) {
		this.addChild(ind.sprite);
		
		var indicators = this.indicators;
		var statistics = this.statistics;
		var camera = this.camera;
		var winSize = cc.director.getWinSize();
		
		var px = camera.x + winSize.width / 2;
		var py = indicators.length * 100;
		var action = (new cc.MoveTo(0.5, cc.p(px+200,py+300))).easing(cc.easeBackIn());
		ind.sprite.runAction(action);
		indicators.push(ind);
	},
	
	removeIndicator: function(ind) {
		var indicators = this.indicators;
		for (var i=0; i<indicators.length; i++) {
			if (indicators[i] == ind) {
				indicators.splice(i, 1).sprite.removeFromParent();
				break;
			}
		}
	},
	
	consumeMagnet: function() {
		this.progress.setScaleX(0.01);
		var actionTo1 = cc.ScaleTo.create(1, 1.03, 1);
		var actionTo = cc.ScaleTo.create(7.5, 0.5, 0.7);
		var actionTo2 = cc.ScaleTo.create(7.5, 0.0001, 1);
		var seq = cc.Sequence.create(actionTo1, actionTo, actionTo2);
		this.progress.runAction(seq);
	}
});