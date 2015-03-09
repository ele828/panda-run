var statistics = {

	coins: 0,
	meter: 0,
	kill: 0,
	
	get score() {
		return this.coins * 10;
	},
	
	get length() {
		return parseInt(this.hero.sprite.getPositionX() / 100)
	},
	
	reset: function (hero) {
		this.hero = hero;
		this.coins = 0;
		this.meter = 0;
		this.kill = 0;
	}
};