var context = (function () {
	var welcomeScene = null;
	var playScene = null;
	
	function Context() {
		this.welcomeScene = null;
		this.playScene = null;
	}
	
	Context.prototype = {
		get welcomeScene() {
			var scene = this.welcomeScene || (welcomeScene = new WelcomeScene());
			return scene;
		},
		get playScene() {
			var scene = this.playScene || (playScene = new PlayScene());
			return scene;
		}
	};
	
	return Context;
}());