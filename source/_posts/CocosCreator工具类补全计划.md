---
title: CocosCreator工具类补全计划
tags:
  - utils
  - cocos creator
categories:
  - 游戏编程
abbrlink: fb21768a
date: 2019-4-9 16:33:43
---

## Http工具类

- get 方式访问数据接口
- post 方式范围数据接口

```ts
/**
 * 回调函数定义
 *
 * @interface ResponseTextCallback
 */
interface ResponseObjCallback {
    (err: string, data?: any): void;
}

/**
 * Http的基础操作类
 *
 * @export
 * @class Http
 */
export class Http {

    /**
     * 基础的url
     *
     * @static
     * @type {string}
     * @memberof Http
     */
    static BASE_URL: string = 'http://127.0.0.1:3000';


    /**
     * http get获取方法
     *
     * @static
     * @memberof Http
     */
    static get = (route: string, param: object = {}, callback?: ResponseObjCallback) => {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        let url: string = '';
        let paramStr = '';
        for(let key in param) {
            if (paramStr === ''){
                paramStr = '?';
            }
            if (paramStr !== '?') {
                paramStr += '&';
            }
            paramStr += key + '=' + param[key];
        }
        url = `${Http.BASE_URL}${route}${encodeURI(paramStr)}`
        console.log('http get url:', url);
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                callback(null, JSON.parse(xhr.responseText))
            } else {
                callback('error')
            }
        };
        xhr.send();
    };

    /**
     * http post 方法
     *
     * @static
     * @memberof Http
     */
    static post = (route: string, param: object = {}, callback?: ResponseObjCallback) => {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        let url: string = '';
        let paramStr = '';
        for(let key in param) {
            if (paramStr !== '') {
                paramStr += '&';
            }
            paramStr += key + '=' + param[key];
        }
        url = `${Http.BASE_URL}${route}`
        console.log('http post url:', url);
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        if (cc.sys.isNative){
            // xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                callback(null, JSON.parse(xhr.responseText))
            } else {
                callback('error')
            }
        };
        xhr.send(encodeURI(paramStr));
    }
}
```

## UserData本地数据类

- localStorage的简单封装
- 优化ts的智能提示

```ts
/**
 * @author limo
 */

/**
 * 用户本地数据操作类
 *
 * @export
 * @class UserData
 */
export class UserData {
    /**
     * 获取数据
     * @param key 键
     */
    static get(key: string): string {
        return cc.sys.localStorage.getItem(key);
    }

    /**
     * 保存数据
     * @param key 键
     * @param value 值
     */
    static put(key:string, value:string) {
        cc.sys.localStorage.setItem(key, value);
    }

    /**
     * 删除数据
     * @param key 键
     */
    static remove(key: string) {
        cc.sys.localStorage.removeItem(key) ;
    }
}
```

## I18N国际化工具类

- 这里引用了一个js库 需要作为插件加入ccc

[polyglot.min.js](/images/mycccutils/polyglot.min.js)

```ts
/**
 * @author limo
 */

/**
 * 国际化工具类
 *
 * @export
 * @class I18n
 */
declare let Polyglot : any;
const polyglot = new Polyglot();
export class I18n {

    /**
     * 初始化的方法
     *
     * @static
     * @param {object} [obj={}]
     * @memberof I18n
     */
    static init(obj: object = {}) {
        polyglot.extend(obj);
    }

    /**
     * 获取配置字符串的方法
     *
     * @static
     * @param {object} [obj={}]
     * @memberof I18n
     */
    static t(key: string, param?: object): string {
        if (param) {
            return polyglot.t(key, param)
        } else {
            return polyglot .t(key)
        }
    }
}
```

## BASE64工具类

```ts
// 数据表
const _keyStr: string ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * utf8的编码
 *
 * @param {string} str
 * @returns
 */
function _utf8_encode(str: string) {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < str.length; n++) {

        let c = str.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

/**
 * utf8的解码
 *
 * @param {string} str
 * @returns
 */
function _utf8_decode(utftext: string) {
    let str = "";
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            str += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return str;
}



/**
 * 
 * Base64的工具类
 * @export
 * @class Base64
 */
export class Base64 {
    /**
     * 
     * base64的编码
     * @static
     * @param {string} input
     * @returns
     * @memberof Base64
     */
    static encode(input: string){
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }



    /**
     * 
     * base64的解码
     * @static
     * @param {string} input 
     * @returns 
     * @memberof Base64
     */
    static decode(input: string) {
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
}
```

## 简单的凯撒加密(基于base64)

```ts
const _encrypt_password:string = "dsa02sfdbffwr";
export class CaesarCipher{
    static encode(str:string):string{
        let temp = Base64.encode(str);
        let codeStr = '';
        for(let i=0;i<temp.length;i++){
            codeStr += String.fromCharCode(temp.charCodeAt(i)-_encrypt_password.charCodeAt(i%_encrypt_password.length));  
        }
        return codeStr;
    }

    static decode(str:string):string{
        let decodeStr = '';
        for(let i=0;i<str.length;i++){
            decodeStr += String.fromCharCode(str.charCodeAt(i)+_encrypt_password.charCodeAt(i%_encrypt_password.length));  
        }
        decodeStr = Base64.decode(decodeStr);
        return decodeStr;
    }
}
```

## EventEmitter事件触发器

- 实现了事件on/emit的绑定和触发

```ts
/**
 * 事件触发器
 *
 * @export
 * @class EventEmitter
 */
export class EventEmitter {
    // 事件的集合
    private _events: any = {};
    // 当前事件的编号
    private _count = 0;
    /**
     * 绑定当前的事件
     *
     * @private
     * @param {string} eventName
     * @param {*} callback
     * @param {number} is_one
     * @param {*} content
     * @returns
     * @memberof EventManager
     */
    private _bind(eventName: string, callback: any, is_one:number, context: any) {
        if (typeof(eventName) !== 'string' || typeof(callback) !== 'function') {
            throw new Error('_bind args is not safe!')
        }
        if (!Object.prototype.hasOwnProperty.call(this._events,eventName)) {
            this._events[eventName] = {};
        }
        this._events[eventName][++this._count] = [callback, is_one, context];
        return [eventName, this._count];
    }

    /**
     * 遍历事件的事件的绑定
     *
     * @private
     * @param {[]} obj
     * @param {*} callback
     * @memberof EventEmitter
     */
    private _each(obj: [], callback: any) {
        for (let key in obj) {
            if(obj.hasOwnProperty(key)) {
                callback(key, obj[key]);
            }
        }
    }

    /**
     * 触发事件的方法
     *
     * @private
     * @param {string} eventName
     * @param {*} args
     * @memberof EventEmitter
     */
    private _emitFunc(eventName: string, args: any) {
        if (Object.prototype.hasOwnProperty.call(this._events,eventName)){
            this._each(this._events[eventName], (key: number, item: any) => {
                item[0].apply(item[2], args);
                if (item[1]) delete this._events[eventName][key];
            });
        }
    }

    /**
     * 绑定事件
     *
     * @param {string} eventName
     * @param {*} callback
     * @param {*} context
     * @returns
     * @memberof EventEmitter
     */
    on(eventName: string, callback: any, context?: any) {
        context = context || this;
        return this._bind(eventName, callback, 0, context);
    }

    /**
     * 绑定触发一次的事件
     *
     * @param {string} eventName
     * @param {*} callback
     * @param {*} context
     * @returns
     * @memberof EventEmitter
     */
    once(eventName: string, callback: any, context?: any) {
        context = context || this;
        return this._bind(eventName, callback, 1, context);
    }

    /**
     * 取消事件绑定
     *
     * @param {(string | [string, number])} event
     * @returns
     * @memberof EventEmitter
     */
    off(event: string | [string, number]) {
        if (typeof(event) === 'string') {
            if(Object.prototype.hasOwnProperty.call(this._events,event)) {
               delete this._events[event];
               return true;
            }
            return false;
        } else if (typeof(event) === 'object') {
            let eventName = event[0];
            let key = event[1];
            if (Object.prototype.hasOwnProperty.call(this._events, eventName) && Object.prototype.hasOwnProperty.call(this._events[eventName], key)) {
                delete this._events[eventName][key];
                return true;
            }
            return false;
        }
    }

    /**
     * 触发绑定的事件
     *
     * @param {string} eventName
     * @param {...Array<any>} array
     * @memberof EventEmitter
     */
    emit(eventName: string, ...array: Array<any>) {
        setTimeout(() => {
            this._emitFunc(eventName, array);
        });
    }

    /**
     * 清除所有的绑定
     */
    clearAll() {
        this._events = {};
    }
}
```

## WebScoket的工具类

- 依赖于之前的EventEmitter工具类
- 实现WebSockt的绑定

```ts
import { EventEmitter } from "./EventEmitter";

/**
 * WebSocket的工具类
 *
 * @export
 * @class WS
 * @extends {EventEmitter}
 */
export class WS extends EventEmitter {
    // 单例
    public static readonly INS: WS = new WS();
    // socket实例
    private _sock: WebSocket = null;
    // 是否连接成功
    private _isConnected: boolean = false;

    /**
     * 连接状态类型
     *
     * @static
     * @memberof WS
     */
    public static EventType = {
        OPEN: 'open',
        ERROR: 'error',
        CLOSE: 'close',
        MESSAGE: 'message',
    }

    private constructor() {
        super();
    }

    /**
     * 连接的方法
     *
     * @param {string} url
     * @memberof WS
     */
    connect(url: string): WS{
        if (!this._sock || this._sock.readyState !== 1){
            this._sock = new WebSocket(url);
            this._sock.binaryType = 'arraybuffer';
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onerror = this._onError.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
        }
        return this;
    }

    /**
     * 开始连接的方法
     *
     * @private
     * @memberof WS
     */
    private _onOpen(event: MessageEvent) {
        this._isConnected = true;
        this.emit(WS.EventType.OPEN, event);   
    }

    /**
     * 错误的方法
     *
     * @private
     * @memberof WS
     */
    private _onError(event: MessageEvent) {
        this._isConnected = false;
        this.emit(WS.EventType.ERROR, event);
    }

    /**
     * 关闭的方法
     *
     * @private
     * @memberof WS
     */
    private _onClose(event: MessageEvent) {
        this._isConnected = false;
        this.emit(WS.EventType.CLOSE, event);  
    }

    /**
     * 信息的方法
     *
     * @private
     * @param {MessageEvent} event
     * @memberof WS
     */
    private _onMessage(event: MessageEvent) {
        this.emit(WS.EventType.MESSAGE, event);    
    }

    /**
     * 发送数据
     *
     * @param {(string | object)} message
     * @memberof WS
     */
    send(message: string | object) {
        if(!this._isConnected) {
            return;
        }
        if(typeof message == 'string') {
            this._sock.send(message);
        } else if(typeof message === 'object') {
            let jsonStr = JSON.stringify(message);
            this._sock.send(jsonStr);
        }
    }


    /**
     * 发送二进制数据
     * @param message
     */
    sendBinary(message: any){
        if(!this._isConnected) {
            return;
        }
        if(typeof message != 'string') {
            this._sock.send(message);
        } 
    }

    /**
     * 关闭连接
     *
     * @memberof WS
     */
    close(){
        this._sock.close();
        this._sock = null;
        this._isConnected = false;
    }

}
```

- 简单的连接测试

```ts
WS.INS.connect('ws://echo.websocket.org');
WS.INS.on(WS.EventType.OPEN, () => {
    console.log('open');
    WS.INS.send('hello');
});

WS.INS.on(WS.EventType.MESSAGE, (event: MessageEvent) => {
    console.log('message', event.data);
});
```

## UUID的工具类

```ts
export class UUID {
    /**
     * 4随机的子轮
     * @private
     * @returns
     * @memberof UUID
     */
    private static _s4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    /**
     * 返回第四版本的uuid
     * @static
     * @returns
     * @memberof UUID
     */
    static v4() {
        return (UUID._s4()+UUID._s4()+"-"+UUID._s4()+"-"+UUID._s4()+"-"+UUID._s4()+"-"+UUID._s4()+UUID._s4()+UUID._s4());
    }

}
```

## Colyseus的连接工具类

- 功能和websocket实现类型 
- 实现单例的收发
- 消息的订阅和发布

```ts
import { EventEmitter } from "./EventEmitter";

/**
 * colyseus的工具类
 *
 * @export
 * @class ColyseusEngine
 * @extends {EventEmitter}
 */
export class ColyseusEngine extends EventEmitter {
    // 单例
    public static readonly INS: ColyseusEngine = new ColyseusEngine();
    
    // 当前的客户端连接
    private _client: Colyseus.Client = null;

    // 当前的房间连接
    private _room: Colyseus.Room = null;

    // 是否连接成功
    private _isConnected: boolean = false;
    
    // 是否在房间内
    private _isInRoom: boolean = false;

    /**
     * 当前的内容事件
     *
     * @static
     * @memberof ColyseusEngine
     */
    public static EventType = {
        CLIENT_OPEN: 'client_open',
        CLIENT_ERROR: 'client_error',
        CLIENT_CLOSE: 'client_close',
        ROOM_JOIN: 'room_join',
        ROOM_ERROR: 'room_error',
        ROOM_LEAVE: 'room_leave',
        ROOM_MESSAGE: 'room_message',
        ROOM_STATE: 'room_state',
    }


    // 无法实例化
    private constructor(){
        super();
    };


    /**
     * 监听客户端连接成功
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onClientOpen() {
        this._isConnected = true;
        this.emit(ColyseusEngine.EventType.CLIENT_OPEN);
        console.log('_onClientOpen');
    }

    /**
     * 监听客户端关闭
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onClientClose( closeEvent :CloseEvent) {
        this._isConnected = false;
        this._isInRoom = false;
        this.emit(ColyseusEngine.EventType.CLIENT_CLOSE, closeEvent);
        console.log('_onClientClose', closeEvent );
    }

    /**
     * 监听客户端错误
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onClientError(evt: Event) {
        this._isConnected = false;
        this._isInRoom = false;
        this.emit(ColyseusEngine.EventType.CLIENT_ERROR, evt);
        console.log('_onClientError', evt);
    }


        /**
     * 加入房间成功
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onRoomJoin() {
        this._isInRoom = true;
        console.log('_onRoomJoin');
        this.emit(ColyseusEngine.EventType.ROOM_JOIN);
    }

    /**
     * 加入房间错误
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onRoomError(evt :Event){
        this._isInRoom = false;
        console.log('_onRoomError', event);
        this.emit(ColyseusEngine.EventType.ROOM_ERROR, evt);
    }

    /**
     * 离开房间
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onRoomLeave(closeEvent :CloseEvent){
        this._isInRoom = false;
        console.log('_onRoomLeave', closeEvent);
        this.emit(ColyseusEngine.EventType.ROOM_LEAVE, closeEvent);
    }

    /**
     * 接收房间的消息
     *
     * @private
     * @memberof ColyseusEngine
     */
    private _onRoomMessage(data: any){
        console.log('_onRoomMessage', data);
        this.emit(ColyseusEngine.EventType.ROOM_MESSAGE, data);
    }

    /**
     * 接收房间的状态同步
     *
     * @private
     * @param {*} state
     * @memberof ColyseusEngine
     */
    private _onRoomStateChange(state: any) {
        console.log('_onRoomStateChange', state);
        this.emit(ColyseusEngine.EventType.ROOM_STATE, state);
    }


    /**
     * 连接到服务器
     *
     * @param {string} url
     * @returns {ColyseusEngine}
     * @memberof ColyseusEngine
     */
    public connect(url: string): ColyseusEngine {
        if(!this._client){
            this._client = new Colyseus.Client(url);
            this._client.onOpen.add(this._onClientOpen.bind(this));
            this._client.onError.add(this._onClientError.bind(this));
            this._client.onClose.add(this._onClientClose.bind(this));
        }
        return this;
    }
    
    /**
     * 获取当前你的房间
     *
     * @returns {Colyseus.Room}
     * @memberof ColyseusEngine
     */
    public getCurrentRoom(): Colyseus.Room {
        if(this._isInRoom){
            return this._room;
        }
        return null;
    }

    /**
     * 加入房间的方法
     *
     * @param {string} roomId
     * @param {{}} options
     * @memberof ColyseusEngine
     */
    public joinRoom(roomId: string, options: {}){
        if(this._client && this._isConnected && !this._isInRoom) {
            this._room = this._client.join(roomId, options);
            this._room.onJoin.add(this._onRoomJoin.bind(this));
            this._room.onError.add(this._onRoomError.bind(this));
            this._room.onLeave.add(this._onRoomLeave.bind(this));
            this._room.onMessage.add(this._onRoomMessage.bind(this));
            this._room.onStateChange.add(this._onRoomStateChange.bind(this));
        }
        
    }

    /**
     * 获取当前可用的房间
     *
     * @memberof ColyseusEngine
     */
    public getAvailableRooms(roomName: string) {
        return new Promise<Colyseus.RoomAvailable[]>((resolve, reject) => {
            if(this._client && this._isConnected){
                this._client.getAvailableRooms(roomName, (rooms: Colyseus.RoomAvailable[], err: string) => {
                    if(err) {
                        resolve([]);
                    }
                    resolve(rooms);
                })
            } else {
                resolve([]);
            }
        })
    }


    /**
     * 发送数据
     *
     * @param {*} data
     * @memberof ColyseusEngine
     */
    public send(data: any){
        if(this._room && this._isInRoom){
            this._room.send(data);
        }
    }

    /**
     * 离开当前的房间
     *
     * @memberof ColyseusEngine
     */
    public leaveRoom(){
        if(this._room && this._isInRoom){
            this._room.leave();
        }
    }

    /**
     * 关闭客户端连接的方法
     *
     * @memberof ColyseusEngine
     */
    public close(){
        if(this._client && this._isConnected){
            this._client.close('');
        }
    }

}
```

- 简单的连接测试

```ts
CE.INS.connect('ws://192.168.8.82:1234');
CE.INS.on(CE.EventType.CLIENT_OPEN, () => {
    CE.INS.joinRoom('chess', {});
    CE.INS.on(CE.EventType.ROOM_JOIN, () => {
        CE.INS.send({
            hello: 'Hello,Server!'
        })
    });
});
```

## Timestamp工具类

- 时间戳工具类

```ts
/**
 * @author limo
 * 时间戳相关操作的工具类
 *
 * @export
 * @class Timestamp
 */
export class Timestamp {

    /**
     * 获取当前的时间戳
     *
     * @static
     * @returns {number}
     * @memberof Timestamp
     */
    static now(): number {
        let date = new Date()
        return ~~(date.getTime() / 1000)
    }

    /**
     * 获得当天0点开始的时间戳
     *
     * @static
     * @returns {number}
     * @memberof Timestamp
     */
    static today(): number {
        let date = new Date()
        return ~~(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000)
    }

    /**
     * 格式化输出时间
     *
     * @static
     * @param {number} timestamp
     * @returns {string}
     * @memberof Timestamp
     */
    static formatHour(timestamp: number): string {
        let h = ~~(timestamp / 3600) 
        let m = ~~(timestamp % 3600 / 60) 
        let s = ~~(timestamp % 60)
        return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`
    }

    /**
     * 转为当前的钟头数
     *
     * @static
     * @param {number} timestamp
     * @returns {number}
     * @memberof Timestamp
     */
    static toHours(timestamp: number): number {
        return ~~(timestamp / 3600)
    }

    /**
     * 转为天数
     *
     * @static
     * @param {number} timestamp
     * @returns {number}
     * @memberof Timestamp
     */
    static toDays(timestamp: number): number {
        return ~~(timestamp / 86400)
    }

    /**
     * 获得本周的第一天
     *
     * @static
     * @returns {number}
     * @memberof Timestamp
     */
    static weekFirstDay(): number {
        let date = new Date()
        let weekday = date.getDay() || 7
        let weekdayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday + 1)
        return ~~(weekdayDate.getTime() / 1000)
    }


    /**
     * 获取本周的最后一天
     *
     * @static
     * @returns {number}
     * @memberof Timestamp
     */
    static weekLastDay(): number {
        let date = new Date()
        let weekday = date.getDay() || 7
        let weekdayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday + 7)
        return ~~(weekdayDate.getTime() / 1000)
    }

}
```
