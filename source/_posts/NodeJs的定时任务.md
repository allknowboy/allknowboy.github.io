---
title: NodeJs的定时任务
tags:
  - nodejs
  - server
  - 定时任务
  - cron
categories:
  - 游戏编程
abbrlink: '8860e174'
date: 2018-05-25 14:40:21
---

```blockquote 鲁迅
   **想干活的时候先上npm找找**
```

## 前言

有两个实现定时任务的类库,为什么cron下载多，可能因为短，就用这个

|类库|当周下载量|
| :--: | --: |
|node-schedule| 192699|
|cron| 499,742|

## 安装

- 当然是用ts开发

```bash
$ npm i cron
$ npm i @types/cron
```

## 简单测试

### 基础使用

- 每秒都输出当前的时间
- 构建job通过start方法启动

```ts
import { CronJob, CronTime } from 'cron'

let job = new CronJob('* * * * * *', () => {
    const d = new Date()
    console.log(d.toLocaleString(undefined, {
        hour12: false
    }))
})
job.start()
```

### 修改时间参数

- 保存job的句柄，在其他地方修改任务的时间设置
- 先用stop停止之前的任务，在用start开始

```ts
import { CronJob, CronTime } from 'cron'

let job = new CronJob('* * * * * *', () => {
    const d = new Date();
    console.log(d.toLocaleString(undefined, {
        hour12: false
    }));
})
job.start()

....
干了很多事情了
....

job.stop()
job.setTime(new CronTime('*/10 * * * * *'))
job.start()
```

### 时间的校验

- 一般设置的触发条件可能要等很久，所以要有一个检测
- 不然等到触发时间了，结果无效的，就呵呵呵了

#### 获取下次触发的时间

```ts
job.nextDate()
```

#### 获取接下来5次触发的时间

```ts
job.nextDates(5)
```

## cron表达式

### 标识含义

```ts
* * * * * *
```

1. Seconds
2. Minutes
3. Hours
4. Day-of-Month
5. Month
6. Day-of-Week

### 参数设置

Seconds (秒) ：可以用数字0－59 表示，
Minutes(分) ：可以用数字0－59 表示，
Hours(时) ：可以用数字0-23表示,
Day-of-Month(天) ：可以用数字1-31 中的任一一个值，但要注意一些特别的月份
Month(月) ：可以用0-11
Day-of-Week(每周)：可以用数字1-7表示（1 ＝ 星期日）

### 特殊符号

- **\*** 标识任何值
- **,** 用于多个日期的连接
- **-** 用于多个范围的连接
- **/** 用于标识每隔多少时间的操作

### Example

- 具体实现参考

[https://github.com/kelektiv/node-cron/tree/master/examples](https://github.com/kelektiv/node-cron/tree/master/examples)
