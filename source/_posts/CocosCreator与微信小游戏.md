---
title: CocosCreator与微信小游戏
tags:
  - 微信小游戏
  - cocos creator
categories:
  - 游戏编程
abbrlink: d4f6582c
date: 2019-07-21 13:59:56
---

# CocosCreator与微信小游戏

## 基础系统

### 判断环境的宏定义

```ts
cc.sys.platform == cc.sys.WECHAT_GAME
```

### 获取当前设置,用于获取是否授权等

```ts
    /**
     * 获取当前的设置
     *
     * @memberof WxManager
     */
    getSetting(cb) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return
        }
        wx.getSetting({
            success(res) {
                cb(null, res)
            },
            fail(res) {
                cb('getSetting fail', res)
            }

        })
    }
```

### 获取用户授权

- 传入一个透明按钮对象(设置全屏即可)
- 用户第一次点击屏幕的时候先走授权，之后会自动调用
- 如果授权成功就回调成功，需要移除透明按钮

```ts
/**
    * 获取当前用户信息
    *
    * @memberof WxManager
    */
getUserInfo(btnNode, cb) {
    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
        return
    }
    wx.getSetting({
        success(res) {
            if(!res.authSetting['scope.userInfo']) {

                let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
                let frameSize = cc.view.getFrameSize();
                let winSize = cc.director.getWinSize();
                // console.log("winSize: ",winSize);
                // console.log("frameSize: ",frameSize);
                //适配不同机型来创建微信授权按钮
                let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
                let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
                let width = btnSize.width/winSize.width*frameSize.width;
                let height = btnSize.height/winSize.height*frameSize.height;

                const button = wx.createUserInfoButton({
                    type: 'text',
                    text: '',
                    style: {
                        left: left,
                        top: top,
                        width: width,
                        height: height,
                        lineHeight: 0,
                        backgroundColor: '',
                        color: '#ffffff',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    }
                })
                button.onTap((res) => {
                    // 此处可以获取到用户信息
                    if (cb) {
                        if(res.userInfo) {
                            cb(null, res)
                            button.hide()
                        } else {
                            cb('没有允许获取用户权限')
                        }
                    }
                })
            } else {
                wx.getUserInfo({
                    success(res) {
                        if (cb) {
                            cb(null, res)
                        }
                    }
                })
            }
        }
    })
}
```

- 使用方法

```ts
xx.getUserInfo(this.userButton,(err, res) => {
    if (err) return
    GameDataManager.getInstance().wxUserInfo = res.userInfo
    this.userButton.active = false
    console.log('授权成功')
})
```


## 分享

### 设置被动分享（点击三点图标显示的分享）

- 分享是否带ticket
- 被动分享的传参是个函数

```ts
    wx.showShareMenu({
        withShareTicket: false
    })
    wx.onShareAppMessage(function () {
        // 用户点击了“转发”按钮
        return {
            title: '分享的title',
            imageUrlId: 'imageUrlId',
            imageUrl: 'imageUrl',
        }
    })
```

### 设置主动分享

- 主动分享的传参是个对象

```ts
    wx.shareAppMessage(
        {
            title: 'title',
            imageUrlId: 'imageUrlId',
            imageUrl: 'imageUrl'
        }
    )
```

### 使用截图分享

- **getSystemInfoSync**用来获取当前真是的像素数据
- 当前是预定义开始的截取高度，安装宽比高 5：4的比例截取

```ts
    const info = wx.getSystemInfoSync()
    let screenWidth = info.pixelRatio * info.windowWidth
    let screenHeight = info.pixelRatio * info.windowHeight
    wx.shareAppMessage(
    {
        title: 'title',
        imageUrl: window['canvas'].toTempFilePathSync({
            x: 0,
            y: screenHeight * .6,
            width: screenWidth,
            height: screenWidth * .8,
            destWidth: 500,
            destHeight: 400
        })
    }
    )
```

### 使用固定图片加Canvas画图的分享

- 使用图片的规格为 375 X 300
- 放置在ccc的模板目录内
- 画图使用的值为rpx

```ts
    let canvas1 = wx.createCanvas()
    let ctx = canvas1.getContext('2d') // 创建一个 2d context
    let image = wx.createImage()
    image.onload = () => {
        ctx.drawImage(image, 0, 0)
        ctx.fillStyle = '#333333'
        ctx.font = "18px bold 微软雅黑";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText('哈哈', 190, 37)
        wx.shareAppMessage(
            {
                title: str,
                imageUrl: canvas1.toTempFilePathSync({
                    x: 0,
                    y: 0,
                    width: 375,
                    height: 300,
                    destWidth: 500,
                    destHeight: 400
                })
            }
        )
    }
    image.src = 'img/share1.png'
```

## 排行榜

### 发送数据到子域(主域)

- 发送对象到子域
- 用于传递相关数据

```ts
    let openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({hello: 'hello'})
```

### 子域接收主域发送数据

- obj是获取的对象
- 可以定义固定的格式内容，用于判断传递的数据类型和内容

```ts
window["wx"].onMessage((obj: any) => {

})
```

### 子域中获取用户信息(子域)

- 子域中获取信息，传入openId
- 传入selfOpenId为获取自己的信息
- data数组对应openIdList

```ts
    window["wx"].getUserInfo({
        openIdList: ['selfOpenId'],
        success: (res) => {
            // console.log('res<<<<<<==>>>>>>>', res)
            this.selfNickName = res.data[0].nickName
            this.selfAvatarUrl = res.data[0].avatarUrl
        }
    })
```

### 获取当前用户的数据

- 保存的数据都为字符串模式, 使用数据的时候需要转换
- 第一次获取数据的时候可能为空

```ts
    // 获取当前用户的数据
    window["wx"].getUserCloudStorage({
        keyList: ["score", "timestamp"],
        success: res => {
            // console.log('res=--==--=>', res)
            let arr: Array<{ key: string,value: string }> = res.KVDataList
            if (typeof(arr[0]) !== 'undefined') {

            }
            if (typeof(arr[1]) !== 'undefined') {

            }
        }
    })
```

### 请求所有好友的的数据

- 获取当前所有好友的信息
- UserGameData为获取的数据结构
- 获取数据有可能为空(没有好友玩，包括自己都没上传成绩)
- 使用函数方法进行数据过滤和排序

```ts
    interface UserGameData {
    avatarUrl: string
    nickname: string
    openid: string
    KVDataList: Array<{
        key: string,
        value: string
    }>
    }

    // 请求当前所有的用户数据
    window["wx"].getFriendCloudStorage({
        keyList: ["score", "timestamp"],
        success: res => {
            let ranking = 0
            let hasSelf: boolean = false
            let data: Array<UserGameData> = res.data
            data.map(Function).sort(Function).forEach(Function)
        }
    })
```

## 用户登录

### 代理

- 将小程序的appid和key存储在服务器
- 安装superagent用于代理访问

> api.ts

```ts
import superagent from 'superagent'

export class Api {
    /**
     * 通过登录的code 获取用户的session
     *
     * @export
     * @param {string} appid
     * @param {string} secret
     * @param {string} js_code
     * @param {string} [grant_type='authorization_code']
     * @returns
     */
    static code2Session(appid: string, secret: string, js_code: string, grant_type = 'authorization_code') {
        return new Promise<string>((resolve, reject) => {
            let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=${grant_type}`
            superagent.get(url).end((err, res) => {
               // console.log(err)
               // console.log(res)
                if (err) {
                    resolve('{}')
                } else {
                    // console.log('res: ', res)
                    // console.log('res.text: ', res.text)
                    resolve(res.text)
                }
            })
        })
    }
}
```

### 获取code

```js
wx.login({
  success (res) {
    if (res.code) {
      // 此处将获得的code发送给自己的服务器获取openId,实现登录
    } else {
      console.log('登录失败！' + res.errMsg)
    }
  }
})
```
