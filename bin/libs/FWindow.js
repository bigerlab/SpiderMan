var yftools;
(function (yftools) {
    var defImg = "data:image/png;base64,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";
    var httpReq = function (ip, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", ip, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var result = {};
                if (xhr.status == 200) {
                    var response = xhr.responseText;
                    result = JSON.parse(response);
                }
                if (callback) {
                    callback(result);
                }
            }
        };
        xhr.send();
    };
    var btnClick = function (btn, func, caller, clear) {
        if (clear === void 0) { clear = false; }
        if (clear) {
            btn.offAll();
        }
        btn.on(Laya.Event.CLICK, caller, func);
    };
    var YFWindow = /** @class */ (function () {
        function YFWindow(adr, attr) {
            if (attr === void 0) { attr = {}; }
            var _this = this;
            this.address = adr;
            this.count = 0;
            this.arg = attr;
            httpReq(this.address, function (res) {
                _this.init(res);
            });
            Laya.timer.loop(10, this, this.refresh);
        }
        YFWindow.prototype.init = function (info) {
            var _this = this;
            this.reqInfo = info;
            var sprite = new Laya.Sprite();
            sprite.width = Laya.stage.width;
            sprite.height = Laya.stage.height;
            sprite.pos(0, 0);
            sprite.zOrder = 999999;
            sprite.mouseThrough = true;
            Laya.stage.addChild(sprite);
            var btn = new Laya.Button();
            // btn.loadImage(res.icon + "mc.png",0,0,0,0,Handler.create(this,(a,b)=>{
            // 	btn.pos(Laya.stage.width - btn.width / 2,100);
            // }));
            btn.stateNum = 1;
            sprite.addChild(btn);
            Laya.loader.load((info.icon || "") + "mc.png", Laya.Handler.create(this, function (a, b) {
                if (a) {
                    btn.skin = info.icon + "mc.png";
                }
                else {
                    btn.loadImage(defImg);
                }
                btn.anchorX = 0.5;
                btn.anchorY = 0.5;
                btn.pos(Laya.stage.width - btn.width, 200);
            }));
            btnClick(btn, function () {
                if (btn["skip"]) {
                    btn["skip"] = null;
                }
                else {
                    if (_this.arg["fCallback"]) {
                        _this.arg["fCallback"](_this.reqInfo);
                    }
                    else {
                        var tip = new Laya.Label("请传入浮标回调【fCallback】");
                        tip.anchorX = 0.5;
                        tip.x = Laya.stage.width / 2;
                        tip.y = Laya.stage.height / 2;
                        tip.fontSize = 50;
                        tip.color = "#00ffff";
                        sprite.addChild(tip);
                        Laya.Tween.to(tip, { y: 200 }, 1500, null, Laya.Handler.create(_this, function () {
                            sprite.removeChild(tip);
                        }));
                    }
                }
            }, this);
            sprite.mouseEnabled = true;
            sprite.on(Laya.Event.MOUSE_DOWN, this, function (obj, e) {
                if (obj.getBounds().contains(e.stageX, e.stageY)) {
                    obj.drag = true;
                    _this.startP = new Laya.Point(e.stageX, e.stageY);
                }
            }, [btn]);
            // sprite.on(Laya.Event.MOUSE_MOVE, this, (obj, e)=>{
            // 	if(obj.drag){
            // 		obj.x = e.stageX;
            // 		obj.y = e.stageY;
            // 		if(startP.distance(e.stageX, e.stageY) > 50){
            // 			obj.skip = true; //跳过点击事件
            // 		}
            // 	}
            // },[btn]);
            sprite.on(Laya.Event.MOUSE_UP, this, function (obj, e) {
                if (obj.drag) {
                    if (obj.x < Laya.stage.width / 2) {
                        obj.x = obj.width / 2;
                    }
                    else {
                        obj.x = Laya.stage.width - obj.width / 2;
                    }
                    if (obj.y < obj.height / 2) {
                        obj.y = obj.height / 2;
                    }
                    else if (obj.y > Laya.stage.height - obj.height / 2) {
                        obj.y = Laya.stage.height - obj.height / 2;
                    }
                }
                obj.drag = null;
                _this.startP = null;
            }, [btn]);
            this.touchSp = sprite;
            this.floatIcon = btn;
        };
        YFWindow.prototype.refresh = function () {
            var _this = this;
            if (!this.touchSp) {
                return;
            }
            if (!this.touchSp.parent) {
                Laya.stage.addChild(this.touchSp);
            }
            if (this.floatIcon["drag"]) {
                this.floatIcon.x = Laya.stage.mouseX;
                this.floatIcon.y = Laya.stage.mouseY;
                if (this.startP.distance(Laya.stage.mouseX, Laya.stage.mouseY) > 50) {
                    this.floatIcon["skip"] = true; //跳过点击事件
                }
            }
            this.count++;
            if (this.count > 1000) {
                this.count = 0;
                httpReq(this.address, function (res) {
                    if (_this.floatIcon) {
                        console.log(res);
                    }
                });
            }
        };
        return YFWindow;
    }());
    yftools.YFWindow = YFWindow;
})(yftools || (yftools = {}));
//# sourceMappingURL=FWindow.js.map