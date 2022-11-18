---
title: RPG游戏的单位属性类
tags:
  - rpg
  - unit
  - attr
categories: 游戏编程
abbrlink: 5a0d9094
date: 2020-10-06 11:42:46
---

### 属性因子的类型

- 可以增加百分比值
- 可以增加固定值

```ts
/**
 * 属性值的因数类型
 *
 * @enum {number}
 */
enum AttrFactorType {
	AFT_Base,                     // 基础值
	AFT_Add_Constant,             // 增加固定值
	AFT_Add_Percentile,           // 增加百分比
	AFT_Max                       // 最大值
};
```

### 属性元素

- 区分属性因子
- 用于控制属性元素的类

```ts
/**
 * 属性元素
 *
 * @class UnitAttrElement
 */
class UnitAttrElement {
    private m_aiValues: Array<number> = []; // 属性数组
    private m_iResult: number = 0;  // 结果
    constructor() {
        this.clear();
    }

    /**
     * 清除
     *
     * @memberof SeUnitAttrElem
     */
    clear() {
        this.m_aiValues[AttrFactorType.AFT_Base] = 0;
        this.m_aiValues[AttrFactorType.AFT_Add_Constant] = 0;
        this.m_aiValues[AttrFactorType.AFT_Add_Percentile] = 0;
        this.m_iResult = 0;
    }

    /**
     * 元素
     *
     * @param {AttrFactorType} eType
     * @memberof SeUnitAttrElem
     */
    getFactor(eType: AttrFactorType) {
        return this.m_aiValues[eType];
    }

    /**
     * 设置元素
     *
     * @param {AttrFactorType} eType
     * @param {number} val
     * @memberof SeUnitAttrElem
     */
    setFactor(eType: AttrFactorType, val: number) {
        this.m_aiValues[eType] = val;
    }

    /**
     * 设置结果
     *
     * @memberof SeUnitAttrElem
     */
    set result(val: number) {
        this.m_iResult = val;
    }

    /**
     * 获取结果
     *
     * @memberof SeUnitAttrElem
     */
    get result() {
        return this.m_iResult;
    }
}
```

### 单位属性值的类型

- 单位拥有的属性

```ts
/**
 * 单位属性类型
 *
 * @enum {number}
 */
enum UnitAttrType {
    UAT_ATK, // 攻击力
    UAT_ATK_INTERVAL,   // 攻击间隔
    UAT_DEF, // 防御力
    UAT_HP, // 当前生命值
    UAT_HP_LIMIT, // 生命值上限
    UAT_MP, // 当前的魔法值
    UAT_MP_LIMIT, // 魔法值上限
    UAT_SPEED, // 速度
    UAT_DODGE, // 闪避
    UAT_MAX,
}
```

### 单位属性类

- 可以挂在单位类上，用于计算属性

```ts
/**
 * 单位属性类
 *
 * @class UnitAttr
 */
class UnitAttr {
    private m_akUnitAttr: Array<UnitAttrElement> = [];   // 属性数组
    static SCALE = 1; // 缩放数据用于去除小数 转化为定点数
    static PERCENTAGE_100 = 100 * UnitAttr.SCALE; // 百分百
    static MIN_ATTACK_VALUE = 1 * UnitAttr.SCALE; // 攻击力最小值为1
    static MIN_HP_LIMIT = 1 * UnitAttr.SCALE; // 最小生命值
    static MIN_MP_LIMIT = 1 * UnitAttr.SCALE;   // 最小魔法值
	static MIN_ATK_INTERVAL_PERCENTAGE = -50 * UnitAttr.SCALE;    // 最小攻击间隔
	static MIN_ATK_INTERVAL_VALUE = 150 * UnitAttr.SCALE; // 最小攻击间隔值
	static MAX_DODGE_CHANCE = 95 * UnitAttr.SCALE;    // 最大闪避百分比
	static MIN_MOVE_SPEED = 15 * UnitAttr.SCALE;   // 最小移动速度

    constructor() {
        // 初始化当前的属性数组
        for (let i = 0; i < UnitAttrType.UAT_MAX; i++) {
            this.m_akUnitAttr[i] = new UnitAttrElement();
        }
    }
    
    /**
     * 根据配置文件的内容设置当前单位属性
     *
     * @param {*} res
     * @memberof UnitAttr
     */
    init(res: any) {
        // 初始化单位的相关基础属性
    }

    /**
     * 清理属性
     *
     * @param {UnitAttrType} eType
     * @memberof UnitAttr
     */
    clear(eType: UnitAttrType) {
        this.m_akUnitAttr[eType].clear();
    }

    /**
     * 重置当前属性因子
     *
     * @param {UnitAttrType} eAttrType
     * @param {AttrFactorType} eFactorType
     * @param {number} iValue
     * @memberof UnitAttr
     */
    resetCommonAttrFactor(eAttrType: UnitAttrType, eFactorType: AttrFactorType, iValue: number) {
        this.m_akUnitAttr[eAttrType].setFactor(eFactorType, iValue);
        this.updateCascade(eAttrType);
    }

    /**
     * 修改属性因子
     *
     * @param {UnitAttrType} eAttrType
     * @param {AttrFactorType} eFactorType
     * @param {number} iValue
     * @memberof UnitAttr
     */
    incrementCommonAttrFactor(eAttrType: UnitAttrType, eFactorType: AttrFactorType, iValue: number) {
        let old = this.m_akUnitAttr[eAttrType].getFactor(eFactorType);
        this.m_akUnitAttr[eAttrType].setFactor(eFactorType, old + iValue);
        // 立即更新本属性以及它的相关属性，不等到Update
        this.updateCascade(eAttrType);
    }

    /**
     * 读取当前属性结果
     *
     * @param {UnitAttrType} eType
     * @returns
     * @memberof UnitAttr
     */
    readCommonAttrResult(eType: UnitAttrType) {
        return this.m_akUnitAttr[eType].result;
    }

    /**
     * 获取因子
     *
     * @param {UnitAttrType} eAttrType
     * @param {AttrFactorType} eFactorType
     * @returns
     * @memberof UnitAttr
     */
    readCommonAttrFactor(eAttrType: UnitAttrType, eFactorType: AttrFactorType) {
        return this.m_akUnitAttr[eAttrType].getFactor(eFactorType);
    }

    /**
     * 更新需要修改的主属性并修改相关的属性
     * 每一点防御力增加一点血量之类的
     * @param {UnitAttrType} ePrimaryAttr
     * @memberof UnitAttr
     */
    updateCascade(ePrimaryAttr: UnitAttrType) {
        // 先更新主属性
        this.updateSingle(ePrimaryAttr);
    }

    /**
     * 刷新所有属性值
     *
     * @memberof UnitAttr
     */
    updateAllAttrs() {
        for (let i = 0; i < UnitAttrType.UAT_MAX; i++) {
            this.updateCascade(i);
        }
    }

    /**
     * 只更新当前自己的主属性
     *
     * @param {UnitAttrType} eType
     * @memberof UnitAttr
     */
    private updateSingle(eType: UnitAttrType) {
        // 获取属性元素
        let attrElem = this.m_akUnitAttr[eType];
        switch(eType) {
            case UnitAttrType.UAT_ATK: {
                attrElem.result = this.updateATK(attrElem);
                break;
            }
            case UnitAttrType.UAT_ATK_INTERVAL: {
                attrElem.result = this.updateATK_INTERVAL(attrElem);
                break;
            }
            case UnitAttrType.UAT_DEF: {
                attrElem.result = this.updateDEF(attrElem);
                break;
            }
            case UnitAttrType.UAT_HP: {
                attrElem.result = this.updateHP(attrElem);
                break;
            }
            case UnitAttrType.UAT_HP_LIMIT: {
                attrElem.result = this.updateHP_LIMIT(attrElem);
                break;
            }
            case UnitAttrType.UAT_MP: {
                attrElem.result = this.updateMP(attrElem);
                break;
            }
            case UnitAttrType.UAT_MP_LIMIT: {
                attrElem.result = this.updateMP_LIMIT(attrElem);
                break;
            }
            case UnitAttrType.UAT_SPEED: {
                attrElem.result = this.updateSPEED(attrElem);
                break;
            }
            case UnitAttrType.UAT_DODGE: {
                attrElem.result = this.updateDODGE(attrElem);
                break;
            }
        }
    }

    /**
     * 更新攻击力
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateATK(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < UnitAttr.MIN_ATTACK_VALUE) {
            iResult = UnitAttr.MIN_ATTACK_VALUE;
        }
        return iResult;
    }

    /**
     * 更新攻击间隔
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateATK_INTERVAL(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        if (iAddPer < UnitAttr.MIN_ATK_INTERVAL_PERCENTAGE) {
            iAddPer = UnitAttr.MIN_ATK_INTERVAL_PERCENTAGE;
        }
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < UnitAttr.MIN_ATK_INTERVAL_VALUE) {
            iResult = UnitAttr.MIN_ATK_INTERVAL_VALUE;
        }
        return iResult;
    }

    /**
     * 更新防御力
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateDEF(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        return iResult;
    }

    /**
     * 更新当前生命值
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateHP(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < 0) {
            iResult = 0;
        }
        return iResult;
    }

    /**
     * 更新最大生命值
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateHP_LIMIT(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < UnitAttr.MIN_HP_LIMIT) {
            iResult = UnitAttr.MIN_HP_LIMIT;
        }
        return iResult;
    }

    /**
     * 更新当前魔法值
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateMP(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < 0) {
            iResult = 0;
        }
        return iResult;
    }

    /**
     * 更新最大魔法值
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateMP_LIMIT(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < UnitAttr.MIN_MP_LIMIT) {
            iResult = UnitAttr.MIN_MP_LIMIT;
        }
        return iResult;
    }

    /**
     * 更新速度
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateSPEED(rkAttr: UnitAttrElement) : number {
        let iBase = rkAttr.getFactor(AttrFactorType.AFT_Base);
        let iAddValue = rkAttr.getFactor(AttrFactorType.AFT_Add_Constant);
        let iAddPer = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        let iResult = (iBase + iAddValue) * (1 + iAddPer / UnitAttr.PERCENTAGE_100);
        if (iResult < UnitAttr.MIN_MOVE_SPEED) {
            iResult = UnitAttr.MIN_MOVE_SPEED;
        }
        return iResult;
    }

    /**
     * 更新闪避几率
     *
     * @param {UnitAttrElement} rkAttr
     * @memberof UnitAttr
     */
    private updateDODGE(rkAttr: UnitAttrElement) : number {
        let iResult = rkAttr.getFactor(AttrFactorType.AFT_Add_Percentile);
        if (iResult < 0) {
            iResult = 0;
        }
        if (iResult > UnitAttr.MAX_DODGE_CHANCE) {
            iResult = UnitAttr.MAX_DODGE_CHANCE;
        }
        return iResult;
    }
}
```
