---
title: CocosCreator自制控件补全计划
tags:
  - utils
  - cocos creator
  - widget
categories:
  - 游戏编程
abbrlink: c4c9da0e
date: 2019-4-9 16:33:55
---

## 炫彩背景

- 这里引用了一个js库 需要作为插件加入ccc

[trianglify.min.js](/images/mycccwidget/trianglify.min.js)

- 摇杆控制代码

```ts
const {ccclass, property} = cc._decorator;

declare let Trianglify: any;

@ccclass
export default class DrawBg extends cc.Component {

    start () {
        const polyArray = Trianglify({width: 960, height: 640, cell_size: 60});
        const ctx = this.node.getComponent(cc.Graphics);

        for(let j = 0; j < polyArray.length; j++){        
            let block = polyArray[j];
            let color = cc.color().fromHEX(block[0]);
            let pointArrays=block[1];
            ctx.moveTo(pointArrays[0][0], pointArrays[0][1]);
            ctx.lineTo(pointArrays[1][0], pointArrays[1][1]);
            ctx.lineTo(pointArrays[2][0], pointArrays[2][1]);
            ctx.fillColor = color;
            ctx.fill();
        }
    }

}
```

## 摇杆 4方向 | 8方向 | 全方向

[Joystick.zip](/images/mycccwidget/Joystick.zip)

```ts
const {ccclass, property} = cc._decorator;

/**
 * 触摸类型
 */
export enum JoystickTouchType{
    DEFAULT,
    FOLLOW
};

/**
 * 方向类型
 */
export enum JoystickDirectionType{
    FOUR,
    EIGHT,
    ALL
};

/**
 * 具体方位
 */
export enum JoystickDirection{
    CENTER,
    UP,
    DOWN,
    LEFT,
    RIGHT,
    UPPER_LEFT,
    UPPER_RIGHT,
    LOWER_LEFT,
    LOWER_RIGHT
}

@ccclass
export default class JoystickCtrl extends cc.Component {


    @property(cc.Node) target: cc.Node = null;

    @property(cc.Node) joystickBar:cc.Node = null;

    @property(cc.Node) joystickBG:cc.Node = null;

    @property(0) radius:number = 0;

    @property({
        tooltip:"触摸模式",
        type:cc.Enum(JoystickTouchType)
    })  touchType:JoystickTouchType = JoystickTouchType.DEFAULT;

    @property({
        tooltip:"方向模式",
        type:cc.Enum(JoystickDirectionType)
    })  directionType:JoystickDirectionType = JoystickDirectionType.ALL;
    
    @property([cc.Component.EventHandler]) joystickHandler:Array<cc.Component.EventHandler> = [];


    joystickDir: JoystickDirection = JoystickDirection.CENTER;
    
    _angle:number = 0;
    curAngle:number = 0;
    curDistance:number = 0;
    startPos:cc.Vec2 = cc.v2(0,0);
    _isOnTouchStart: boolean = false;
    _touchId: number = 0;

    onLoad () {
        if(this.radius == 0){
            this.radius = this.joystickBG.width/2
        }
        this.curDistance = 0
        this.curAngle = 0
        this.startPos = this.node.position
        this.node.opacity = 50;
    }

    start () {

    }

    /**
     * 注册输入
     */
    registerInput(){

        let self = this;
        this.target.on(cc.Node.EventType.TOUCH_START,(eventTouch: cc.Event.EventTouch) => {
            // let flag =  self.onTouchBegan(eventTouch)
            // if (!flag){
            //     eventTouch.stopPropagation();
            // }
        });

        this.target.on(cc.Node.EventType.TOUCH_MOVE,(eventTouch: cc.Event.EventTouch) => {
            self.onTouchMoved(eventTouch)
        });

        this.target.on(cc.Node.EventType.TOUCH_END,(eventTouch: cc.Event.EventTouch) => {
            self.onTouchEnded(eventTouch)
        });

        // this._listener = cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         return self.onTouchBegan(touch, event)
        //     },
        //     onTouchMoved: function(touch, event) {
        //         self.onTouchMoved(touch, event)
        //     },
        //     onTouchEnded: function(touch, event) {
        //         self.onTouchEnded(touch, event)
        //     }
        // },self.node);
    }

    onTouchBegan(eventTouch: cc.Event.EventTouch){
        //如果触摸类型为FOLLOW，则摇控杆的位置为触摸位置,触摸开始时候现形
        if(this.touchType == JoystickTouchType.FOLLOW){
            let touchPos = this.node.parent.convertToNodeSpaceAR(eventTouch.getLocation())
            this.node.setPosition(touchPos);
            this._isOnTouchStart = true;
            this._touchId = eventTouch.getID();
        } else {                    
            //把触摸点坐标转换为相对与目标的模型坐标
            let touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
            //点与圆心的距离
            let distance =  touchPos.sub(cc.v2(0, 0)).mag();
            //如果点与圆心距离小于圆的半径,返回true
            if(distance < this.radius ) {
                if(distance>20){
                    this.node.opacity = 255
                    this.joystickBar.setPosition(touchPos);
                    //更新角度
                    this.getAngle(touchPos)
                }
                this._isOnTouchStart = true;
                this._touchId = eventTouch.getID();
            }
        }
    }
    onTouchMoved(eventTouch: cc.Event.EventTouch){
            if (!this._isOnTouchStart || this._touchId != eventTouch.getID()){
                return;
            }

            //把触摸点坐标转换为相对与目标的模型坐标
            let touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation())
            //点与圆心的距离
            let distance = touchPos.sub(cc.v2(0, 0)).mag();
    
            //如果点与圆心距离小于圆的半径,控杆跟随触摸点
            if(this.radius >= distance){
                if(distance>20){
                    this.node.opacity = 255;
                    this.joystickBar.setPosition(touchPos);
                    //更新角度
                    this.getAngle(touchPos)
                }else {
                    //this.node.opacity = 50
                    //摇杆恢复位置
                    this.joystickBar.setPosition(cc.v2(0,0));
                    this.curAngle = null;
                    //调用角度变化回调
                    cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
                    
                }
            }else{
                //触摸监听目标
                let x = Math.cos(this.getRadian(touchPos)) * this.radius;
                let y = Math.sin(this.getRadian(touchPos)) * this.radius;
                if(touchPos.x>0 && touchPos.y<0){
                    y *= -1;
                }else if(touchPos.x<0 && touchPos.y<0){
                    y *= -1;
                }
    
                this.joystickBar.setPosition(cc.v2(x, y));
                //更新角度
                this.getAngle(touchPos)
            }
    }
    onTouchEnded(eventTouch: cc.Event.EventTouch){
        if (!this._isOnTouchStart || this._touchId != eventTouch.getID()) {
            return;
        }
        this.joystickDir = JoystickDirection.CENTER;
        //如果触摸类型为FOLLOW，离开触摸后隐藏
        if(this.touchType == JoystickTouchType.FOLLOW){
            //this.node.position = this.startPos
        }
        let time = this.joystickBar.position.sub(cc.v2(0,0)).mag()/500;
        
        //摇杆恢复位置
        this.joystickBar.runAction(cc.sequence(
            cc.moveTo(Math.abs(time),cc.v2(0,0)),
            cc.callFunc(()=>{
                this.curAngle = null
                this.node.opacity = 50
                //调用角度变化回调
                cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
            })
        ));
        this._isOnTouchStart = false;
    }

    onTouchCancel(eventTouch: cc.Event.EventTouch){
        this.onTouchEnded(eventTouch);
    }

    //计算角度并返回
    getAngle(point:cc.Vec2){
        this._angle =  Math.floor(this.getRadian(point)*180/Math.PI);
        
        if(point.x>0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y==0){
            this._angle = 180;
        }else if(point.x>0 && point.y==0){
            this._angle = 0;
        }else if(point.x==0 && point.y>0){
            this._angle = 90;
        }else if(point.x==0 && point.y<0){
            this._angle = 270;
        }
        this.updateCurAngle()
        return this._angle;
    }
    //计算弧度并返回
    getRadian(point:cc.Vec2){
        let curZ = Math.sqrt(Math.pow(point.x,2)+Math.pow(point.y,2));
        let radian = 0;
        if(curZ==0){
            radian = 0;
        }else {
            radian = Math.acos(point.x/curZ);
        }
        return radian;
    }

    updateCurAngle(){
        switch (this.directionType){
            case JoystickDirectionType.FOUR:
                this.curAngle = this.fourDirections();
                break;
            case JoystickDirectionType.EIGHT:
                this.curAngle = this.eightDirections();
                break;
            case JoystickDirectionType.ALL:
                this.joystickDir = JoystickDirection.CENTER;
                this.curAngle = this._angle
                break;
            default :
                this.curAngle = null
                break;
        }
        //调用角度变化回调
        cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
    }
    //四个方向移动(上下左右)
    fourDirections(){
        if(this._angle >= 45 && this._angle <= 135){
            this.joystickDir = JoystickDirection.UP;
            return 90
        }
        else if(this._angle >= 225 && this._angle <= 315){
            this.joystickDir = JoystickDirection.DOWN;
            return 270
        }
        else if(this._angle <= 225 && this._angle >= 180 || this._angle >= 135 && this._angle <= 180){
            this.joystickDir = JoystickDirection.LEFT;
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 315 || this._angle >= 0 && this._angle <= 45){
            this.joystickDir = JoystickDirection.RIGHT;
            return 0
        }
    }

    eightDirections(){
        if(this._angle >= 67.5 && this._angle <= 112.5){
            this.joystickDir = JoystickDirection.UP;
            return 90
        }
        else if(this._angle >= 247.5 && this._angle <= 292.5){
            this.joystickDir = JoystickDirection.DOWN;
            return 270
        }
        else if(this._angle <= 202.5 && this._angle >= 180 || this._angle >= 157.5 && this._angle <= 180){
            this.joystickDir = JoystickDirection.LEFT;
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 337.5 || this._angle >= 0 && this._angle <= 22.5){
            this.joystickDir = JoystickDirection.RIGHT;
            return 0
        }
        else if(this._angle >= 112.5 && this._angle <= 157.5){
            this.joystickDir = JoystickDirection.UPPER_LEFT;
            return 135
        }
        else if(this._angle >= 22.5 && this._angle <= 67.5){
            this.joystickDir = JoystickDirection.UPPER_RIGHT;
            return 45
        }
        else if(this._angle >= 202.5 && this._angle <= 247.5){
            this.joystickDir = JoystickDirection.LOWER_LEFT;
            return 225
        }
        else if(this._angle >= 292.5 && this._angle <= 337.5){
            this.joystickDir = JoystickDirection.LOWER_RIGHT;
            return 315
        }
    }
    onEnable(){
        // this.registerInput();
        this.target.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable(){
        this.target.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    // update (dt) {},
}
```

## Toast工具类

```ts
/**
 * 吐司的显示任务
 */
interface ToastTask{
    text:string,
    duration:number
}

/**
 * 吐司的实体
 */
class ToastObject{
    private _text;
    private _duration;
    private _gravity;
    private _x = 0;
    private _y = 0;

    /**
     * 初始化
     * @param text 
     * @param duration 
     */
    constructor(text:string,duration:number){
        this._text = text;
        this._duration = duration;
    }

    /**
     * 显示Toast的方法
     */
    show() {
        if(Toast.showing){
            let text = this._text;
            let duration = this._duration;
            Toast.TaskArray.push({text,duration});

            //超过5条之前的直接舍弃
            if(Toast.TaskArray.length>Toast.MAX_ARRAY){
                Toast.TaskArray.shift();
            }

            return;
        }
        // 加载背景纹理
        if (Toast.bgSpriteFrame == null) {
                cc.loader.load({ 'uuid': 'b43ff3c2-02bb-4874-81f7-f2dea6970f18' },(error, result)=>{
                        if (error) {
                            cc.error(error);
                            return;
                        }
                        Toast.bgSpriteFrame = new cc.SpriteFrame(result);
                        Toast.bgSpriteFrame.insetTop = 3;
                        Toast.bgSpriteFrame.insetBottom = 3;
                        Toast.bgSpriteFrame.insetLeft = 4;
                        Toast.bgSpriteFrame.insetRight = 4;
                        //加载完再调用
                        this.show();
                    });
            return;
        }
        Toast.showing = true;
        // canvas
        var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        var width = canvas.node.width;
        var height = canvas.node.height;
        if (this._duration === undefined) {
            this._duration = Toast.LENGTH_SHORT;
        }
        // 背景图片设置
        let bgNode = new cc.Node();
        // 背景图片透明度
        bgNode.opacity = 200;
        let bgSprite = bgNode.addComponent(cc.Sprite);
        bgSprite.type = cc.Sprite.Type.SLICED;
        let bgLayout = bgNode.addComponent(cc.Layout);
        bgLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

        // Lable文本格式设置
        let textNode = new cc.Node();
        let textLabel = textNode.addComponent(cc.Label);
        textLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        textLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
        textLabel.fontSize = 20;
        textLabel.string = this._text;

        //背景图片与文本内容的间距
        let hPadding = textLabel.fontSize / 8;
        let vPadding = 2;
        bgLayout.paddingLeft = hPadding;
        bgLayout.paddingRight = hPadding;
        bgLayout.paddingTop = vPadding;
        bgLayout.paddingBottom = vPadding;

        // 当文本宽度过长时，设置为自动换行格式
        if (this._text.length * textLabel.fontSize > width / 3) {
            textNode.width = width / 3;
            textLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        }

        bgNode.addChild(textNode);
        if (Toast.bgSpriteFrame) {
            bgSprite.spriteFrame = Toast.bgSpriteFrame;
        }
        // gravity 设置Toast显示的位置
        if (this._gravity == Toast.CENTER) {
            textNode.y = 0;
            textNode.x = 0;
        } else if (this._gravity == Toast.TOP) {
            textNode.y = textNode.y + (height / 5) * 2;
        } else if (this._gravity == Toast.TOP_LEFT) {
            textNode.y = textNode.y + (height / 5) * 2;
            textNode.x = textNode.x + (width / 5);
        } else if (this._gravity == Toast.LEFT) {
            textNode.x = textNode.x + (width / 5);
        } else if (this._gravity == Toast.BOTTOM_LEFT) {
            textNode.y = textNode.y - (height / 5) * 2;
            textNode.x = textNode.x + (width / 5);
        } else if (this._gravity == Toast.BOTTOM) {
            textNode.y = textNode.y - (height / 5) * 2;
        } else if (this._gravity == Toast.BOTTOM_RIGHT) {
            textNode.y = textNode.y - (height / 5) * 2;
            textNode.x = textNode.x - (width / 5);
        } else if (this._gravity == Toast.RIGHT) {
            textNode.x = textNode.x - (width / 5);
        } else if (this._gravity == Toast.TOP_RIGHT) {
            textNode.y = textNode.y + (height / 5) * 2;
            textNode.x = textNode.x - (width / 5);
        } else {
            // 默认情况 BOTTOM
            textNode.y = textNode.y - (height / 5) * 2;
        }
        textNode.x = textNode.x + this._x;
        textNode.y = textNode.y + this._y;

        canvas.node.addChild(bgNode);

        let finished = cc.callFunc((target)=>{
            bgNode.destroy();
            Toast.showing = false;
            //showing
            if(Toast.TaskArray.length==0){

            }
            else{
                let task =  Toast.TaskArray.shift();
                Toast.showText(task.text,task.duration);
            }
        });
        let action = cc.sequence(cc.moveBy(this._duration,cc.v2(0,0)),cc.fadeOut(0.3), finished);
        bgNode.runAction(action);
    }

    /**
     * 
     * @param gravity 位置
     * @param x 偏移值x
     * @param y 偏移值y
     */
    setGravity(gravity:number, x:number, y:number) {
        this._gravity = gravity;
        this._x = x;
        this._y = y;
    }
}


export class Toast{
    /**
     * 时长
     */
    static LENGTH_LONG:number = 3.5;
    static LENGTH_SHORT:number = 1;
    /**
     * 位置
     */
    static CENTER:number = 0;
    static TOP:number = 1;
    static TOP_LEFT:number = 2;
    static LEFT:number = 3;
    static BOTTOM_LEFT:number = 4;
    static BOTTOM:number = 5;
    static BOTTOM_RIGHT:number = 6;
    static RIGHT:number = 7;
    static TOP_RIGHT:number = 8;

    static bgSpriteFrame:cc.SpriteFrame = null;

    //任务队列
    static TaskArray:Array<ToastTask> = [];

    //是否正在显示
    static showing:boolean = false;

    static MAX_ARRAY:number = 5;
    /**
     * 
     * 创建一个吐司
     * @param text 文本
     * @param duration 时长
     */
    static makeText(text:string,duration:number){
        return new ToastObject(text, duration);
    }

    /**
     * 
     * 显示一个吐司
     * @param text 文本
     * @param duration 时长
     */
    static showText(text:string,duration:number){
        Toast.makeText(text, duration).show();
    }

}
```