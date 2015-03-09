/**
 * The play layer.
 * <p>
 * It manages all the game objects.
 * </p>
 */
var PlayLayer = cc.Layer.extend(/** @lends PlayLayer# */{

	// the physics space.
	space: null,

	// virtual Pos of player on the scene.
	camera: null,

	// the player sprite.
	player: null,

	// all objects
	objects: [],

	ctor: function(camera, space, statistics, settings) {
		this._super();

		var self = this;
		var winSize = cc.director.getWinSize();

		this.space = space;

		this.camera = camera;
		this.camera.addListener(function (pos) {
			self.setPosition(cc.p(-pos.x, -pos.y));
		});

		var goldGenerator = new ObjectShapedGenerator(this);
		this.platformGenerator = new PlatformGenerator(this, true);
		this.invGenerators = [
		                      goldGenerator,
		                      // double jump shoe
		                      new ObjectRandomGenerator(this),
		                      // speed up shoe
		                      new ObjectRandomGenerator(this, function () {
		                    	  var shoe = new SpeedUpShoe(-100, -100);
		                    	  return function (x, y) {
		                    		  shoe.continuedTime = 1500 * 1500 * Math.random();
		                    		  shoe.sprite.setPosition(cc.p(x, y));
		                    		  return shoe;
		                    	  };
		                      }(), {height: 150, gap: 500}),
		                      new ObjectRandomGenerator(this, function () {
		                    	  var cloth = new MagnetCloth(-100, -100, goldGenerator.gold, statistics);
		                    	  return function (x, y) {
		                    		  cloth.continuedTime = 5000 + 3000 * Math.random();
		                    		  cloth.sprite.setPosition(cc.p(x, y));
		                    		  return cloth;
		                    	  };
		                      }(), {height: 170, gap: 800}),
		                      ];

		// the player is the center of the screen.
		var player = this.player = new Hero(winSize.width / 2, winSize.height / 2);
		this.addRole(player);

		// Event handling.
		var guestureRecognizer = new SimpleTouchRecognizer();
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var pos = touch.getLocation();
				guestureRecognizer.beginPoint(pos);
				return true;
			},
			onTouchMoved: function (touch, event) {
				var pos = touch.getLocation();
				guestureRecognizer.movePoint(pos);
				return true;
			},
			onTouchEnded: function (touch, event) {
				guestureRecognizer.endPoint();

				var guesture = guestureRecognizer.result;
				switch (guesture) {
				case 'down':
					player.quickDown();
					break;
				default:
					// tap to jump.
					player.jump();
					if (settings.audioEnabled) {
						cc.audioEngine.playEffect(res.sound.jump_mp3);
					}
					break;
				}
				return true;
			}
		}, this);
	},

	update: function (dt) {
		var winSize = cc.director.getWinSize();
		var player = this.player;

		// update the player.
		player.update(dt);

		// update the genrator.
		var platform = this.platformGenerator.update(dt);
		// add gold randomly
		if (platform && Math.random() * 2 > 1) {
			this.invGenerators.forEach(function (gen) {
				gen.generate(platform);
			});
		}

		// update the camera.
		var camera = this.camera;
		var cameradx = player.sprite.getPositionX() - winSize.width / 2 - camera.x;
		camera.x += cameradx;
		var camerady = Math.min(Math.max(player.sprite.getPositionY() - winSize.height / 2, 0) - camera.y, winSize.height);
		if (camerady > 0) {
			camera.y += Math.min(camerady, 1);
		} else if (camerady < 0) {
			camera.y += Math.max(camerady, -2);
		}
	},

	// create
	addRole: function (role) {
		role.addToLayer(this.space, this);
	},

	// remove
	removeObjectByShape: function (shape) {
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].getShape() == shape) {
				this.objects[i].removeFromLayer();
				this.objects.splice(i, 1);
				break;
			}
		}
	},

	onExit: function () {
		this._super();
		this.invGenerators.forEach(function (gen) {
			gen.cleanup();
		});
	},

	getEyeX: function () {
		var winSize = cc.director.getWinSize();
		return this.player.sprite.getPositionX() - winSize.width / 2;
	},

	getEyeY: function () {
		var winSize = cc.director.getWinSize();
		return this.player.sprite.getPositionY() - winSize.height / 2;
	}
});