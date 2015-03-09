var StatisticsLayer = cc.LayerColor.extend(/**@lends StatisticsLayer# */{

	labelCoin: null,
	
	statistics: null,

	cval : 0,
	sval : 0,
	kval : 0,
	mval : 0,
	openStore: false,
	
	// constructor
	ctor:function (statistics, playSceneClass) {
		this._super();
		this.init(cc.color(0, 0, 0, 80));
		
		if (! playSceneClass) {
			playSceneClass = PlayScene;
		}
		this.playSceneClass = playSceneClass;
		
		this.statistics = statistics;

		firstInit = false;

		var winSize = cc.director.getWinSize();

		cc.MenuItemFont.setFontSize(30);

		//score board
		this.board = new cc.Sprite(res.over.board);
		this.board.attr({
			x:winSize.width+100,
			y:winSize.height/2,
		});
		this.board.setScale(0.7);
		this.addChild(this.board,0);
		var actionTo = cc.MoveTo.create(0.7, cc.p(winSize.width/2, winSize.height/2)).easing(cc.easeBounceOut());
//		var actionTo1 = cc.MoveTo.create(0.7, cc.p(winSize.width/2-120, winSize.height/2-200)).easing(cc.easeBounceOut());
		this.board.runAction(actionTo);
//		this.menu.runAction(actionTo1);

		this.labelCoin = new cc.LabelTTF("0", "Helvetica", 35);
		this.labelCoin.setColor(cc.color(67, 144, 67));
		this.labelCoin.setPosition(cc.p(winSize.width + 100, winSize.height/2+25));
		this.labelCoin.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width / 2 + 90, winSize.height/2+25)).easing(cc.easeBounceOut()));
		this.addChild(this.labelCoin);

		this.labelKill = new cc.LabelTTF("0", "Helvetica", 35);
		this.labelKill.setColor(cc.color(67, 144, 67));
		this.labelKill.setPosition(cc.p(winSize.width + 100, winSize.height/2+85));
		this.labelKill.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width / 2 + 90, winSize.height/2+85)).easing(cc.easeBounceOut()));
		this.addChild(this.labelKill);

		this.labelDistance = new cc.LabelTTF("0", "Helvetica", 35);
		this.labelDistance.setColor(cc.color(67, 144, 67));
		this.labelDistance.setPosition(cc.p(winSize.width + 100, winSize.height/2-35));
		this.labelDistance.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width / 2 + 90, winSize.height/2-35)).easing(cc.easeBounceOut()));
		this.addChild(this.labelDistance);

		this.score = statistics.kill * 30 + statistics.coins*10 + statistics.meter;

		this.labelScore = new cc.LabelTTF("0", "Helvetica", 35);
		this.labelScore.setColor(cc.color(158, 98, 22));
		this.labelScore.setPosition(cc.p(winSize.width + 100, winSize.height/2-95));
		this.labelScore.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width / 2 + 90, winSize.height/2-95)).easing(cc.easeBounceOut()));
		this.addChild(this.labelScore);

		this.restartBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.over.reload),
				new cc.Sprite(res.over.reload),
				this.onRestart, this));
		this.restartBtn.setPosition(cc.p(winSize.width+100, 60));
		this.restartBtn.attr({
			anchorX: 0,
			anchorY: 0,
			x: winSize.width+100,
			y: winSize.height/2-165
		});
		this.restartBtn.setScale(0.8);
		this.restartBtn.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width/2, winSize.height/2-165)).easing(cc.easeBounceOut()));
		this.addChild(this.restartBtn, 1);

		this.storeBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.over.store),
				new cc.Sprite(res.over.store),
				this.onUpload, this));
		this.storeBtn.setPosition(cc.p(winSize.width+100, 60));
		this.storeBtn.attr({
			anchorX: 0,
			anchorY: 0,
			x: winSize.width+100,
			y: winSize.height/2-165
		});
		this.storeBtn.setScale(0.8);
		this.storeBtn.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width/2+70, winSize.height/2-165)).easing(cc.easeBounceOut()));
		this.addChild(this.storeBtn, 1);

		this.menuBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.over.menu),
				new cc.Sprite(res.over.menu),
				this.onMenu, this));
		this.menuBtn.setPosition(cc.p(winSize.width+100, 60));
		this.menuBtn.attr({
			anchorX: 0,
			anchorY: 0,
			x: winSize.width+100,
			y: winSize.height/2-165
		});
		this.menuBtn.setScale(0.8);
		this.menuBtn.runAction(cc.MoveTo.create(0.7, cc.p(winSize.width/2-70, winSize.height/2-165)).easing(cc.easeBounceOut()));
		this.addChild(this.menuBtn, 1);

		//save data to localstorage
		var coinsNum = sys.localStorage.getItem("TotalCoin");
		if(!isNaN(coinsNum)) {
			newCoinsNum = parseInt(coinsNum) + parseInt(statistics.coins);
			sys.localStorage.setItem("TotalCoin",newCoinsNum);
			var a = sys.localStorage.getItem("TotalCoin");
		} else {
			sys.localStorage.setItem("TotalCoin",0);
			coinsNum = sys.localStorage.getItem("TotalCoin");
			newCoinsNum = parseInt(statistics.coins);
			sys.localStorage.setItem("TotalCoin",newCoinsNum);
			var a = sys.localStorage.getItem("TotalCoin");
		}
	},

	update: function(dt) {
		var statistics = this.statistics;

		if(this.cval < statistics.coins){
			this.cval++;
		}

		if(this.kval < statistics.kill) {
			this.kval++;
		}

		if(this.mval < statistics.meter) {
			this.mval++;
		}

		if(this.sval < statistics.score) {
			if(this.score > 1500) {
				this.sval += 20;
			} else {
				this.sval += 10;
			}
		}

		this.labelCoin.setString(this.cval);
		this.labelKill.setString(this.kval);
		this.labelDistance.setString(this.mval);
		this.labelScore.setString(this.sval);

		if(this.openStore) {
			this.labelCoins.setString(this.totalCoin);
			this.labelMagnet.setString(this.magnetNum);
			this.labelShoes.setString(this.shoesNum);
			this.labelRedshoes.setString(this.redshoesNum);
		}
	},

	/*
	 * 
	 */
	onRestart: function (sender) {
		var winSize = cc.director.getWinSize();
//		var actionTo1 = cc.MoveTo.create(0.7, cc.p(winSize.width/2-120, winSize.height/2-200)).easing(cc.easeBounceOut());
		var action = cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2)).easing(cc.easeElasticInOut(0.45)));
		this.board.runAction(action);
		this.restartBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45)),
				cc.CallFunc.create(function(){
					cc.director.runScene(new this.playSceneClass());
				}.bind(this))));
		this.storeBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45))));

		this.menuBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45))));
		//play button effect
		cc.audioEngine.playEffect(res.sound.button);

		//label out
		this.labelCoin.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2+25)).easing(cc.easeElasticInOut(0.45))));
		this.labelKill.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2+85)).easing(cc.easeElasticInOut(0.45))));
		this.labelDistance.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-35)).easing(cc.easeElasticInOut(0.45))));
		this.labelScore.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-95)).easing(cc.easeElasticInOut(0.45))));
	},

	onMenu: function() {
		var winSize = cc.director.getWinSize();
//		var actionTo1 = cc.MoveTo.create(0.7, cc.p(winSize.width/2-120, winSize.height/2-200)).easing(cc.easeBounceOut());
		var action = cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2)).easing(cc.easeElasticInOut(0.45)));
		this.board.runAction(action);
		this.menuBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45)),
				cc.CallFunc.create(function(){
					cc.director.replaceScene(new WelcomeScene());
				}.bind(this))));
		//play button effect
		cc.audioEngine.playEffect(res.sound.button);

		this.restartBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45))));

		this.storeBtn.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-165)).easing(cc.easeElasticInOut(0.45))));

		//label out
		this.labelCoin.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2+25)).easing(cc.easeElasticInOut(0.45))));
		this.labelKill.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2+85)).easing(cc.easeElasticInOut(0.45))));
		this.labelDistance.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-35)).easing(cc.easeElasticInOut(0.45))));
		this.labelScore.runAction(cc.Sequence.create(
				cc.MoveTo.create(0.7, cc.p(-300, winSize.height/2-95)).easing(cc.easeElasticInOut(0.45))));
	},

	onStore: function() {
		this.openStore = true;
		cc.audioEngine.stopMusic();

		this.totalCoin = sys.localStorage.getItem("TotalCoin");
		this.magnetNum = sys.localStorage.getItem("magnet");
		this.shoesNum = sys.localStorage.getItem("shoes");
		this.redshoesNum = sys.localStorage.getItem("redshoes");

		if(canMusicPlaying) {
			cc.audioEngine.playMusic(res.sound.shopping, true);
		}
		var winsize = cc.director.getWinSize();
		this.draw = new cc.DrawNode();
		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
		this.addChild(this.draw, 4, 1);

		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){return true;},
		}, this.draw);

		this.sboard = new cc.Sprite(res.ui.storeBoard);
		this.sboard.setPosition(cc.p(winsize.width/2+300, winsize.height/2));
		this.sboard.setScale(0.57);
		this.addChild(this.sboard, 5);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.sboard.runAction(actionTo);

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
		this.backBtn.setScale(0.6);
		this.backBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-100, winsize.height/2-210)).easing(cc.easeElasticOut()));
		this.addChild(this.backBtn, 6);

		//show coins nums
		this.labelCoins = new cc.LabelTTF(this.totalCoin, "Helvetica", 50);
		this.labelCoins.setColor(cc.color(255, 255, 255));//white color
		this.labelCoins.setPosition(cc.p(winsize.width+100, winsize.height/2+128));
		this.labelCoins.setScale(0.3);
		this.addChild(this.labelCoins, 10);
		//this.labelCoins.retain();
		this.labelCoins.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+50, winsize.height/2+128)).easing(cc.easeElasticOut()));

		this.buyMagnetBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.buy30),
				new cc.Sprite(res.ui.buy30),
				function(){
					//buy magnet
					if(this.totalCoin - 30 < 0){
						return;
					}
					this.totalCoin -= 30;
					this.magnetNum++;
					sys.localStorage.setItem("TotalCoin", this.totalCoin);
					sys.localStorage.setItem("magnet", this.magnetNum);
					cc.audioEngine.playEffect(res.sound.button);	
				}, this));
		this.buyMagnetBtn.setPosition(cc.p(winsize.width+80, winsize.height/2+70));
		this.buyMagnetBtn.attr({
			anchorX: 0,
			anchorY: 0,
		});
		this.buyMagnetBtn.setScale(0.6);
		this.buyMagnetBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2+70)).easing(cc.easeElasticOut()));
		this.addChild(this.buyMagnetBtn, 6);

		this.buyShoesBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.buy50),
				new cc.Sprite(res.ui.buy50),
				function(){
					//buy shoes
					if(this.totalCoin - 50 < 0){
						return;
					}
					this.totalCoin -= 50;
					this.shoesNum++;
					sys.localStorage.setItem("TotalCoin", this.totalCoin);
					sys.localStorage.setItem("shoes", this.shoesNum);
					cc.audioEngine.playEffect(res.sound.button);
				}, this));
		this.buyShoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-10));
		this.buyShoesBtn.attr({
			anchorX: 0,
			anchorY: 0,
		});
		this.buyShoesBtn.setScale(0.6);
		this.buyShoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-10)).easing(cc.easeElasticOut()));
		this.addChild(this.buyShoesBtn, 6);

		this.buyRedshoesBtn = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.buy50),
				new cc.Sprite(res.ui.buy50),
				function(){
					//buy red shoes
					if(this.totalCoin - 50 < 0){
						return;
					}
					this.totalCoin -= 50;
					this.redshoesNum++;
					sys.localStorage.setItem("TotalCoin", this.totalCoin);
					sys.localStorage.setItem("redshoes", this.redshoesNum);
					cc.audioEngine.playEffect(res.sound.button);
				}, this));
		this.buyRedshoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-90));
		this.buyRedshoesBtn.attr({
			anchorX: 0,
			anchorY: 0,
		});
		this.buyRedshoesBtn.setScale(0.6);
		this.buyRedshoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-90)).easing(cc.easeElasticOut()));
		this.addChild(this.buyRedshoesBtn, 6);

		/**
		 * show prop nums of own
		 */

		//show magnet
		this.labelMagnet = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
		this.labelMagnet.setColor(cc.color(255, 255, 255));//white color
		this.labelMagnet.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
		this.labelMagnet.setScale(0.3);
		this.addChild(this.labelMagnet, 10);
		this.labelMagnet.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-70, winsize.height/6-5)).easing(cc.easeElasticOut()));

		//show shoes
		this.labelShoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
		this.labelShoes.setColor(cc.color(255, 255, 255));//white color
		this.labelShoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
		this.labelShoes.setScale(0.3);
		this.addChild(this.labelShoes, 10);
		this.labelShoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+20, winsize.height/6-5)).easing(cc.easeElasticOut()));

		//show redshoes
		this.labelRedshoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
		this.labelRedshoes.setColor(cc.color(255, 255, 255));//white color
		this.labelRedshoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
		this.labelRedshoes.setScale(0.3);
		this.addChild(this.labelRedshoes, 10);
		this.labelRedshoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+100, winsize.height/6-5)).easing(cc.easeElasticOut()));
	},
	
	onUpload: function () {
		var statistics = this.statistics;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				cc.log(xhr.readyState);
			}
		};
		xhr.open('POST', 'http://endless-journey-server.coding.io/game/scores', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		var username = sys.localStorage.getItem("username");
		xhr.send(JSON.stringify({
			id: username,
			meter: statistics.meter,
			score: statistics.score,
			coins: statistics.coins
		}));
	},

	backToMenu: function() {
		var winsize = cc.director.getWinSize();
		this.backBtn.runAction(cc.Sequence.create(cc.MoveTo.create(1, cc.p(-250, winsize.height/2-190)).easing(cc.easeElasticInOut(0.45)),
				cc.CallFunc(function(){
					this.sboard.removeFromParent();
					this.backBtn.removeFromParent();
					this.draw.removeFromParent();
				}.bind(this))));
		this.sboard.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height/2)).easing(cc.easeElasticInOut(0.45)));
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
			cc.audioEngine.playMusic(res.sound.bg_mp3);
		}
	},
	
	onEnter: function() {
		this._super();
		this.scheduleUpdate();
	},
	
	onExit: function() {
		this._super();
		this.unscheduleUpdate();
	}

});