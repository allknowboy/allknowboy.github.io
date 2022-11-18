---
title: CocosCreator的ScrollView优化
tags:
  - scrollview
  - cocos creator
  - 性能优化
  - null
categories:
  - 游戏编程
abbrlink: 921bf6d5
date: 2019-07-31 13:59:56
---

### 效果图

![截图](/images/CocosCreator的ScrollView优化/xx.gif)

### 新建一个预制件

![prefab](/images/CocosCreator的ScrollView优化/image1.jpg)

### 预制件代码

> Item.ts

```ts
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Label) label: cc.Label = null;

    index: number = 0

    getIndex(): number {
        return this.index
    }

    init(index: number) {
        this.label.string = `${index}`
        this.index = index
    }

    itemShow() {
        this.node.opacity = 255
    }

    itemHide() {
        this.node.opacity = 0
    }
}
```

### 主文件代码

> Main.ts

```ts
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.ScrollView) scrollView: cc.ScrollView = null
    @property(cc.Prefab) itemPrefab: cc.Prefab = null
    @property(cc.Button) startBtn: cc.Button = null
    @property(cc.EditBox) editBox: cc.EditBox = null

    needItem: number = 0
    index: number = 0
    viewRect: cc.Rect = null
    needCulling = false
    // onLoad () {}

    start() {
        this.startBtn.node.on('click', () => {
            this.needItem +=  parseInt(this.editBox.string)
        })
        let pos = this.scrollView.node.parent.convertToNodeSpace(
            this.scrollView.node.position
        )
        // 构造碰撞盒子 需要有预留
        this.viewRect = cc.rect(pos.x - 125, pos.y - 125, this.scrollView.node.width + 250, this.scrollView.node.height + 300 )
        this.scrollView.node.on('scroll-began', () => {
            this.needCulling = true
            console.log('scroll-began')
        })
        this.scrollView.node.on('scroll-ended', () => {
            this.culling()
            this.needCulling = false
            console.log('scroll-ended')
        })
        this.scrollView.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.culling()
            // this.needCulling = false
            console.log('TOUCH_CANCEL')
        })
    }

    frameCreator(dt: number) {
        if (this.needItem < 1) {
            return
        } else if(this.needItem === 1) {
            this.culling()
        }
        this.needItem--
        this.index++
        let itemNode = cc.instantiate(this.itemPrefab)
        itemNode.getComponent(Item).init(this.index)
        itemNode.color = cc.color(~~(Math.random() * 255), ~~(Math.random() * 255), ~~(Math.random() * 255))
        this.scrollView.content.addChild(itemNode)
    }

    culling() {
        this.scrollView.content.children.forEach((node) => {
            if(this.viewRect.containsRect(node.getBoundingBoxToWorld())){
                node.getComponent(Item).itemShow()
            } else {
                node.getComponent(Item).itemHide()
            }
        })
    }

    update(dt) {
        this.frameCreator(dt)
        if (this.needCulling) {
            console.log('is culling')
            this.culling()
        }
    }
}
```

### 简单分析

- 将预制件实例化的操作分到每一帧, 每一帧生成实体
- 在每一帧16ms的时间内，生成一个或者多个实体
- 当item的位置超出view的位置时就设置透明度为0(减少drawCall)
