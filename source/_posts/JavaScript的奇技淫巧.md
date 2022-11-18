---
title: JavaScript的奇技淫巧
tags:
  - JavaScript
categories: 编程语言
abbrlink: 123ffaad
date: 2017-02-13 10:30:03
---

## 复制数组

- 使用...

```js
let arr1 = [1, 2, 3, 4, 5];
let arr2 = [...arr1];
// 输出两个数组
console.log('arr1', arr1);
console.log('arr2', arr2);
// 修改第一个数组
arr1[0] = 110;
arr2[1] = 221;
console.log('--------------------------------')
// 输出两个数组
console.log('arr1', arr1);
console.log('arr2', arr2);
```

- 输出结果，两个数组已经不关联了

```bash
arr1 [ 1, 2, 3, 4, 5 ]
arr2 [ 1, 2, 3, 4, 5 ]
--------------------------------
arr1 [ 110, 2, 3, 4, 5 ]
arr2 [ 1, 221, 3, 4, 5 ]
```

## 取整

js取整方法一般有以下几种 toFixed(0)之类的就不列出了

- Math.round(x)
- Math.floor(x)
- Math.ceil(x)
- ~~x

### 可把一个数字舍入为最接近的整数

- 下面的答案是什么？

```js
 Math.round(-12.5) = ?
```

- 就算知道答案也要思考一下
- 临界值比较模糊不适合逻辑思考

```js
Math.round(-12.5) = -12
Math.round(12.5) = 13
```

### 看看floor和ceil吧

- 在[-∞ , +∞]的轴上
- floor 会变成当前最近左边的整数
- ceil 会变成当前最近右边的整数

```js
Math.floor(-12.5) = -13
Math.floor(12.5) = 12
Math.ceil(-12.5) = -12
Math.ceil(12.5) = 13
```

### 我最爱用的~~

效果和Math.floor一致，可是只要两个符号，这个可以偷懒！！！

### 创建一个带区间的整数随机数

- 参数可以是一个最大值
- 也可以是最大值和最小值
- 不包含最大值

```js
function randomInt(max, min) {
    min = min || 0;
    return ~~((max - min) * Math.random() + min);
}
```

## 使用 || 或者 && 设置和判断值

| 类型| 转换类型|
|--|--|
|非0数字（含Infinity）| true |
|Object对象 | true |
|非空字符串 | true |
|0/NaN | false |
|null | false |
|undefined | false |

```js
  min = min || 0;
```

- 借用上面的一段代码
- 先判断是否存在min
- ||的逻辑是先判断左边是否为真 为真返回左边 不为真直接返回右边
- 一般用于判断非空和初始化

```js
let x = 1;
x = x && x - 1;
```

- 当验证了x的存在时 再对x进行操作
- 相对用的比较少 因为功能和三目运算符有些重叠的地方
- 也可以使用||和&&实现三目运算符的功能

## JS次方

- 使用**代替Math.pow

```ts
let x = 5
let a = Math.pow(x, 3)
let b = x**3
console.log(a)
console.log(b)
// a = 125
// b = 125
```
