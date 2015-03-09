var InfoLayer = cc.Layer.extend({
	
	ctor: function() {
		this._super();
		
		var winsize = cc.director.getWinSize();
		this.bg = new cc.Sprite(res.menu.bg);
		this.bg.setPosition(cc.p(winsize.width/2, winsize.height/2));
		this.addChild(this.bg);
		
		this.logo = new cc.Sprite(res.menu.logo);
		this.logo.setPosition(cc.p(-200, winsize.height-100));
		this.logo.setScale(0.4);
		this.addChild(this.logo)
		
		var actionTo = cc.MoveTo.create(1, cc.p(150, winsize.height-100)).easing(cc.easeBounceOut());
		this.logo.runAction(actionTo);
		
		this.board = new cc.Sprite(res.info.board);
		this.board.setPosition(cc.p(winsize.width/2, winsize.height));
		this.addChild(this.board);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
		this.board.runAction(actionTo);
		
//		var textField = new cc.TextFieldTTF("<click here for input>",
//				"Helvetica",
//				50);
//		textField.setPosition(cc.p(winsize.width/2, winsize.height/2));
//		this.addChild(textField, 20);
		
		var textField = new ccui.TextField();
		textField.setMaxLengthEnabled(true);
		textField.setMaxLength(20);
		textField.setTouchEnabled(true);
		textField.fontName = "Helvetica";
		textField.fontSize = 25;
		textField.setPlaceHolder("请输入昵称^_^");
		textField.x = winsize.width/2+50;
		textField.y = winsize.height;
		this.addChild(textField);
		
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2+50, winsize.height/2-5)).easing(cc.easeElasticOut());
		textField.runAction(actionTo);
		
		this.done = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.info.done),
				new cc.Sprite(res.info.done),
				function() {
					var username = textField.getString();
					sys.localStorage.setItem("username", username);
					cc.director.runScene(new WelcomeScene());
				}.bind(this), this));
		this.done.setPosition(cc.p(winsize.width/2+120, winsize.height));
		this.addChild(this.done, 10);
		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2+120, winsize.height/2-65)).easing(cc.easeElasticOut());
		this.done.runAction(actionTo);
		
	},
	
	onClickTrackNode:function (clicked) {
		var textField = this._trackNode;
		if (clicked) {
			// TextFieldTTFTest be clicked
			cc.log("TextFieldTTFActionTest:CCTextFieldTTF attachWithIME");
			textField.attachWithIME();
		} else {
			// TextFieldTTFTest not be clicked
			cc.log("TextFieldTTFActionTest:CCTextFieldTTF detachWithIME");
			textField.detachWithIME();
		}
	},
	
	onTextFieldInsertText:function (sender, text, len) {
		// if insert enter, treat as default to detach with ime
		if ('\n' == text) {
			return false;
		}

		// if the textfield's char count more than m_nCharLimit, doesn't insert text anymore.
		if (sender.getCharCount() >= this._charLimit) {
			return true;
		}

		// create a insert text sprite and do some action
		var label = new cc.LabelTTF(text, TEXT_INPUT_FONT_NAME, TEXT_INPUT_FONT_SIZE);
		this.addChild(label);
		var color = cc.color(226, 121, 7);
		label.color = color;

		// move the sprite from top to position
		var endX = sender.x, endY = sender.y;
		if (sender.getCharCount()) {
			endX += sender.width / 2;
		}

		var duration = 0.5;
		label.x = endX;
		label.y = cc.director.getWinSize().height - label.height * 2;
		label.scale = 8;

		var seq = cc.sequence(
				cc.spawn(
						cc.moveTo(duration, cc.p(endX, endY)),
						cc.scaleTo(duration, 1),
						cc.fadeOut(duration)),
						cc.callFunc(this.callbackRemoveNodeWhenDidAction, this));
		label.runAction(seq);
		return false;
	}
});