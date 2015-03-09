var GameScene = cc.Scene.extend({
	// the physic world.
	space: null,
	// the game layer.
	gameLayer: null,
	// the control layer.
	controlLayer: null,
	
	gameover:false,
	//shape to remove
	shapesToRemove: [],
	//judge beAte
	beAte: false,
	
	initSpace: function () {
		this.space = new cp.Space();
		this.space.gravity = cp.v(0, -1500);

		var wallBottom = new cp.SegmentShape(
				this.space.staticBody,
				// Start point
				cp.v(0, res.physics.groundHeight),
				// MAX INT:4294967295
				cp.v(4294967295, res.physics.groundHeight),
				// thickness of wall
				0);
		wallBottom.setCollisionType(SpriteTag.ground);
		this.space.addStaticShape(wallBottom);
		
		//Setup collision Handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.gold,
				this.collisionGold.bind(this), null, null, null);

		//frog collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.frog,
				this.collisionFrog.bind(this), null, null, null);
		
		//bird collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.bird,
				this.collisionBird.bind(this), null, null, null);
		
		//magnet collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.magnet,
				this.collisionMagnet.bind(this), null, null, null);
		
		//spring collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.spring,
				this.collisionSpring.bind(this), null, null, null);
		
		//shoes collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.shoes,
				this.collisionShoes.bind(this), null, null, null);
		
		//redshoes collision handler
		this.space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.redshoes,
				this.collisionRedshoes.bind(this), null, null, null);

		//control audio effect
		if(canAudioPlaying){
			cc.audioEngine.setEffectsVolume(1);
		} else {
			cc.audioEngine.setEffectsVolume(0);
		}
	},
	
	collisionRedshoes: function (arbiter, space) {
//		var shapes = arbiter.getShapes();
//		this.shapesToRemove.push(shapes[1]);
		
		this.gameLayer.redshoesGenerator.redshoes.removeFromLayer();

		this.rshoesEffect = new MagnetEffect();
		this.addChild(this.rshoesEffect, 2);
		this.rshoesEffect.getMagnet();

		this.gameLayer.player.getRedshoesAndSlowDown();
		//this.hubLayer.consumeMagnet();
//		setTimeout(function(){
//			//this.gameLayer.player.loseMagnet();
//			//this.magnetEffect.loseMagnet();
//		}.bind(this), 3000);

		cc.audioEngine.playEffect(res.sound.magnet);
	},
	
	collisionShoes: function (arbiter, space) {
		//var shapes = arbiter.getShapes();
		//this.shapesToRemove.push(shapes[1]);
		
		this.gameLayer.shoesGenerator.shoes.removeFromLayer();
		
		this.shoesEffect = new MagnetEffect();
		this.addChild(this.shoesEffect, 2);
		this.shoesEffect.getMagnet();

		this.gameLayer.player.getShoesAndSpeedUp();
		//this.hubLayer.consumeMagnet();
//		setTimeout(function(){
//			//this.gameLayer.player.loseMagnet();
//			//this.magnetEffect.loseMagnet();
//		}.bind(this), 3000);

		cc.audioEngine.playEffect(res.sound.speedup);
	},

	collisionSpring: function (arbiter, space) {
//		var shapes = arbiter.getShapes();
//		this.shapesToRemove.push(shapes[1]);
//		statistics.coins += 1;
		//play gold music
		this.gameLayer.player.getSpring();
		this.scheduleOnce(function(){
			this.gameLayer.player.loseSpring();
		}.bind(this), 1300);
		cc.audioEngine.playEffect(res.sound.spring);
	},
	
	collisionGold: function (arbiter, space) {
		var shapes = arbiter.getShapes();
		//this.shapesToRemove.push(shapes[1]);
		statistics.coins += 1;
		//remove golds
		var gold = this.gameLayer.goldGenerator.gold;
		for(var i in gold) {
			if(gold[i].getShape() == shapes[1]) {
				gold[i].removeFromLayer();
			}
		}

		//play gold music
		cc.audioEngine.playEffect(res.sound.gold_mp3);
	},

	collisionFrog: function(arbiter, space) {
		//var shapes = arbiter.getShapes();
		//judge eat or die
		if(this.gameLayer.player.status == 'jumpDown') {
			//this.shapesToRemove.push(shapes[1]);
			this.gameLayer.frogGenerator.frog.removeFromLayer();
			//play frog music
			cc.audioEngine.playEffect(res.sound.enemyDied);
			statistics.kill++;
		}else{
			this.beAte = true;
			//this.shapesToRemove.push(shapes[1]);
		}
	},
	
	collisionBird: function(arbiter, space) {
		//var shapes = arbiter.getShapes();
		//judge eat or die
		if(this.gameLayer.player.status == 'jumpDown') {
			//this.shapesToRemove.push(shapes[1]);
			this.gameLayer.birdGenerator.bird.removeFromLayer();
			//play frog music
			cc.audioEngine.playEffect(res.sound.enemyDied);
			statistics.kill++;
		}else{
			this.beAte = true;
			//this.shapesToRemove.push(shapes[1]);
		}
	},

	collisionMagnet: function(arbiter, space) {
//		var shapes = arbiter.getShapes();
//		this.shapesToRemove.push(shapes[1]);
		this.gameLayer.magnetGenerator.magnet.removeFromLayer();
		
		this.magnetEffect = new MagnetEffect();
		this.addChild(this.magnetEffect, 2);
		this.magnetEffect.getMagnet();
		
		this.gameLayer.player.getMagnet();
		this.hubLayer.consumeMagnet();
		setTimeout(function(){
			this.gameLayer.player.loseMagnet();
			this.magnetEffect.loseMagnet();
		}.bind(this), 15000);
		
		cc.audioEngine.playEffect(res.sound.magnet);
	},
	
	// called by schedule update.
	update: function (dt) {
		this.space.step(dt);
		
		if(!this.gameover) {

			var eyeX = this.gameLayer.getEyeX(), eyeY = Math.max(this.gameLayer.getEyeY(), 0); 

			if(this.gameLayer.player.sprite.getPositionY() < 800){
				this.controlLayer.setPosition(cc.p(-eyeX, -eyeY/2.6));
			} else {
				this.controlLayer.setPosition(cc.p(-eyeX, -eyeY));
			}

			this.nearBgLayer.refresh(eyeX / 2, eyeY);
			this.nearBgLayer.setPosition(cc.p(-eyeX / 2, -eyeY/5));
			
			this.farBgLayer.refresh(eyeX / 3, eyeY);
			this.farBgLayer.setPosition(cc.p(-eyeX/3, -eyeY/10));

			//remove collide objects 
//			for(var i = 0; i < this.shapesToRemove.length; i++) {
//				var shape = this.shapesToRemove[i];
//				this.gameLayer.removeObjectByShape(shape);
//			}
			
			//JUDGE GAME OVER
			if ( (this.gameLayer.player.sprite.getPositionY() < -100 || this.beAte) && !this.gameover) {
				this.gameLayer.player.died();
				//cc.director.pause();
				this.addChild(new GameOverLayer(this.space), 2);
				this.gameover = true;
				//play gameover music
				cc.audioEngine.stopMusic();
				cc.audioEngine.playEffect(res.sound.game_over);
				this.gameover = true;
				new_space.push(this.space);
			}
			
			if(this.gameLayer.player.body.getVel().x < 1) {
				this.beAte = true;
			}

			//got Magnet
			if(this.gameLayer.player.gotMagnet == true) {
				var gold = this.gameLayer.goldGenerator.gold;
				for(var i in gold) {
					if(this.gameLayer.player.sprite.getPositionX() - gold[i].getX() <= 10 && this.gameLayer.player.sprite.getPositionX() - gold[i].getX() >= -10 ) {
							gold[i].removeFromLayer();
							//play gold music
							statistics.coins += 1;
							if(statistics.coins % 5 == 0) {
								cc.audioEngine.playEffect(res.sound.gold_mp3);
							}
					}
				}
			}

			//delete useless gold
			//this.gameLayer.goldGenerator.update(dt);
//			this.gameLayer.frogGenerator.update(dt);
//			this.gameLayer.birdGenerator.update(dt);
//			this.gameLayer.magnetGenerator.update(dt);
//			this.gameLayer.springGenerator.update(dt);
//			this.gameLayer.shoesGenerator.update(dt);
//			this.gameLayer.redshoesGenerator.update(dt);
			
			//update running meter
			statistics.meter = parseInt(this.gameLayer.player.sprite.getPositionX() / 50);
		} else {
			return;
		}
	},
	
	onEnter: function() {
		this._super();

		this.initSpace();

		this.controlLayer = new cc.Layer();
		this.controlLayer.addChild(this.gameLayer = new GameLayer(this.space), 1);
		statistics.reset(this.gameLayer.player);

		this.addChild(this.farBgLayer = new GameBackgroundLayer(res.background[0]));
		this.addChild(this.nearBgLayer = new GameBackgroundLayer(res.background[1]));
		this.addChild(this.controlLayer, 0);
		this.addChild(this.hubLayer = new HubLayer(this), 1);
		
		//particle
		var particle = cc.ParticleSystem(res.particle.circle);
		particle.setPosition(800, 100);
		this.addChild(particle,100);
		//add background music
		if(canMusicPlaying) {
			cc.audioEngine.stopMusic();
			cc.audioEngine.playMusic(res.sound.bg_mp3, true);
			isMusicPlaying = true;
		}

		this.scheduleUpdate();
	},
	
	//quit game scene, clean up
	onExit: function() {
		this._super();
		this.removeAllChildren(true);
//		var gl = this.gameLayer;
//		gl.birdGenerator.bird.sprite.release();
//		gl.birdGenerator.bird.spriteSheet.release();
//		gl.frogGenerator.frog.sprite.release();
//		gl.frogGenerator.frog.spriteSheet.release();
//		gl.magnetGenerator.magnet.sprite.release();
//		gl.magnetGenerator.magnet.spriteSheet.release();
//		gl.redshoesGenerator.redshoes.sprite.release();
//		gl.redshoesGenerator.redshoes.spriteSheet.release();
//		gl.shoesGenerator.shoes.sprite.release();
//		gl.shoesGenerator.shoes.spriteSheet.release();
//		gl.springGenerator.spring.sprite.release();
//		gl.springGenerator.spring.spriteSheet.release();
//		
//		var gold = gl.goldGenerator.gold;
//		for(var i in gold) {
//			gold[i].sprite.release();
//			gold[i].spriteSheet.release();
//		}
	}

});