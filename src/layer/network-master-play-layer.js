/**
 * The network play layer.
 * <p>
 * It manages all the game objects.
 * </p>
 */
var NetworkMasterPlayLayer = cc.Layer.extend(/** @lends NetworkMasterPlayLayer# */{

	// the physics space.
	space: null,

	// virtual Pos of player on the scene.
	camera: null,
	
	statistics: null,
	
	// the socket.io client.
	socketio: null,

	// the player sprite.
	player: null,

	// all objects
	objects: [],
	
	// check if touchable.
	touchable: true,

	ctor: function(socketio, camera, space, statistics, settings) {
		this._super();

		var self = this;
		var winSize = cc.director.getWinSize();

		this.space = space;
		
		this.socketio = socketio;

		this.camera = camera;
		this.camera.addListener(function (pos) {
			self.setPosition(cc.p(-pos.x, -pos.y));
		});
		
		this.statistics = statistics;

		this.platformGenerator = new PlatformGenerator(this, true);

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

				if (self.touchable) {
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
					self.touchable = false;
				}
				
				return true;
			}
		}, this);
		
		var platform = this.platformGenerator.lastPlatform;
		
		// sync the position of the layer.
		this.socketio.emit('game:play', JSON.stringify({
			camera: camera,
			player: {
				x: this.player.sprite.getPositionX(),
				y: this.player.sprite.getPositionY(),
				status: this.player.status
			},
			platform: platform && {
				x: platform.getX(),
				y: platform.getY(),
				length: platform.length
			},
			statistics: this.statistics,
			touchable: false
		}));
		
		this.socketio.on('game:play', function (data) {
			var game = JSON.parse(data).args[0].game;
			if (game.action == 'jump') {
				this.player.jump();
			} else if (game.action == 'quick-down') {
				this.player.quickDown();
			}
			self.touchable = true;
		}.bind(this));
	},

	update: function (dt) {
		var winSize = cc.director.getWinSize();
		var player = this.player;

		// update the player.
		player.update(dt);

		// update the genrator.
		var platform = this.platformGenerator.update(dt);

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
		
		// sync the position of the layer.
		this.socketio.emit('game:play', JSON.stringify({
			camera: camera,
			player: {
				x: this.player.sprite.getPositionX(),
				y: this.player.sprite.getPositionY(),
				status: this.player.status
			},
			platform: platform && {
				x: platform.getX(),
				y: platform.getY(),
				length: platform.length
			},
			statistics: this.statistics,
			touchable: !this.touchable
		}));
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