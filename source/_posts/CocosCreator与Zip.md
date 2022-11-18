---
title: CocosCreator与zip
tags:
  - 微信小游戏
  - cocos creator
  - zip
  - jszip
categories:
  - 游戏编程
abbrlink: 71deeea
date: 2019-07-30 19:59:56
---

```blockquote 《围城》, 钱钟书
   **忠厚老实人的恶毒，像饭里的砂砾或者出骨鱼片里未净的刺，会给人一种不期待的伤痛。。**
```

## 写在前头

你在什么时候需要压缩包？

- 文件太多，只想下载一次
- 分版本更新内容
- 数据加密

## 找个类库咯

**能找到类库实现的,就不要自己浪费时间了**

[JSZip](https://github.com/Stuk/jszip)

下载dist里面的**jszip.min.js**扔到CocosCreator里面就好了

## 准备一个压缩包

随便找点json文件或者其他**文本文件**, 当前的压缩包内只能放一些文本文件，一些图片和其他文件在引擎中可能没有解析的方法，也许是我还没找到

**压缩包的后缀名改成.bin**, 以二进制的方式读取文件，不改的话就直接文本模式读取了

## 代码实现

> Main.ts

```ts
const {ccclass, property} = cc._decorator;

import JSZip = require('./lib/jszip.min.js')

@ccclass
export default class Main extends cc.Component {

    @property(cc.Label) resultLabel: cc.Label = null

    start () {

        cc.loader.loadRes('config', async (err, res) => {
            if (err) {
                console.log(err)
                this.p('加载失败！')
            } else {
                this.p('加载成功！')
                console.log(res)
                console.log(res._nativeAsset)

                let jsZip = new JSZip()
                // console.log(jsZip)
                let zip = await jsZip.loadAsync(res._nativeAsset)
                if (zip) {
                    let file1 = await zip.file('data1.json').async('string')
                    let file2 = await zip.file('data2.json').async('string')
                    let file3 = await zip.file('data3.json').async('string')
                    let file4 = await zip.file('data4.json').async('string')
                    let file5 = await zip.file('test.b64.txt').async('string')
                    let file6 = await zip.file('dou.png').async('uint8array')
                    console.log(file6.byteLength)

                    this.p(file1)
                    this.p(file2)
                    this.p(file3)
                    this.p(file4)

                    let image = new Image()
                    image.src = file5
                    image.onload = () => {
                        let tex = new cc.Texture2D()
                        tex.initWithElement(image)
                        let spf = new cc.SpriteFrame(tex)
                        let node = new cc.Node()
                        let sp = node.addComponent(cc.Sprite)
                        sp.spriteFrame = spf
                        this.node.addChild(node, -2)
                    }
                }
            }
        })
    }

    p(str: string) {
        this.resultLabel.string += `\n${str}`
    }
}
```

## 真机测试

![真机测试](/images/CocosCreator与zip/image1.jpg)

## PS

- 实现了zip内的数据获取
- 存储图片的base64编码后的字符串，可以转变为图片
- 存储图片本人可以获得ArrayBuffer数据，转存可以保存为图片
- 尚未找到CocosCreator中ArrayBuffer转为cc.Texture2d的方案，如过攻破这个的话，图片加密，数据加密，包体压缩什么的都可以了
