---
title: CocosCreator中的红点系统
tags:
  - CocosCreator中的红点系统
categories:
  - 游戏编程
abbrlink: 961a8744
date: 2019-11-11 20:32:30
---

![redpoint](/images/redpoint/111.gif)

**游戏中会有许多操作的按钮需要有提示，引导用户点击，实现游戏内的操作**

## 红点的类

- 使用枚举的选择框来确定红点
- 挂载在红点的节点
- 节点下需要挂载一个用来作为红点的icon

```ts
import { RedPointKey, RedPointCalKey, RED_POINT_MESSAGE } from "./RedPointEnum";
import { RedPointControl } from "./RedPointControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RedPoint extends cc.Component {
    // 红点条件key值
    @property({type: [cc.Enum(RedPointKey)], tooltip:"红点条件key值"})
    public keyArr:Array<RedPointKey> = []

    // 红点计算key值
    @property({type: [cc.Enum(RedPointCalKey)], tooltip:"红点计算key值"})
    public CalKeyArr: Array<RedPointCalKey> = []

    // 红点图片
    private redSprite:cc.Node = null;

    onLoad() {
        this.redSprite = this.node.getChildByName('redSprite')
        if(!this.redSprite) {
            this.redSprite = this.node
        }
        // 绑定监听
        cc.director.on(RED_POINT_MESSAGE, (calKey: RedPointCalKey) => {
            for(let v in this.CalKeyArr) {
                if (this.CalKeyArr[v] == calKey) {
                    this.updateUI()
                    return
                }
            }
        })
    }

    // 当界面的红点数据已经存在的时候，进入界面使用红点数据
    onEnable() {
        this.updateUI()
    }

    updateUI() {

        for (let v in this.keyArr) {
            let redKey = this.keyArr[v]
            let isShow = RedPointControl.getInstance().isShow(redKey)
            if (isShow) {
                this.redSprite.active = true
                return
            }
        }

        this.redSprite.active = false;
    }

}
```

## 红点的枚举类

- 有新的红点位置需要在RedPointKey中注册
- 然后定义RedPointCalKey计算相关的一系列红点
- 一个PointKey对应一个红点

```ts
/**
 * 红点的key
 *
 * @export
 * @enum {number}
 */
export enum RedPointKey {
    MIN = 0,
    k_BUTTON_1,
    k_BUTTON_2,
    k_BUTTON_3
}

/**
 * 红点的计算的key
 *
 * @export
 * @enum {number}
 */
export enum RedPointCalKey {
    MIN = 0,
    ck_TEST_BUTTON
}

// 红点的消息
export let RED_POINT_MESSAGE = 'RED_POINT_MESSAGE'
```

## 红点的控制类

- 用来计算红点的显示
- 存储红点的信息

```ts

import { RedPointKey, RedPointCalKey, RED_POINT_MESSAGE } from "./RedPointEnum";
import { GameData } from "../script/util/GameData";

export class RedPointControl {
    private static _instance: RedPointControl
    private constructor() {}
    static getInstance() : RedPointControl {
        if (!RedPointControl._instance) {
            RedPointControl._instance = new RedPointControl()
        }
        return RedPointControl._instance
    }

    private pointData: Map<RedPointKey, boolean> = new Map<RedPointKey, boolean>()

    /**
     * 当前红点是否显示
     *
     * @param {RedPointKey} key
     * @returns {boolean}
     * @memberof RedPointControl
     */
    public isShow(key: RedPointKey) : boolean {
        return this.pointData.get(key)
    }

    /**
     * 设置当前的红点数据
     *
     * @private
     * @param {RedPointKey} key
     * @param {boolean} isShow
     * @memberof RedPointControl
     */
    private setPointData(key: RedPointKey, isShow: boolean) {
        this.pointData.set(key, isShow)
    }

    /**
     * 计算红点的方法类
     *
     * @param {RedPointCalKey} calKey
     * @memberof RedPointControl
     */
    public cal(calKey: RedPointCalKey) {
        switch(calKey) {
            case RedPointCalKey.ck_TEST_BUTTON: {
                this.setPointData(RedPointKey.k_BUTTON_1, GameData.getInstance().getFlag())
                this.setPointData(RedPointKey.k_BUTTON_2, GameData.getInstance().getFlag2())
                this.setPointData(RedPointKey.k_BUTTON_3, true)
            }
        }

        cc.director.emit(RED_POINT_MESSAGE, calKey)
    }

}
```

## 数据更新

- 在游戏内数据有更新的时候,通过对应的计算的key计算红点数据
- 不同的数据使用不同的key计算

```ts
RedPointControl.getInstance().cal(RedPointCalKey.ck_TEST_BUTTON)
```
