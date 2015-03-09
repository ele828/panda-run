/*
 * opening animation
 * 
 */

var GameOpeningLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		var size = cc.director.getWinSize();
		var bg = new cc.Sprite(res.open.bg);
		bg.setPosition(cc.p(size.width/2, size.height/2));
		this.addChild(bg, 0);
		
		var team = new cc.Sprite(res.open.team);
		team.setPosition(cc.p(size.width/2, size.height/2));
		team.setScale(0.4);
		this.addChild(team, 1);
		team.opacity = 0;
		var fadeIn = cc.FadeIn.create(1.0);
		var fadeOut = cc.FadeOut.create(1.0);
		var delay = cc.delayTime(1);
		var seq = cc.Sequence.create(
				fadeIn,
				delay,
				fadeOut);
		team.runAction(seq);

		cc.audioEngine.playEffect(res.sound.opening);
		
		//load plist res to memory
		cc.spriteFrameCache.addSpriteFrames(res.gold.plist);
		cc.spriteFrameCache.addSpriteFrames(res.platform.plist);
		cc.spriteFrameCache.addSpriteFrames(res.panda.plist);
		cc.spriteFrameCache.addSpriteFrames(res.shoes.plist);
		cc.spriteFrameCache.addSpriteFrames(res.redshoes.plist);
		cc.spriteFrameCache.addSpriteFrames(res.spring.plist);
		cc.spriteFrameCache.addSpriteFrames(res.bird.plist);
		cc.spriteFrameCache.addSpriteFrames(res.enemy.plist);
		cc.spriteFrameCache.addSpriteFrames(res.magnet.plist);
		
		//load image to memory	
		String.prototype.endWith=function(s){
			if(s==null||s==""||this.length==0||s.length>this.length)
				return false;
			if(this.substring(this.length-s.length)==s)
				return true;
			else
				return false;
			return true;
		}
		
		//find all image
		var temp = [];
		for (var i in res) {
			if(typeof res[i] == "object"){
				for(var j in res[i]){
					if(res[i] instanceof Array) {
						continue;
					} else {
						if(typeof res[i][j] == "string"){
							if(!res[i][j].endWith("plist") && !res[i][j].endWith("mp3")) {
								temp.push(res[i][j]);
							}
						}
					}
				}
			} else {
				if(typeof res[i][j] == "string"){
					if(!res[i][j].endWith("plist") && !res[i][j].endWith("mp3")) {
						temp.push(res[i]);
					}
				}
			}
		}

		//load to mem
		for(var i in temp) {
			cc.textureCache.addImage(temp[i]);
		}
		
		//preload game objects
//		pre_bird = new Bird(-100, -100);
//		pre_frog = new Frog(-100, -100);
//		pre_magnet = new Magnet(-100, -100, 0.5);
//		pre_redshoes = new Redshoes(-100, -100);
//		pre_shoes = new Shoes(-100, -100);
//		pre_spring = new Spring(-100, -100, 0.7);	
	}
});