---
title: CocosCreator使用protobuf.js序列化数据
tags:
  - cocos creator
  - protobuf
categories:
  - 游戏编程
abbrlink: c862ace6
date: 2018-05-07 15:57:55
---

```blockquote 天行者
   **绕了个大圈，走了很多冤枉路才发现 ，原来做人，不是永远只有一条路。
        其实做什么事情，根本不需要分得那么清楚，闭上眼睛，就分不出来黑与白了。**
```

- 安装protobufjs

```js
npm i protobufjs -g
```

### 编写一个需要交互的proto文件

- awesome.proto

```bash
// awesome.proto
syntax = "proto3";

message AwesomeMessage {
    string name = 1;
}
```

### 编译一个静态的js文件

- 编译静态js文件
- 编译ts版本

```base
pbjs -t static-module -w commonjs -o awesome.js awesome.proto
pbts -o awesome.d.ts awesome.js
```

### awesome.js的引用需要修改

```js
var $protobuf = window.protobuf || {};
```

### 导入一个protobuf.js的最小版本

- 引入一个插件

[protobuf.min.js](/images/cocoscreatorprotobuf/protobuf.min.js)

### 加入两个编译成的文件

- 直接加入(注意不要导入为插件)
[awesome.d.ts](/images/cocoscreatorprotobuf/awesome.d.ts)
[awesome.js](/images/cocoscreatorprotobuf/awesome.js)

### 简单测试

```ts
import { AwesomeMessage } from "./proto/awesome";
...
let asm = AwesomeMessage.fromObject({
    name: '你好Proto',
});

const buf = AwesomeMessage.encode(asm).finish();
console.log(buf);

let message = AwesomeMessage.decode(buf);
let object = AwesomeMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    // see ConversionOptions
});
console.log(object);

```
