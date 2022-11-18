---
title: NodeJs小船起航
tags:
  - nodejs
  - server
categories:
  - 游戏编程
abbrlink: 95f6902a
date: 2016-05-25 14:40:21
---

## 介绍

  Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效Node.js 的包管理器 npm，是全球最大的开源库生态系统。

### 下载地址：

[https://nodejs.org/en/](https://nodejs.org/en/)

**沉稳向左，激进向右**

### 查看Node安装版本

``` js
node -v
```

### 问候一下

``` js
console.log('Hello World!');
```

## NodeJs设置npm本地仓库地址

### 在nodejs文件夹里面新建以下两个目录：

- **node_global**
- **node_cache**

### 启动CMD依次执行以下两条命令（方法1）

```bash
npm config set prefix "XXX\nodejs\node_global"
npm config set cache "XXX\nodejs\node_cache"
```
### 修改配置文件（方法2）

**修改..\nodejs\node_modules\npm文件夹下的npmrc文件**

*加入如下的文本:*

```bash
prefix = D:\Program Files\nodejs\node_global
cache = D:\Program Files\nodejs\node_cache
```

### 设置环境变量

```bash
NODE_PATH = XXX\Node\nodejs
PATH = %NODE_PATH%\;%NODE_PATH%\node_modules;%NODE_PATH%\node_global;
```

*重启系统或重启explorer.exe，使环境变量生效*

### 安装模块试试上面的设置是否生效

```bash
npm install express -g 
// -g意思是安装到global目录下，也就是上面设置的XXX\nodejs\node_global
```

## 设置NodeJs的国内仓库
- 通过config命令

```bash
    npm config set registry https://registry.npm.taobao.org
    npm config list
```

- 命令行指定 
**每次执行命令前加入–registry指定仓库路径**

```bash
    npm --registry https://registry.npm.taobao.org install
```

- 编辑 ~/.npmrc 加入下面内容

```bash
    registry = https://registry.npm.taobao.org
```