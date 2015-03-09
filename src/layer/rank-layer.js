/**
 * RankList Layer
 * shows the total rankinglist
 */
var RankLayer = cc.Layer.extend({
	
	ctor: function() {
		this._super();
		var winsize = cc.director.getWinSize();
		
		//create black background
		this.draw = new cc.DrawNode();
		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
		this.addChild(this.draw, 4, 1);

		//disabled touch
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){return true;},
		}, this.draw);
		
		//init rank elements
		this.board = new cc.Sprite(res.rank.board);
		this.board.setPosition(cc.p(winsize.width/2, winsize.height));
		this.board.setScale(0.55);
		this.addChild(this.board,10);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.board.runAction(actionTo);
		
		this.back = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.ui.backBtn),
				new cc.Sprite(res.ui.backBtn),
				function() {
					cc.log(1);
					cc.director.runScene(new WelcomeScene());
				}.bind(this), this));
		this.back.setScale(0.8);
		this.back.setPosition(cc.p(winsize.width/2-150, winsize.height));
		this.addChild(this.back,11);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2-150, 0)).easing(cc.easeElasticOut());
		this.back.runAction(actionTo);
		
		//print data to screen
		/*
		 * myself position
		 */
		this.myRank = new cc.LabelTTF("0", "Helvetica", 30);
		this.myRank.setColor(cc.color(67, 144, 67));// white color
		this.myRank.setPosition(cc.p(winsize.width/2+30, winsize.height));
		this.addChild(this.myRank,13);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2+30, winsize.height-98)).easing(cc.easeElasticOut());
		this.myRank.runAction(actionTo);
		
		//get data from server
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var data = JSON.parse(xhr.responseText);
				var darr = data.score;
				console.log(darr);
				var rankName = "";
				var rankScore = "";
				for(var i=0; i<darr.length; i++) {
					rankName += darr[i][0] + "\n";
					rankScore += darr[i][1] + "\n";
				}
				var j = i;
				var rankNo = "";
				for(var i=1; i<=j; i++) {
					rankNo += i+"\n";
				}
				for(; i<10; i++) {
					rankName += "\n";
					rankScore += "\n";
					rankNo += "\n";
				}

				this.allRankName.setString(rankName);
				this.allRankScore.setString(rankScore);
				this.allRankNo.setString(rankNo);
				
				//get my rank
				var username = sys.localStorage.getItem("username");
				for(var i=0; i<darr.length; i++) {
					if(darr[i][0] == username) {
						this.myRank.setString(darr[i][1]);
						break;
					}
				}
			}
		}.bind(this);
		
		xhr.open('GET', 'http://endless-journey-server.coding.io/game/scores', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		var username = sys.localStorage.getItem("username");
		xhr.send(null);
		
		/*
		 * all ranking data 
		 * 
		 */
		var rankNo = "";
		var rankName = "";
		var rankScore = "";
		
		for(var i=1; i<=10; i++) {
			rankNo += i+"\n";
			rankName += "载入中\n";
			rankScore += 0+"\n";
		}
		
		this.allRankNo = new cc.LabelTTF(rankNo, "Helvetica", 50);
		this.allRankNo.setColor(cc.color(142, 84, 19));// white color
		this.allRankNo.setPosition(cc.p(winsize.width/4+95, winsize.height));
		this.allRankNo.setScale(0.4);
		this.addChild(this.allRankNo,13);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/4+95, winsize.height/2-50)).easing(cc.easeElasticOut());
		this.allRankNo.runAction(actionTo);
		
		this.allRankName = new cc.LabelTTF(rankName, "Helvetica", 50);
		this.allRankName.setColor(cc.color(142, 84, 19));// white color
		this.allRankName.setPosition(cc.p(winsize.width/4+200, winsize.height));
		this.allRankName.setScale(0.4);
		this.addChild(this.allRankName,13);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/4+200, winsize.height/2-50)).easing(cc.easeElasticOut());
		this.allRankName.runAction(actionTo);
		
		this.allRankScore = new cc.LabelTTF(rankScore, "Helvetica", 50);
		this.allRankScore.setColor(cc.color(142, 84, 19));// white color
		this.allRankScore.setPosition(cc.p(winsize.width/4+305, winsize.height));
		this.allRankScore.setScale(0.4);
		this.addChild(this.allRankScore,13);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/4+305, winsize.height/2-50)).easing(cc.easeElasticOut());
		this.allRankScore.runAction(actionTo);
		
	}
});