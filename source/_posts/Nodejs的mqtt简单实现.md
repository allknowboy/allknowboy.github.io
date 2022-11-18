---
title: Nodejs的mqtt简单实现
tags:
  - nodejs
  - server
  - mqtt
categories:
  - 游戏编程
date: 2020-09-14 13:55:39
abbrlink: 6e9bddaf
---

![mosca](/images/Nodejs的mqtt简单实现/mosca_small.png)

## 安装

```bash
npm i mosca
npm i mqtt
```

## 简单服务器

> server.ts

```ts
import { Server, Client, Packet, Authorizer } from 'mosca'

// 简单的设置方法
const setting = {
    // 监听的端口
    port: 12345,
    // 开启http的客户端
    http: {
        port: 12346,    // http的绑定端口
        bundle: true,   // 提供mqtt.js文件地址
    }
}

const server = new Server(setting)
const auth = new Authorizer()


server.on('clientConnected', (client: Client) => {
    console.log('客户端连接的ID：', client.id)
})

server.on('clientDisconnecting', (client: Client) => {
    console.log('客户端正在断连', client.id)
})

server.on('clientDisconnected', (client: Client) => {
    console.log('客户端已经断连', client.id)
})

server.on('published', (packet: Packet, client: Client) => {
    console.log('发布消息：', packet)
})

server.on('subscribed', (topic, client: Client) => {
    console.log('订阅主题：', topic)
})

server.on('unsubscribed', (topic, client: Client) => {
    console.log('取消订阅：', topic)
})

server.on('ready', () => {
    console.log('服务器启动成功！')
    // 简单的acl版本
    // server.authenticate = auth.authenticate
    // auth.addUser('limo', 'limo1234', '+', '+', (err) => {})

    // 自定义的校验方法
    server.authenticate = (client: Client, username: string, password: string, callback) => {
        if (username == 'limo' && password == 'limo123') {
            return callback(null, true)
        } else {
            return callback(null, false)
        }
    }

    server.authorizePublish = (client: Client, topic: string, payload: string, callback) => {
        return callback(null, true)
    }

    server.authorizeSubscribe = (client: Client, topic: string, callback) => {
        return callback(null, true)
    }
});
```

## 简单的本地客户端

> client.ts

```ts
import { connect, Client } from 'mqtt'

const client: Client  = connect('mqtt://127.0.0.1:12345', {
    username: 'limo',
    password: 'limo123'
})

const topic = 'sys/log/now'

client.on('connect', () => {
    console.log('客户端连接成功！')
    client.subscribe(topic)
    setInterval(() => {
        client.publish(topic, new Date().toLocaleString())
    }, 1000)
})

client.on('error', (err) => {
    console.log('连接失败！')
    client.end()
})

client.on('message', (topic, message) => {
    console.log(`topic:${topic} message:${message}`)
})
```

## 简单的html客户端

> index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./mqtt.js"></script>
</head>
<body>
    <script >
        const client  = mqtt.connect('mqtt://192.168.218.88:12346')
        const topic = 'sys/log/now'
        client.on('connect', () => {
            console.log('客户端连接成功！')
            client.subscribe(topic)
        })
        client.on('message', (topic, message) => {
            console.log(`topic:${topic} message:${message}`)
        })
    </script>
</body>
</html>
```
