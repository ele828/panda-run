var GameBackgroundLayer = cc.Layer.extend({

	nearBg: null,
	nearBgWidth: null,
	nearBgIndex: 0,

	ctor: function (res) {
		this._super();

		this.nearBg = this._tileBg(this._createBg(res).bind(this));
	},

	refresh: function (eyeX, eyeY) {
		var newNearBgIndex = parseInt(eyeX / this.nearBg[0].width);
		if (this.nearBgIndex == newNearBgIndex) {
			return false;
		}
		this.nearBg[(newNearBgIndex + this.nearBg.length - 1) % this.nearBg.length].setPositionX(this.nearBg[0].width * (newNearBgIndex + this.nearBg.length - 1));
		this.nearBgIndex = newNearBgIndex;
		
		return true;
	},

	_tileBg: function (createMethod) {
		var winSize = cc.director.getWinSize();
		var doubleWinWidth = 2 * winSize.width;
		var tiles = [];
		var remainWidth = doubleWinWidth;
		do {
			var nearBg = createMethod(cc.p(doubleWinWidth - remainWidth, 0));
			remainWidth -= nearBg.width;
			tiles.push(nearBg);
			this.addChild(nearBg);
		} while (remainWidth > 0);
		if (tiles.length < 2) {
			var nearBg = createMethod(cc.p(doubleWinWidth - remainWidth, 0));
			tiles.push(nearBg);
			this.addChild(nearBg);
		}
		return tiles;
	},

	_createBg: function (res) {
		return function (pos) {
			pos = pos || cc.p(0, 0);
			var bg = new cc.Sprite(res);
			bg.setPosition(pos);
			bg.attr({
				anchorX: 0,
				anchorY: 0
			});
			return bg;
		};
	}
});