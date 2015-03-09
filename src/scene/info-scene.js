/**
 * the scene let player enter nicknames
 */
var InfoScene = cc.Scene.extend({
	onEnter: function() {
		this._super();
		this.addChild(new InfoLayer());
	}
});