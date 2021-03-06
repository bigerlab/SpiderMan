/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *
 */
var WetchGame;
(function (WetchGame) {
    class gameScene {
        constructor() {
            this.Cube_number = 0; // 记录立方体的总数与当前读取到路由表的数据位置
            this.Router_game = null; // 游戏的路由表
            this.cube_bg_type = true; // 立方体的贴图
            this.Lead_cube = null; // 主角模型
            this.radius = 1; // 主角运动圆半径
            this.angle = 270; // 主角当前角度
            this.angleSpeed = angleSpeed; // 弧形加速度
            this.Circular_obj = null; // 抓力点对象
            this.FourcePointRouter = []; //着力点路由表
            this.FoucePointIndex = 0; // 记录当前着力点的下标
            this.accelerate = false; //主角加速运动开关
            this.whereabouts = false; //主角下落运动开关
            this.Lead_radian = 60; //控制抛物线运动角度
            this.LeadLoop = true; //主角循环运动开启
            this.Leaddirection = true; //主角循环运动方向
            this.parabola = {
                speedX: 2,
                speedY: -2,
                gravity: 0.0098,
            };
            /**
             *
             * 场景绘制
             *
             */
            // 绘制初始场景
            this.initScene = () => {
                //添加3D场景
                var scene = Laya.stage.addChild(new Laya.Scene());
                this.Game_scene = scene;
                //添加摄像机
                var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
                camera.transform.translate(new Laya.Vector3(-1, 10, 6), false);
                camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                this.camera = camera;
                //平行光
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.direction = new Laya.Vector3(2, -2, -5);
                this.directionLight = directionLight;
                //添加背景图
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(50, 0.001, 50)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/1.png");
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 5, -1);
            };
            /**
             *
             * 事件
             *
             */
            this.eventSwitch = () => {
                // 鼠标按下
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, () => {
                    this.LeadLoop = false; //关闭自转
                    this.ForceLineMain("start"); //绘制着力线
                    this.RenderCube(2);
                });
                // 鼠标松开
                Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
                    this.ForceLineMain("end"); //回收着力线
                });
            };
            /**
             *
             * 着力点与着力线
             *
             */
            // 着力线入口
            this.ForceLineMain = (status) => {
                if (status === "init") {
                    let target = TOOLS.getCylinderMesh(0);
                    this.Game_scene.addChild(target);
                    this.ForceLineObj = target;
                    target.transform.pivot = new Laya.Vector3(0, 0.05, 0);
                    this.forceLine();
                    this.accelerate = this.whereabouts = false;
                }
                else if (status === "start") {
                    this.forceLine();
                }
                else if (status === "end") {
                    this.deleteFoce();
                }
            };
            // 关闭着力线
            this.deleteFoce = () => {
                let target = this.ForceLineObj;
                target.transform.scale = new Laya.Vector3(1, 1, 1);
                this.accelerate = false; // 关闭主角加速运动
                this.whereabouts = true; // 开启下坠
                this.parabola.speedX = this.angleSpeed * 0.5; //水平初速度
                this.parabola.speedY = -this.angleSpeed * 2; //垂直初速度
                this.angleSpeed = angleSpeed; // 弧形加速度
                this.ForceLineObj.transform.scale = new Laya.Vector3(1, 1, 1); // 重置缩放
            };
            // 控制着力点
            this.Rend_Circular_point = (pos) => {
                this.Circular_obj.transform.position = new Laya.Vector3(pos.x, pos.y, 0);
            };
            // 获取信息
            this._getFocecontent = (index) => {
                let pos = new Laya.Vector3(this.FourcePointRouter[index].point.x, this.FourcePointRouter[this.FoucePointIndex].point.y);
                return pos;
            };
            // 绘制着力线
            this.forceLine = () => {
                var LeadPosition = this.Lead_cube.transform.position; // 主角
                var FoucePosition = this._FocusPoint(LeadPosition); // 着力点
                this.foucePos = FoucePosition; //当前着力坐标
                let angleData = this._quadrant(LeadPosition, FoucePosition); // 角度
                let target = this.ForceLineObj;
                let target_height = TOOLS.getline(FoucePosition, LeadPosition);
                let target_scale = target_height / CylinderMeshCube.Y;
                let angleLead = angleData.angleLead;
                this.angle = angleData.angleLead + 270;
                this.Circular_point = FoucePosition;
                this.radius = target_height;
                target.transform.position = new Laya.Vector3(FoucePosition.x, FoucePosition.y, 0);
                target.transform.scale = new Laya.Vector3(1, target_scale, 1);
                target.transform.localRotationEuler = new Laya.Vector3(0, 0, angleLead);
                this.Rend_Circular_point(FoucePosition);
                this.accelerate = true; // 开启主角加速运动
                this.whereabouts = false; // 关闭下坠
            };
            // 着力点的选取 
            this._FocusPoint = (LeadPosition) => {
                let pos = this._getFocecontent(this.FoucePointIndex); // 着力点坐标
                let size = TOOLS.getline(pos, LeadPosition); // 计算主角和着力点的距离
                if (size <= CubeSize.X * 1.5 || Math.abs(LeadPosition.x - pos.x) <= CubeSize.X * 1.5) {
                    this.FoucePointIndex++;
                    return pos; // 正常情况
                }
                else if (pos.x - LeadPosition.x >= CubeSize.X * 1.5) {
                    return this._getFocecontent(this.FoucePointIndex - 1); //取目前使用的着力点
                }
                else if (LeadPosition.x - pos.x >= CubeSize.X * 1.5) {
                    this.FoucePointIndex++;
                    return this._FocusPoint(LeadPosition); //递归
                }
            };
            //  连接主角
            this.FoceAnimation = () => {
                let LeadPosition = this.Lead_cube.transform.position; // 主角坐标
                let FoucePosition = this.foucePos; // 着力点坐标
                let angleLead = this._quadrant(LeadPosition, FoucePosition).angleLead; // 计算角度
                this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0, 0, angleLead);
            };
            // 创建着力点
            this.Circular_point_obj = () => {
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 0, 0);
                this.Circular_obj = box;
                console.log(this.FourcePointRouter);
            };
            /**
             *
             * 摄像机
             *
             */
            // 摄像机动画
            this.cameraAnimation = () => {
                let anim = () => { this.camera.transform.translate(new Laya.Vector3(-0.08, -0.04, 0)); };
                Laya.timer.loop(10, this, anim);
                window.setTimeout(() => {
                    /* 关闭动画 */
                    Laya.timer.clear(this, anim);
                }, 1000);
            };
            // // 控制摄像机偏移
            // private LookAT = (office:Laya.Vector3)=>{
            //     this.camera.transform.translate(office,false,false);
            // }
            /**
             *
             * 立方体生成与配置表解析
             *
             */
            // 方块创建入口 参数>=2 且为2的倍数
            this.RenderCube = (size) => {
                let self = this;
                if (self.Router_game[self.Cube_number].c_type === 0) {
                    return;
                }
                for (let i = size; i--;) {
                    (self.Cube_number % 2 === 0)
                        ?
                            self.AddBox(0, self.Cube_number) // 偶数在下
                        :
                            self.AddBox(1, self.Cube_number); // 奇数在上
                    //console.log(self.Cube_number);
                    self.Cube_number++;
                }
            };
            // 创建立方体方块
            this.AddBox = (type = null, index) => {
                let box = TOOLS.pullCube({ Checkpoint: 0, imgType: (this.cube_bg_type) ? 0 : 1 }); //从对象池请求立方体
                this.Game_scene.addChild(box); //添加立方体
                //console.log(this.Router_game[index]);
                let height = Number(this.Router_game[index].hp); // 获取立方体设置Y轴高度
                if (type === 0) {
                    // 下部
                    let Box_X = (index + 2) / 2 * CubeSize.X;
                    let Box_Y = (CubeSize.Z / 2) + height;
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                    this.cube_bg_type = !this.cube_bg_type;
                }
                else {
                    // 上部
                    let targetIndex = (index + 1) / 2; //计算当前数据为第几位奇数
                    let Box_X = targetIndex * CubeSize.X;
                    let Box_Y = CubeSize.Z + height + ((CubeSize.Z / 2) + Number(this.Router_game[index - 1].hp));
                    // 判断当前立方体是否有 着力点
                    if (!!this.Router_game[index].skill && Number(this.Router_game[index].skill) === 1) {
                        this.FourcePointRouter.push({
                            point: { x: Box_X, y: Box_Y - (CubeSize.Z / 2) },
                            data_index: index,
                        });
                    }
                    ;
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                }
            };
            /**
             *
             * 主角控制
             *
             */
            // 创建主角
            this.Lead = () => {
                let target_cube = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.1, 8, 8)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/two.png");
                target_cube.meshRender.material = material;
                target_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                /* 添加圆形碰撞器 */
                let spherecollider = target_cube.addComponent(Laya.SphereCollider);
                /* 设置球形碰撞器中心位置 */
                spherecollider.center = target_cube.meshFilter.sharedMesh.boundingSphere.center.clone();
                /* 设置球形碰撞器半径 */
                spherecollider.radius = target_cube.meshFilter.sharedMesh.boundingSphere.radius;
                this.Lead_cube = target_cube;
            };
            let self = this;
            /* 读取Router表 */
            Laya.loader.load("res/router/Router.json", Laya.Handler.create(this, () => {
                /* 保存数据 */
                self.Router_game = Laya.Loader.getRes('res/router/Router.json').data;
                /* 绘制3D场景 */
                self.initScene();
                /* 渲染初始立方体 */
                self.RenderCube(30);
                /* 创建主角 */
                self.Lead();
                /* 初始化着力点 */
                self.Circular_point_obj();
                /* 执行摄像机动画 */
                // self.cameraAnimation();
                /* 初始着力线 */
                self.ForceLineMain("init");
                /* 绘制第一个着力线 */
                //self.ForceLineMain("start");
                /* 事件入口 */
                self.eventSwitch();
                /* update */
                self.updata();
                /* 全局对象 */
                self.Global_obj();
            }), null, Laya.Loader.JSON);
        }
        // 坐标象限
        _quadrant(LeadPosition, FoucePosition) {
            let quadrant, angleLead = TOOLS.getRad(LeadPosition.x, LeadPosition.y, FoucePosition.x, FoucePosition.y);
            if (LeadPosition.x >= FoucePosition.x && LeadPosition.y <= FoucePosition.y) {
                quadrant = 0;
                angleLead = 90 - angleLead;
            }
            else if (LeadPosition.x >= FoucePosition.x && LeadPosition.y >= FoucePosition.y) {
                quadrant = 1;
                angleLead = 90 + angleLead;
            }
            else if (LeadPosition.x <= FoucePosition.x && LeadPosition.y >= FoucePosition.y) {
                quadrant = 2;
                angleLead = 270 - angleLead;
            }
            else if (LeadPosition.x <= FoucePosition.x && LeadPosition.y <= FoucePosition.y) {
                quadrant = 3;
                angleLead = 270 + angleLead;
            }
            ;
            // 90°角特殊情况
            if (angleLead === 0) {
                angleLead = quadrant * 90;
            }
            return { quadrant, angleLead };
        }
        // 控制主角
        Lead_angle_pos(angle) {
            let target_X = this.Circular_point.x + this.radius * Math.cos(this.angle * Math.PI / 180);
            let target_Y = this.Circular_point.y + this.radius * Math.sin(this.angle * Math.PI / 180);
            this.Lead_cube.transform.position = new Laya.Vector3(target_X, target_Y, 0);
        }
        // 主角抛物线运动 
        Lead_animate() {
            let t = Laya.timer.delta; //每帧时间
            var distanceX = (this.parabola.speedX * t) / 1000; // 水平运动路程
            this.parabola.speedY += this.parabola.gravity * t; // 加上重力加速度后的垂直速度
            if (this.parabola.h <= 0) {
                // 关闭下坠
                this.whereabouts = false;
                console.log("结束下坠");
            }
            this.camera.transform.translate(new Laya.Vector3(distanceX, -(this.parabola.speedY * t) / 1000, 0), false);
            this.Lead_cube.transform.translate(new Laya.Vector3(distanceX, -(this.parabola.speedY * t) / 1000, 0));
        }
        /**
         *
         *  updata
         *
         */
        updata() {
            let self = this;
            Laya.timer.frameLoop(1, this, () => {
                //主角加速
                if (self.accelerate) {
                    self.FoceAnimation();
                    self.Lead_angle_pos(self.angle);
                    self.angle += self.angleSpeed;
                    self.angleSpeed += 0.01;
                    self.camera.transform.translate(new Laya.Vector3(self.angleSpeed / 100 * 2, self.angleSpeed / 1000, 0), false);
                    //self.camera.transform.translate((new Laya.Vector3(0.01,0,0)),false,false);
                }
                //主角下坠
                if (self.whereabouts) {
                    self.Lead_animate();
                }
                // 主角循环运动控制
                if (self.LeadLoop) {
                    if (self.angle >= 310) {
                        self.Leaddirection = false;
                    }
                    else if (self.angle <= 230) {
                        self.Leaddirection = true;
                    }
                    ;
                    if (self.Leaddirection) {
                        // 顺时针
                        self.angle++;
                        self.FoceAnimation();
                    }
                    else {
                        // 逆时针
                        self.angle--;
                        self.FoceAnimation();
                    }
                    self.Lead_angle_pos(self.angle); // 改变主角位置
                }
            });
        }
        /**
         *
         * 接口暴露
         *
         */
        // 全局变量转换接口
        Global_obj() {
            window['Lead'] = this.Lead_cube; // 主角
            window["camera"] = this.camera; // 摄像机
            window["LookAT"] = this.LookAT; // 摄像机监听
            window["foce"] = this.ForceLineObj; //着力线
            window["focepoivet"] = this.Circular_obj; // 着力点
            window["parabola"] = this.parabola; //抛物配置
            window["directionLight"] = this.directionLight; //灯光
        }
    }
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map