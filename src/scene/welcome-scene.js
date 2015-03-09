/**
 * Welcome Scene - the opening scene of the game.
 * <p>
 * It cope with the navigation logic and the logos display.
 * </p>
 * 
 * @class
 * @extends cc.Scene
 */
var WelcomeScene = cc.Scene.extend(/** @lends WelcomeScene# */{
	
	/**
	 * Constructor of cc.Scene
	 */
	_className: "WelcomeScene",
	
	ctor: function () {
		this._super();
		this.init();
		var layer = new GameMenuLayer();
		this.addChild(layer, 1);
	}
});
