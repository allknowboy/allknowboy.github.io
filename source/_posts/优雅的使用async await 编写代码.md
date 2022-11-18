---
title: 优雅的使用async await 编写代码
tags:
  - JavaScript
  - async
  - TypeScript
categories: 编程语言
abbrlink: fc6ceae4
date: 2017-12-07 15:05:03
---

## Promise链式调用

### 首先有多个异步方法

- 返回一个Promise对象
- 有50%的几率返回正确 50%返回错误

```ts
function p1() : Promise<string> {
    return new Promise<string>((resolve, reject) => {
        //延时操作 使用setTimeout模拟
        setTimeout(()=>{
            if(Math.random() > 0.5){
                resolve('p1 success')
            } else {
                reject('p1 error')
            }
        }, 500);
    })
}

function p2() : Promise<string> {
    return new Promise<string>((resolve, reject) => {
        //延时操作 使用setTimeout模拟
        setTimeout(()=>{
            if(Math.random() > 0.5){
                resolve('p2 success')
            } else {
                reject('p2 error')
            }
        }, 500);
    })
}
```

### 调用这个方法

- 链式调用

```ts
function main() {
    p1()
    .then(res => {
        console.log(res)
        return p2()
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}
```

### 调用main方法

- 调用和一般方法一样

```bash
main()
```

## async & await

### 首先编写一个异步方法

- 返回一个Promise对象
- 有50%的几率返回正确 50%返回错误

```ts
function asyncResult() : Promise<string> {
    return new Promise<string>((resolve, reject) => {
        //延时操作 使用setTimeout模拟
        setTimeout(()=>{
            if(Math.random() > 0.5){
                resolve('success')
            } else {
                reject('error')
            }
        }, 1000);
    })
}

```

### 调用这个异步方法

- 使用await 需要加async标识方法
- 因为异步方法我们定义了reject所以要抓取异常

```ts
async function main() {
    let ans = await asyncResult().catch(err => {
        console.log(err)
    })
    if (ans) {
        console.log('成功！', ans)
    } else {
        console.log('失败！')
    }
}
```

### 调用main方法

- 调用和一般方法一样

```bash
main()
```

## async/await的错误使用

- 定义一个getZero的方法返回一个Promise
- getAsyncZero返回获取的值
- 使用了async/await,逻辑上会有误区先输出z再输出final
- 其实是先输出final再输出z
- 只在async的方法里面 await是按照顺序回调的, 相对其他的函数，这个调用不会堵塞主逻辑

```ts
function getZero() {
    return new Promise((resolve, reject) => {
        resolve(0)
    });
}

async function getAsyncZero() {
    let z = await getZero();
    console.log('z', z)
    return z
}

function main() {
    let final = getAsyncZero();
    console.log('final', final);
}

main();
```

### 输出

```bash
final Promise { <pending> }
z 0
```

## 修复async/await的错误

- 如果硬要使用async的方法返回值
- 需要给当前调用的方法加上async/await
- **【最好不要给async方法加返回值，会造成调用的混乱】**

```ts
function getZero() {
    return new Promise((resolve, reject) => {
        resolve(0)
    });
}

async function getAsyncZero() {
    let z = await getZero();
    console.log('z', z)
    return z
}

async function main() {
    let final = await getAsyncZero();
    console.log('final', final);
}

main();
```

### 输出

- 当前输出是期望的结果

```bash
z 0
final 0
```