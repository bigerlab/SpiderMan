/* 当前场景 */
let VIEW = null;
/* 默认立方体的尺寸 */
let CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
/* 初始着力线的尺寸 */
let CylinderMeshCube = { X: .02, Y: 0.02, Z: 8 };
/* 背景图的尺寸 */
let bgsize = { X: 30, Y: 80, Z: 0.001 };
/* 圆周运动参数 */
let GLOB_Circumferential = {
    angularVelocity: 0.001,
    speed: 0.001,
    increment: 0.0005,
};
/* 服务器地址 */
let SERVERURL = "";
/* 立方体贴图 */
let cubeTexture = [
    [
        "res/image/color/stone.png",
        "res/image/color/stone2.png"
    ]
];
/* 圆柱体贴图 */
let CylinderMeshTexture = [
    "res/image/color/stone.png",
    "res/image/color/stone2.png"
];
/* 着力点贴图 */
let Circular_point_texture = [
    "res/image/color/stone.png",
    "res/image/color/stone2.png"
];
/*  全局插件 */
var TOOLS = {
    // 切换场景并清空上级场景
    runScene: (scene, arg = null) => {
        Laya.stage.removeChildren();
        Laya.stage.removeSelf();
        VIEW = new scene(arg);
    },
    // 获取立方体
    pullCube: (texture, pool = false) => {
        if (pool) {
            let cube = Laya.Pool.getItemByCreateFun("cube", () => {
                var box = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
                box.meshRender.material = material;
                return box;
            });
            return cube;
        }
        else {
            //return box;
        }
    },
    // 获取圆柱体
    getCylinderMesh: (texture) => {
        let cube = Laya.Pool.getItemByCreateFun("CylinderMesh", () => {
            var box = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z));
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[texture]);
            material.albedo = new Laya.Vector4(1, 1, 2, 0.3);
            material.renderMode = Laya.StandardMaterial.RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE;
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 对象池回收
    pushCube: (type, target, delet = false) => {
        if (delet) {
            target.destroy();
        }
        else {
            Laya.stage.removeChild(target);
            Laya.Pool.recover(type, target);
        }
    },
    // 获取两个坐标间的距离
    getline: (coordinateA, coordinateB) => {
        let point = new laya.maths.Point(coordinateA.x, coordinateA.y);
        return point.distance(coordinateB.x, coordinateB.y);
    },
    // 获取两点之间角度
    getRad: (x1, y1, x2, y2) => {
        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        var z = Math.sqrt(x * x + y * y);
        return Math.round((Math.asin(y / z) / Math.PI * 180));
    },
    // 根据弧长计算角度
    getAngle: (radian, radius) => {
        return radian / (Math.PI * radius) * 180;
    },
    // 弧度与角度互转
    getAngleTransform: (value, type) => {
        if (type === "ang") {
            // 弧度转角度 返回角度
            return value * (180 / Math.PI);
        }
        else if (type === "rad") {
            // 角度转弧度 返回弧度
            return value * (Math.PI / 180);
        }
    },
    // AJAX
    Ajax: (request) => {
        return new Promise((resolve, reject) => {
            let ajax = new XMLHttpRequest();
            ajax.open('GET', request, true);
            ajax.onreadystatechange = () => {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        resolve(ajax.response);
                    }
                    else {
                        reject(this.response);
                    }
                }
            };
            ajax.send();
        });
    },
    // 获取json数据
    getJSON: url => {
        let promise = new Promise(function (resolve, reject) {
            let handler = function () {
                if (this.readyState !== 4)
                    return;
                if (this.status === 200) {
                    resolve(this.response);
                }
                else {
                    reject(new Error(this.statusText));
                }
                ;
            };
            let client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();
        });
        return promise;
    },
    // 随机算法
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
};
/* 动画 */
var animation = {
    // 平移
    move: (target, type, length, time, delay, loop = false) => {
        if (type === "y") {
            // 水平
            if (loop) {
                // 循环
                var ctr = false;
                var _ = () => {
                    ctr = !ctr;
                    if (ctr) {
                        Laya.Tween.to(target, { top: length }, time, Laya.Ease.bounceOut, Laya.Handler.create(this, _), delay);
                    }
                    else {
                        Laya.Tween.to(target, { top: length }, time, Laya.Ease.bounceOut, Laya.Handler.create(this, _), delay);
                    }
                };
                _();
            }
            else {
                Laya.Tween.to(target, { top: length }, time, Laya.Ease.bounceOut, null, delay);
            }
        }
        else if (type === "x") {
            // 垂直
            Laya.Tween.to(target, { left: length }, time, Laya.Ease.bounceOut, null, delay);
        }
    },
    // 缩放
    scale: (target, Xscale, Yscale, time, delay) => {
        Laya.Tween.to(target, { scaleX: Xscale, scaleY: Yscale }, time, Laya.Ease.bounceOut, null, delay);
    }
};
/* 音频管理 */
let AUDIO = {
    play: (type) => {
        let url = null, audio_type = "Musice";
        switch (type) {
            case "bg_1":
                url = "https://shop.yunfanshidai.com/xcxht/pqxcx/res/01.mp3";
                break;
            case "bg_2":
                url = "https://shop.yunfanshidai.com/xcxht/pqxcx/res/02.mp3";
                break;
        }
        ;
        if (audio_type === "Musice") {
            Laya.SoundManager.playMusic(url, 0); // 音乐
        }
        else {
            Laya.SoundManager.playSound(url, 1); // 音效
        }
    },
    stop: (url) => {
        Laya.SoundManager.stopSound(url);
    }
};
/**
 *
 *  服务器对接数据格式
 *
 */
let data = {
    Checkpoint: 1,
    data: {}
};
//# sourceMappingURL=common.js.map