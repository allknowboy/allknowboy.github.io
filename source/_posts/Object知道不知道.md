---
title: Object知道不知道
tags:
  - nodejs
  - object
categories:
  - 游戏编程
abbrlink: 5a4def9
date: 2017-05-25 14:40:21
---

## assign

- 复制对象

```ts
let obj1 = {
    a: 111,
    b: {
        c: 123
    }
}
let obj2 = {
    c: 111,
    b: {
        e: 123
    }
}

let ret = Object.assign(obj1, obj2)
console.log(ret)
```

- 结果

```ts
{
    a: 111,
    b: {
        e: 123
    }
}
```

## create

- 创建新的对象

```ts
const obj = {
    name: 'limo',
    print() {
        console.log(`name:${this.name}`)
    }
}

const newObj = Object.create(obj)
newObj.name = 'jack'
newObj.print()
```

- 结果

```ts
name:jack
```

## entries

- 返回对象枚举

```ts
const object1 = {
  a: 'somestring',
  b: 42
};

for (let [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"
// order is not guaranteed
```

## keys

- 返回当前的key的数组

```ts
var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.keys(obj)); 

// console: ['0', '1', '2']
```

## values

- 返回当前的value的数组

```ts
var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.values(obj)); // ['a', 'b', 'c']
```

## fromEntries

- 键值对列表转为对象

```ts
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

const obj = Object.fromEntries(entries);

console.log(obj);
// expected output: Object { foo: "bar", baz: 42 }
```

## is

- 判断两个值是否是相同的值

### 判断两个是否相同的成立方式

- 两个值都是 undefined
- 两个值都是 null
- 两个值都是 true 或者都是 false
- 两个值是由相同个数的字符按照相同的顺序组成的字符串
- 两个值指向同一个对象
- 两个值都是数字并且
  - 都是正零 +0
  - 都是负零 -0
  - 都是 NaN
  - 都是除零和 NaN 外的其它同一个数字
