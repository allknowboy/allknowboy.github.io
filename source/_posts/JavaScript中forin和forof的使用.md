---
title: JavaScript中for...in和for...of的使用
tags:
  - JavaScript中for...in和for...of的使用
categories: 编程语言
abbrlink: 5d379853
date: 2020-09-20 15:06:23
---

### 定义一个需要遍历的对象

```js
const obj1 = {
    [0]: 100,
    [1]: 101,
    [2]: 102,
    [3]: 103,
    item1: 'item1',
    fun1: function() {
        console.log(this[0])
    },
    arr1: [1, 2, 3],
    [Symbol.iterator](){
        let n = this.arr1.length
        return {
            i: 0,
            next() {
                if (this.i < n) {
                    return {value: this.i++, done: false}
                }
                return {value: undefined, done: true}
            }
        }
    }
};
```

### 使用for...in...遍历

```js
console.log('use for...in')
for (let obj in obj1) {
    console.log(obj);
}
```

### 使用for...of...遍历

```js
console.log('use for...of')
for (let obj of obj1) {
    console.log(obj);
}
```

### 添加新的内容然后遍历

```js
obj1.arr1.push(4, 5, 6);
console.log('use for...of add')
for (let obj of obj1) {
    console.log(obj);
}
```

### 遍历字符串

```js
let str = 'merry'
for (let obj of str) {
    console.log(obj);
}
```

### 输出结果

```bash
use for...in
0
1
2
3
item1
fun1
arr1
use for...of
0
1
2
use for...of add
0
1
2
3
4
5
m
e
r
r
y
```