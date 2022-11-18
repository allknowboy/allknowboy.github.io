---
title: 游戏编程的常用方法JS&TS篇
tags:
  - 洗牌算法
  - 种子随机数
categories:
  - 游戏编程
abbrlink: 5b64b49
date: 2016-11-29 12:56:32
---

## 前言
游戏开发之中有许多固定的需求，比如排序，如果让你手写的话，很多人只能写出一个冒泡排序，想了想还是使用语言自带的快速排序。那么如果是乱序呢？脑子里面第一时间想到的肯定是好几个循环的东西。这种固定的需求，需要的只是找到好的轮子，然后安上，下面就是记录轮子的地方，会不定时有新的轮子加入。

### 乱序算法

- 棋牌游戏中经常会用到的洗牌

#### Fisher-Yates Shuffling算法

```js
function shuffle(arr) {
    var i,
        j,
        temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};
```

#### 使用方法

```js
var a = [1, 2, 3, 4, 5, 6, 7, 8];
var b = shuffle(a);
console.log(b);
// [2, 7, 8, 6, 5, 3, 1, 4]
```

### 随机数(带种子)
- 帧同步中需要固定的伪随机
- 去除~~可以获得小数的随机

```js
/**
 * 带种子的整数随机数
 * @param {*} max 
 * @param {*} min 
 */
function randomInt(max, min) {
    min = min || 0;
    randomInt.seed = (randomInt.seed * 9301 + 49297) % 233280;
    let rand = randomInt.seed / 233280.0;
    return min + ~~(rand * (max - min));
}
randomInt.seed = 200;
```
#### 使用方法

```js
for (let i = 0; i < 10; i++) {
    console.log(randomInt(10));
}
// 1  
// 8  
// 6  
// 7  
// 0  
// 7  
// 1  
// 2  
// 6  
// 9
```

### 获取文件后缀名

- 获取文件的后缀名 如果没有后缀名

```js
function getFileExtension(fileName: string) {
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
}
```

#### 使用方法

```js
console.log(getFileExtension3(''));                            // ''
console.log(getFileExtension3('filename'));                    // ''
console.log(getFileExtension3('filename.txt'));                // 'txt'
console.log(getFileExtension3('.hiddenfile'));                 // ''
console.log(getFileExtension3('filename.with.many.dots.ext')); // 'ext'
```

### 下载头像前排除本地头像

```ts
// 本地的头像数据
const LOCAL_AVATARS = [
    'head1',
    'head2',
    'head3',
    'head4',
    'head5',
    'head6',
    'head7',
];
/**
 *  判断是否存在本地头像
 *
 * @export
 * @param {string} avatar
 * @returns {boolean}
 */
export function hasLocalAvatar(avatar: string): boolean {
    return LOCAL_AVATARS.some(v => {
        return avatar == v;
    });
};
```

#### 使用方法

- ts代码
- 返回是否存在本地头像

### 截取字符串

#### 截取固定字符数量(中英文都算一个字符数量)

```ts
/**
 * 截取字符串
 * 中文和英文都算一个字符
 *
 * @export
 * @param {string} text
 * @param {number} numSub
 * @returns {string}
 */
export function cutText(text: string, numSub: number): string{
    if(text.length > numSub){
        return `${text.substring(0, numSub)}...`
    }
    return text
}
```

#### 截取固定字符长度

- 用于固定长度的展示

```ts
/**
 * js截取字符串，中英文都能用 
 *
 * @export
 * @param {string} str
 * @param {number} len
 * @returns
 */
export function cutStr(str: string, len: number) {
        let l = 0;
        let ret = '';
        for (let i = 0 , n = str.length; i < n; i++) {
            let a = str.charAt(i);
            l++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                l++;
            }
            ret = ret.concat(a)
            if (l >= len) {
                console.log(l)
                console.log(len)
                if(i != n - 1) {
                    ret = ret.concat('...')
                }
                return ret
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (l < len) {
            return str
        }
}
```

#### guid生成器

- 可以生成guid

```ts
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    }).toUpperCase()
}
```

