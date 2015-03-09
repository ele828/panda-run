/**
 * The network play layer.
 * <p>
 * It manages all the game objects.
 * </p>
 */
var NetworkSlavePlayLayer = cc.Layer.extend(/** @lends NetworkSlavePlayLayer# */{

	// the physics space.
	space: null,

	// virtual Pos of player on the scene.
	camera: null,

	// the socket.io client.
	socketio: null,

	// the player sprite.
	player: null,

	touchable: false,

	// all objects
	objects: [],

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

		this.platformGenerator = new PlatformGenerator(this, false);

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
						socketio.emit('game:play', JSON.stringify({action:'quick-down'}));
						break;
					default:
						// tap to jump.
						socketio.emit('game:play', JSON.stringify({action:'jump'}));
						if (settings.audioEnabled) {
							cc.audioEngine.playEffect(res.sound.jump_mp3);
						}
						break;
					}
				}

				return true;
			}
		}, this);

		this.socketio.on('game:play', function (data) {
			data = JSON.parse(data);
			
			var player = data.args[0].game.player;
			var platform = data.args[0].game.platform;
			var statistics = data.args[0].game.statistics;
			var camera = data.args[0].game.camera;
			var touchable = data.args[0].game.touchable;
			
			this.statistics.sync(statistics);
			this.camera.sync(camera);
			this.touchable = touchable;
			
			if (platform) {
				this.addRole(new Platform(platform.x, platform.y, platform.length))
			}
			
			this.player.sprite.setPosition(cc.p(player.x, player.y));
			this.player.status = player.status;
		}.bind(this));
	},

	update: function (dt) {
		var winSize = cc.director.getWinSize();
		var player = this.player;

		// update the player.
		player.update(dt);
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