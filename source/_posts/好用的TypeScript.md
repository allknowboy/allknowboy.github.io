---
title: 好用的TypeScript
tags:
  - typescript
categories:
  - 编程语言
abbrlink: 576eb6bf
date: 2019-04-10 11:26:20
---

## TS中的枚举定字符串

- 通过给枚举定义字符串可以使用消息管理器
- 之前都是用静态对象定义

```ts
import { EventEmitter } from 'events';

enum EventType {
    OPEN = 'open',
    CLOSE = 'close',
}

const eventEmitter = new EventEmitter();

eventEmitter.on(EventType.OPEN, () => {
    console.log('call open');
});

eventEmitter.on(EventType.CLOSE, () => {
    console.log('call close');
});

eventEmitter.emit(EventType.OPEN);
eventEmitter.emit(EventType.CLOSE);
```

## TS中的单例模式

```ts
export class Singleton {
    private static _instance: Singleton
    private constructor() {}
    static getInstance() : Singleton {
        if (!Singleton._instance) {
            Singleton._instance = new Singleton()
        }
        return Singleton._instance
    }
}
```

## TS中的可继承单例

- 使用函数方法  

```ts
export function Singleton<T>() {
    class SingletonTemp {
        private static _instance: any;
        protected constructor() {}
        static getInstance() : T {
            if (!SingletonTemp._instance) {
                SingletonTemp._instance = new this();
            }
            return SingletonTemp._instance as T;
        }
    }
    return SingletonTemp;
} 
```

- 使用继承

```ts
class Test extends Singleton<Test>() {
    print(msg: string) {
        console.log(msg);
    }
}
```

- 测试 

```ts
Test.getInstance().print("single")
```

## 使用type定义一个简单的pair

```ts
type pair<K, V> = [K, V];
const p: pair<number, string> = [1, 'name'];
```

## TS中的Setter和getter实现

```ts
    private _name: string

    set name(val: string) {
        this._name = val
    }

    get name() {
        return this._name
    }
```

## TS函数模拟传入对象指针

- 使用对象解构完成对象指针传入
- 将当前对象的引用在函数做修改

```ts
let data = {
    id: 1
}

function changeData({data: any} : any) {
    let d = {
        id: 2
    }
    data = d;
}
console.log('data before', data);
changeData({data});
console.log('data after',data);
```

- 输出内容

```ts
data before { id: 1 }
data after { id: 2 }
```