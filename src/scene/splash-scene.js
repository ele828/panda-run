/**
 * Splash Scene - the opening scene of the game.
 * <p>
 * It cope with the navigation logic and the logos display.
 * </p>
 * 
 * @class
 * @extends cc.Scene
 */
var SplashScene = cc.Scene.extend(/** @lends SplashScene# */{

	/**
	 * Constructor of cc.Scene
	 */
	_className: "SplashScene",

	ctor: function () {
		this._super();
		this.init();
		var open = new GameOpeningLayer();
		open.bake();
		this.addChild(open, 1, 1);
		setTimeout(function(){
			var layer = new GameMenuLayer();
			
			if(sys.localStorage.getItem("username")){
				cc.director.runScene(new WelcomeScene());
			} else {
				cc.director.runScene(new InfoScene());
			}
		}.bind(this), 3000);
	}
});
