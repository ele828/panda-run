/**
 * Play scene.
 * <p>
 * The scene manages the game objects and the play.
 * </p>
 * 
 * @class
 * @extends cc.Scene
 * 
 * @property {Object} space the space object.
 */
var PlayScene = cc.Scene.extend(/** @lends PlayScene# */{
	
	/**
	 * Constructor of cc.Scene
	 */
	_className: "PlayScene",
	
	/**
	 * The physic space object.
	 */
	space: null,
	
	/**
	 * The camera of the scene.
	 */
	camera: null,
	
	/**
	 * The statistics.
	 */
	statistics: null,
	
	/**
	 * The settings.
	 */
	settings: null,
	
	/**
	 * The game state.
	 */
	state: null,
	
	_initState: function () {
		var gameover = false;
		var self = this;
		return {
			get gameover() {
				return gameover;
			},
			set gameover(g) {
				gameover = g;
			}
		}
	},

	_initSpace: function () {
		var space = new cp.Space();
		space.gravity = cp.v(0, -1500);

		// the ground.
		var wallBottom = new cp.SegmentShape(
				space.staticBody,
				// Start point
				cp.v(0, res.physics.groundHeight),
				// MAX INT:4294967295
				cp.v(4294967295, res.physics.groundHeight),
				// thickness of wall
				0);
		wallBottom.setCollisionType(SpriteTag.ground);
		space.addStaticShape(wallBottom);

		return space;
	},
	
	_initCamera: function () {
		var winSize = cc.director.getWinSize();
		var centerPos = cc.p(- winSize.width / 2, 0);
		var destPos = null;
		var listeners = [];
		var dirty = false;
		return {
			addListener: function (listener) {
				listeners.push(listener);
			},
			set x(x) {
				centerPos.x = x;
				dirty = true;
			},
			get x() {
				return centerPos.x;
			},
			set y(y) {
				centerPos.y = y;
				dirty = true;
			},
			get y() {
				return centerPos.y;
			},
			set pos(pos) {
				centerPos.x = pos.x;
				centerPos.y = pos.y;
				dirty = true;
			},
			update: function () {
				if (dirty) {
					listeners.forEach(function (listener) {
						listener(centerPos);
					});
					dirty = false;
				}
			}
		};
	},
	
	_initStatistics: function () {
		var self = this;
		var coins = 0;
		return {
			set coins(c) {
				coins = c;
			},
			get coins() {
				return coins;
			},
			get score() {
				return this.coins + this.meter;
			},
			get meter() {
				return parseInt(self.camera.x / 100);
			}
		};
	},
	
	_initSettings: function () {
		var audio = {
			enabled: false,
			volume: 1
		};
		var video = {
			quality: 0
		}
		return {
			set audioVolume(v) {
				audio.volume = v;
			},
			get audioVolume() {
				return audio.volume;
			},
			set audioEnabled(t) {
				if (t) {
					// add background music
					cc.audioEngine.playMusic(res.sound.bg_mp3, true);
					audio.enabled = true;
				} else {
					cc.audioEngine.stopMusic();
					audio.enabled = false;
				}
			},
			get audioEnabled() {
				return audio.enabled;
			},
			set videoQuality(quality) {
				if (quality) {
					var particle = cc.ParticleSystem(res.particle.circle);
					particle.setPosition(800, 100);
					this.addChild(particle, 100);
				}
				video.quality = quality;
			},
			get videoQuality() {
				return video.quality;
			}
		}
	},
	
	/**
	 * Invoke on scheduled update.
	 */
	update: function (dt) {
		if(!this.state.gameover) {
			this.space.step(dt);
			
			// Update the layers. 
			// Don't schedule update in layers itself in case of delay of the physics.
			this.playLayer.update();

			this.camera.update();
		}
	},
	
	onExit: function () {
		this.unscheduleUpdate();
		this._super();
	},

	onEnter: function() {
		this._super();

		// the initial variables.
		var space = this.space = this._initSpace();
		var camera = this.camera = this._initCamera();
		var statistics = this.statistics = this._initStatistics();
		var settings = this.settings = this._initSettings();
		var state = this.state = this._initState();
		var self = this;

		// default settings
		settings.videoQuality = 0;
		settings.audioEnabled = false;
		
		this.addChild(new RepeatBackgroundLayer(camera, res.background[0], {
			scaleX: 2,
			scaleY: 10
		}));
		this.addChild(new RepeatBackgroundLayer(camera, res.background[1], {
			scaleX: 3,
			scaleY: 10
		}));

		var playLayer = this.playLayer = new PlayLayer(camera, space, statistics, settings);
		this.addChild(playLayer);
		
		var hubLayer = this.hubLayer = new HubLayer(playLayer.player, statistics, settings, camera);
		this.addChild(hubLayer);
		
		// Setup collision Handler
		space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.gold,
				function (arbiter, space) {
					var shapes = arbiter.getShapes();
					var coin = shapes[1];
					statistics.coins += 1;
					coin.body.spriteObj.removeFromLayer();
					coin.body.spriteObj.available = false;
				}, null, null, null);

		// Setup game over detection.
		space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.ground,
				function (arbiter, space) {
					state.gameover = true;
					self.addChild(new StatisticsLayer(statistics));
				}, null, null, null);
		
		space.addCollisionHandler(
				SpriteTag.player,
				SpriteTag.inventory,
				function(arbiter, space) {
					var shapes = arbiter.getShapes();
					var inventory = shapes[1].body.spriteObj;
					var hero = shapes[0].body.spriteObj;
					inventory.equip(hero, this);
				}.bind(this), null, null, null);

		// schedule the updates.
		this.scheduleUpdate();
	},
	
	addInventoryIndicator: function (ind) {
		this.hubLayer.addIndicator(ind);
	},
	
	removeInventoryIndicator: function (ind) {
		this.hubLayer.removeIndicator(ind);
	}

});