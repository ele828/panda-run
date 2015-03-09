var SimpleTouchRecognizer = cc.Class.extend(/**@lends SimpleTouchRecognizer# */{
	
	// the points to store.
	points: [],
	// the result.
	result: null,
	
	ctor: function() {
		this.points = [];
		this.result = null;
	},
	
	beginPoint: function(x, y) {
		var pos;
		if (y) {
			pos = cc.p(x, y);
		} else {
			pos = x;
		}
		
		// clear the result.
		this.points = [pos];
		this.result = null;
	},
	
	movePoint: function (x, y) {
		if (!y) {
			this.points.push(x);
		} else {
			this.points.push(new Point(x, y));
		}

		if (this.result == "not support") {
			return;
		}

		var newRtn = "";
		var len = this.points.length;
		var dx = this.points[len - 1].X - this.points[len - 2].X;
		var dy = this.points[len - 1].Y - this.points[len - 2].Y;

		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 0) {
				newRtn = "right";
			} else {
				newRtn = "left";
			}
		} else {
			if (dy > 0) {
				newRtn = "up";
			} else {
				newRtn = "down";
			}
		}

		// first set result
		if (this.result == "") {
			this.result = newRtn;
			return;
		}

		// if diretcory change, not support Recongnizer
		if (this.result != newRtn) {
			this.result = "not support";
		}
	},
	
	endPoint: function() {
		if (this.points.length < 3) {
			// less then 3 points, should be a tap.
			return "tap";
		}
		return this.result;
	},
	
	getPoints: function() {
		return this.points;
	}
});
