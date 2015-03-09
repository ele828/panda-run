var GameMenuLayer = cc.Layer.extend(/**@lends GameMenuLayer# */{

	/**
	 * Initialize the application menu layer.
	 */
	openStore: false,

	ctor: function(){
		this._super();

		var winsize = cc.director.getWinSize();
		var spritebg = new cc.Sprite(res.menu.bg);

		spritebg.setPosition(cc.p(0, -30));
		spritebg.attr({
			anchorX: 0,
			anchorY: 0,
			width: winsize.width,
			height: winsize.height
		});
		spritebg.setScale(0.8);
		this.addChild(spritebg);

		var move = cc.MoveTo.create(5, cc.p(0, -10)).easing(cc.easeElasticOut());
		spritebg.runAction(move);

		cc.MenuItemFont.setFontSize(60);
		
		this.welcome = new cc.LabelTTF("欢迎您，"+sys.localStorage.getItem("username"), "Helvetica", 60);
		this.welcome.setColor(cc.color(255, 255, 255));//white color
		this.welcome.setPosition(cc.p(winsize.width-180, winsize.height-50));
		this.welcome.setScale(0.3);
		this.addChild(this.welcome, 10);
		

		//init logo
		this.logo = new cc.Sprite(res.menu.logo);
		this.logo.setPosition(cc.p(-200, winsize.height-160));
		this.logo.setScale(0.8);
		this.addChild(this.logo);
		var actionTo = cc.MoveTo.create(1, cc.p(250, winsize.height-150)).easing(cc.easeElasticOut());
		var sequence = cc.Sequence.create(
				actionTo,
				cc.CallFunc.create(function (logo) {
					var shaking = cc.MoveTo.create(1, cc.p(250, winsize.height-250)).easing(cc.easeElasticIn());
					var shakingBack = cc.MoveTo.create(1, cc.p(250, winsize.height-140)).easing(cc.easeElasticOut());
					var shakingSeq = cc.Sequence.create(shaking, shakingBack);
					var shakingSeq = cc.Sequence.create(shaking,shakingBack);
					logo.runAction(shakingSeq.repeatForever());
				}, this.logo));
		this.logo.runAction(sequence);

		//exit button
		this.exitBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.backBtn), // normal state image
				new cc.Sprite(res.ui.backBtn), // select state image
				function(){
					cc.director.end();
				}, this));
		this.exitBtn.setPosition(cc.p(-10, 0));
		this.exitBtn.setScale(0.8);
		this.addChild(this.exitBtn);

		// play btn
		var playBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.menu.playBtn), // normal state image
				new cc.Sprite(res.menu.playBtnS), // select state image
				this.onPlay, this));
		var playBtnPosX = 200, playBtnPosY = 150;
		playBtn.setPosition(cc.p(-200, winsize.height));
		this.addChild(playBtn);
		var seq = cc.Sequence.create(
				cc.MoveTo.create(2, cc.p(playBtnPosX, playBtnPosY)).easing(cc.easeElasticInOut(0.8)),
				cc.CallFunc.create(function(playBtn){
					var shaking = cc.MoveTo.create(1, cc.p(playBtnPosX, playBtnPosY)).easing(cc.easeIn(2.0));
					var shakingBack = cc.MoveTo.create(1, cc.p(playBtnPosX, playBtnPosY-10)).easing(cc.easeOut(2.0));
					var shakingSeq = cc.Sequence.create(shaking, shakingBack);
					var shakingSeq = cc.Sequence.create(shaking, shakingBack);
					playBtn.runAction(shakingSeq.repeatForever());
				},playBtn));
		playBtn.runAction(seq);

		//storeBtn
		var storeBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.menu.storeBtn),
				new cc.Sprite(res.menu.storeBtnS),
				this.onStore, this));
		storeBtn.setPosition(cc.p(winsize.width+200, winsize.height-220));
		this.addChild(storeBtn);
		var actionTo = cc.MoveTo.create(2, cc.p(winsize.width-200, winsize.height-220)).easing(cc.easeElasticOut());
		var seq = cc.Sequence.create(
				actionTo,
				cc.CallFunc.create(function(storeBtn){
					var shaking = cc.MoveTo.create(2, cc.p(winsize.width-205, winsize.height-220)).easing(cc.easeBackInOut());
					var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width-195, winsize.height-220)).easing(cc.easeBackInOut());
					var shakingSeq = cc.Sequence.create(shaking, shakingBack);
					storeBtn.runAction(shakingSeq.repeatForever());
				},storeBtn));
		storeBtn.runAction(seq);

		//setting btn
		var setBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.menu.setBtn),
				new cc.Sprite(res.menu.setBtnS),
				this.onSet, this));
		setBtn.setPosition(cc.p(200, winsize.height-300));
		this.addChild(setBtn,1);
		var actionTo = cc.MoveTo.create(2, cc.p(winsize.width-200, winsize.height-300)).easing(cc.easeElasticOut());
		var seq = cc.Sequence.create(
				actionTo,
				cc.CallFunc.create(function(setBtn){
					var shaking = cc.MoveTo.create(2, cc.p(winsize.width-205, winsize.height-300)).easing(cc.easeBackInOut());
					var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width-195, winsize.height-300)).easing(cc.easeBackInOut());
					var shakingSeq = cc.Sequence.create(cc.DelayTime.create(0.3),shaking, shakingBack);
					setBtn.runAction(shakingSeq.repeatForever());
				},setBtn));
		setBtn.runAction(seq);

		//aboutBtn
		var aboutBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.menu.aboutBtn),
				new cc.Sprite(res.menu.aboutBtnS),
				this.onAbout, this));
		aboutBtn.setPosition(cc.p(winsize.width-200, winsize.height+100));
		this.addChild(aboutBtn,1);
		var actionTo = cc.MoveTo.create(2, cc.p(winsize.width-200, winsize.height-375)).easing(cc.easeElasticOut());
		var seq = cc.Sequence.create(
				actionTo,
				cc.CallFunc.create(function(aboutBtn){
					var shaking = cc.MoveTo.create(2, cc.p(winsize.width-205, winsize.height-375)).easing(cc.easeBackInOut());
					var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width-195, winsize.height-375)).easing(cc.easeBackInOut());
					var shakingSeq = cc.Sequence.create(cc.DelayTime.create(0.2), shaking, shakingBack);
					aboutBtn.runAction(shakingSeq.repeatForever());
				},aboutBtn));
		aboutBtn.runAction(seq);

		//add an player here
		cc.spriteFrameCache.addSpriteFrames(res.panda.plist);
		this.spriteSheet = new cc.SpriteBatchNode(res.panda.png);
		this.runningAction = new cc.RepeatForever(new cc.Animate(
				new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
					return cc.spriteFrameCache.getSpriteFrame("panda_run_0" + i + ".png");
				}), 0.08)
		));
		this.runningAction.retain();
		this.sprite = new cc.Sprite("#panda_run_01.png");
		this.sprite.setPosition(cc.p(-100,30));
		this.spriteSheet.setPosition(cc.p(-100,30));
		this.spriteSheet.addChild(this.sprite);
		this.addChild(this.spriteSheet,0);
		this.sprite.runAction(this.runningAction);

		var moveTo = cc.MoveTo.create(10, cc.p(winsize.width+200, 30));
		var seq = cc.Sequence.create(moveTo, cc.CallFunc(function(panda){
			panda.setPositionX(-100);
		},this.sprite));

		this.spriteSheet.runAction(seq.repeatForever());

		var particle = cc.ParticleSystem(res.particle.circle);
		particle.setPosition(800, 100);
		this.addChild(particle,100);

		this.scheduleUpdate();
	},

	/**
	 * Triggered when play is clicked.
	 */
	onPlay : function () {
		cc.audioEngine.playEffect(res.sound.button);
		this.addChild(new GameModeLayer(), 100);
		//cc.director.runScene(new NetworkPlayScene());
	},

	/**
	 * Triggered when option is clicked.
	 */
	onSet: function () {
		var winsize = cc.director.getWinSize();
		this.draw = new cc.DrawNode();
		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
		this.addChild(this.draw, 4, 1);

		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){return true;},
		}, this.draw);

		this.board = new cc.Sprite(res.ui.setBoard);
		this.board.setPosition(cc.p(winsize.width/2+300, winsize.height/2));
		this.board.setScale(0.8);
		this.addChild(this.board, 5);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.board.runAction(actionTo);

		this.backBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.backBtn),
				new cc.Sprite(res.ui.backBtn),
				this.backToMenu, this));
		this.backBtn.setPosition(cc.p(winsize.width/2-100, winsize.height+160));
		this.backBtn.attr({
			anchorX: 0,
			anchorY: 0,
			x: winsize.width/2+300,
			y: winsize.height/2-190
		});
		this.backBtn.setScale(0.8);
		this.backBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-100, winsize.height/2-160)).easing(cc.easeElasticOut()));
		this.addChild(this.backBtn, 6);

		//toggle
		//effect
		var on = new cc.MenuItemImage(res.ui.onBtn);
		var off = new cc.MenuItemImage(res.ui.offBtn);
		if(!canAudioPlaying) {
			on = new cc.MenuItemImage(res.ui.onBtn);
			off = new cc.MenuItemImage(res.ui.offBtn);
		} else {
			on = new cc.MenuItemImage(res.ui.offBtn);
			off = new cc.MenuItemImage(res.ui.onBtn);
		}
		var toggler = new cc.MenuItemToggle( on, off,
				function(that){
			// TODO: settings.
		},this);

		this.effect = new cc.Menu(toggler);
		this.effect.setPosition(cc.p(winsize.width+100, winsize.height/2+10));
		this.effect.setScale(0.8);
		this.effect.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-30, winsize.height/2+10)).easing(cc.easeElasticOut()));
		this.addChild(this.effect, 6);

		//audio
		var onAudio = new cc.MenuItemImage(res.ui.onBtn);
		var offAudio = new cc.MenuItemImage(res.ui.offBtn);
		if(!canMusicPlaying){
			onAudio = new cc.MenuItemImage(res.ui.onBtn);
			offAudio = new cc.MenuItemImage(res.ui.offBtn);
		} else {
			onAudio = new cc.MenuItemImage(res.ui.offBtn);
			offAudio = new cc.MenuItemImage(res.ui.onBtn);
		}
		var toggler = new cc.MenuItemToggle( onAudio, offAudio,
				function(that){
			// TODO settings.
		},this);

		this.audio = new cc.Menu(toggler);
		this.audio.setPosition(cc.p(winsize.width+100, winsize.height/2-65));
		this.audio.setScale(0.8);
		this.audio.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-30, winsize.height/2-65)).easing(cc.easeElasticOut()));
		this.addChild(this.audio, 6);

		//difficulty

		var onDiff = new cc.MenuItemImage(res.ui.highBtn);
		var offDiff = new cc.MenuItemImage(res.ui.lowBtn);

		if(diffDeg == 0) {
			onDiff = new cc.MenuItemImage(res.ui.highBtn);
			offDiff = new cc.MenuItemImage(res.ui.lowBtn);
		} else {
			onDiff = new cc.MenuItemImage(res.ui.lowBtn);
			offDiff = new cc.MenuItemImage(res.ui.highBtn);
		}

		var toggler = new cc.MenuItemToggle( onDiff, offDiff,
				function(that){
			if(canAudioPlaying){
				cc.audioEngine.playEffect(res.sound.button);
			}
			if(diffDeg == 0) {
				diffDeg = 1;
				sys.localStorage.setItem("diffDeg", 1);
			} else {
				diffDeg = 0;
				sys.localStorage.setItem("diffDeg", 0);
			}

		},this);

		this.diff = new cc.Menu(toggler);
		this.diff.setPosition(cc.p(winsize.width+100, winsize.height/2-140));
		this.diff.setScale(0.8);
		this.diff.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-30, winsize.height/2-140)).easing(cc.easeElasticOut()));
		this.addChild(this.diff, 6);
	},

	/**
	 * Triggered when about is clicked.
	 */
	onAbout: function () {
		var winsize = cc.director.getWinSize();
		this.draw = new cc.DrawNode();
		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
		this.addChild(this.draw, 4, 1);

		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){return true;},
		}, this.draw);

		this.board = new cc.Sprite(res.ui.aboutBoard);
		this.board.setPosition(cc.p(winsize.width/2+300, winsize.height/2));
		this.board.setScale(0.8);
		this.addChild(this.board, 5);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.board.runAction(actionTo);
//		var sequence = cc.Sequence.create(
//		actionTo,
//		cc.CallFunc.create(function (logo) {
//		var shaking = cc.MoveTo.create(1, cc.p(250, winsize.height-250)).easing(cc.easeElasticIn());
//		var shakingBack = cc.MoveTo.create(1, cc.p(250, winsize.height-140)).easing(cc.easeElasticOut());
//		var shakingSeq = cc.Sequence.create(shaking, shakingBack);
//		var shakingSeq = cc.Sequence.create(shaking,shakingBack);
//		logo.runAction(shakingSeq.repeatForever());
//		}, this.logo));
//		this.logo.runAction(sequence);

		this.backBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.backBtn),
				new cc.Sprite(res.ui.backBtn),
				this.backToMenu, this));
		this.backBtn.setPosition(cc.p(winsize.width+100, 60));
		this.backBtn.attr({
			anchorX: 0,
			anchorY: 0,
			x: winsize.width/2+300,
			y: winsize.height/2-190
		});
		this.backBtn.setScale(0.8);
		this.backBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-100, winsize.height/2-190)).easing(cc.easeElasticOut()));
		this.addChild(this.backBtn, 6);
	},

	/**
	 * store layer
	 */

	onStore: function() {
		this.openStore = true;
		cc.audioEngine.stopMusic();

//		this.totalCoin = sys.localStorage.getItem("TotalCoin");
//		this.magnetNum = sys.localStorage.getItem("magnet");
//		this.shoesNum = sys.localStorage.getItem("shoes");
//		this.redshoesNum = sys.localStorage.getItem("redshoes");
//
//		var winsize = cc.director.getWinSize();
//		this.draw = new cc.DrawNode();
//		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
//		this.addChild(this.draw, 4, 1);
//
//		cc.eventManager.addListener({
//			event: cc.EventListener.TOUCH_ONE_BY_ONE,
//			swallowTouches: true,
//			onTouchBegan: function(){return true;},
//		}, this.draw);
//
//		this.board = new cc.Sprite(res.ui.storeBoard);
//		this.board.setPosition(cc.p(winsize.width/2+300, winsize.height/2));
//		this.board.setScale(0.57);
//		this.addChild(this.board, 5);
//		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
//		this.board.runAction(actionTo);
//
//		this.backBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.backBtn),
//				new cc.Sprite(res.ui.backBtn),
//				this.backToMenu, this));
//		this.backBtn.setPosition(cc.p(winsize.width+100, 60));
//		this.backBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//			x: winsize.width/2+300,
//			y: winsize.height/2-190
//		});
//		this.backBtn.setScale(0.6);
//		this.backBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-100, winsize.height/2-210)).easing(cc.easeElasticOut()));
//		this.addChild(this.backBtn, 6);
//
//		//show coins nums
//		this.labelCoins = new cc.LabelTTF(this.totalCoin, "Helvetica", 50);
//		this.labelCoins.setColor(cc.color(255, 255, 255));//white color
//		this.labelCoins.setPosition(cc.p(winsize.width+100, winsize.height/2+128));
//		this.labelCoins.setScale(0.3);
//		this.addChild(this.labelCoins, 10);
//		//this.labelCoins.retain();
//		this.labelCoins.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+50, winsize.height/2+128)).easing(cc.easeElasticOut()));
//
//		this.buyMagnetBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy30),
//				new cc.Sprite(res.ui.buy30),
//				function(){
//					//buy magnet
//					if(this.totalCoin - 30 < 0){
//						return;
//					}
//					this.totalCoin -= 30;
//					this.magnetNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("magnet", this.magnetNum);
//					cc.audioEngine.playEffect(res.sound.button);	
//				}, this));
//		this.buyMagnetBtn.setPosition(cc.p(winsize.width+80, winsize.height/2+70));
//		this.buyMagnetBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyMagnetBtn.setScale(0.6);
//		this.buyMagnetBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2+70)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyMagnetBtn, 6);
//
//		this.buyShoesBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy50),
//				new cc.Sprite(res.ui.buy50),
//				function(){
//					//buy shoes
//					if(this.totalCoin - 50 < 0){
//						return;
//					}
//					this.totalCoin -= 50;
//					this.shoesNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("shoes", this.shoesNum);
//					cc.audioEngine.playEffect(res.sound.button);
//				}, this));
//		this.buyShoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-10));
//		this.buyShoesBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyShoesBtn.setScale(0.6);
//		this.buyShoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-10)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyShoesBtn, 6);
//
//		this.buyRedshoesBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy50),
//				new cc.Sprite(res.ui.buy50),
//				function(){
//					//buy red shoes
//					if(this.totalCoin - 50 < 0){
//						return;
//					}
//					this.totalCoin -= 50;
//					this.redshoesNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("redshoes", this.redshoesNum);
//					cc.audioEngine.playEffect(res.sound.button);
//				}, this));
//		this.buyRedshoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-90));
//		this.buyRedshoesBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyRedshoesBtn.setScale(0.6);
//		this.buyRedshoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-90)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyRedshoesBtn, 6);
//
//		/**
//		 * show prop nums of own
//		 */
//
//		//show magnet
//		this.labelMagnet = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelMagnet.setColor(cc.color(255, 255, 255));//white color
//		this.labelMagnet.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelMagnet.setScale(0.3);
//		this.addChild(this.labelMagnet, 10);
//		this.labelMagnet.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-70, winsize.height/6-5)).easing(cc.easeElasticOut()));
//
//		//show shoes
//		this.labelShoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelShoes.setColor(cc.color(255, 255, 255));//white color
//		this.labelShoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelShoes.setScale(0.3);
//		this.addChild(this.labelShoes, 10);
//		this.labelShoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+20, winsize.height/6-5)).easing(cc.easeElasticOut()));
//
//		//show redshoes
//		this.labelRedshoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelRedshoes.setColor(cc.color(255, 255, 255));//white color
//		this.labelRedshoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelRedshoes.setScale(0.3);
//		this.addChild(this.labelRedshoes, 10);
//		this.labelRedshoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+100, winsize.height/6-5)).easing(cc.easeElasticOut()));
		
		
		this.addChild(new RankLayer(), 100);
	},

	update: function(dt) {	
		if(this.openStore) {
			//this.labelCoins.setString(this.totalCoin);
			//this.labelMagnet.setString(this.magnetNum);
			//this.labelShoes.setString(this.shoesNum);
			//this.labelRedshoes.setString(this.redshoesNum);
		}
	},

	backToMenu: function() {
		var winsize = cc.director.getWinSize();
		this.backBtn.runAction(cc.Sequence.create(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-190)).easing(cc.easeElasticInOut(0.45)),
				cc.CallFunc(function(){
					this.board.removeFromParent();
					this.backBtn.removeFromParent();
					this.draw.removeFromParent();
				}.bind(this))));
		this.board.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2)).easing(cc.easeElasticInOut(0.45)));
		if(this.effect)
			this.effect.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2+10)).easing(cc.easeElasticInOut(0.45)));
		if(this.audio)
			this.audio.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-65)).easing(cc.easeElasticInOut(0.45)));
		if(this.diff)
			this.diff.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-140)).easing(cc.easeElasticInOut(0.45)));

		if(this.buyMagnetBtn)
			this.buyMagnetBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2+70)).easing(cc.easeElasticInOut(0.45)));
		if(this.buyShoesBtn)
			this.buyShoesBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-10)).easing(cc.easeElasticInOut(0.45)));
		if(this.buyRedshoesBtn)
			this.buyRedshoesBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-90)).easing(cc.easeElasticInOut(0.45)));
		if(this.labelCoins)
			this.labelCoins.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2+128)).easing(cc.easeElasticInOut(0.45)));
		if(this.labelMagnet)
			this.labelMagnet.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/6-5)).easing(cc.easeElasticInOut(0.45)));
		if(this.labelShoes)
			this.labelShoes.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/6-5)).easing(cc.easeElasticInOut(0.45)));
		if(this.labelRedshoes){
			this.labelRedshoes.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/6-5)).easing(cc.easeElasticInOut(0.45)));
			//change music
			cc.audioEngine.stopMusic();
			if(canMusicPlaying) {
				cc.audioEngine.playMusic(res.sound.menu);
			}
		}
	}
});