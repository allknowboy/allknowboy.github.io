---
title: 开始使用typeorm
tags:
  - JavaScript
  - typeorm
  - typescript
categories:
  - 游戏编程
abbrlink: 3f556577
date: 2019-04-09 21:46:40
---

## 前言

&emsp;&emsp;nodejs操作数据库，有许多方便的orm框架。Sequlize的操作就很方便，define定义数据表的类型，就能方便的使用Sequlize提供的各种方法。不过v5版本进行了比较大的改动，使用typescript开发不是很方便，最后发现了typeorm，它和typescript简直是绝配。

## 安装typeorm

**typeorm**的官网：[https://typeorm.io/](https://typeorm.io/)  

- 安装typeorm

```bash
npm install reflect-metadata
npm install typeorm
```

- 安装数据库操作类库(这里使用的Sqlite3)

```bash
npm install sqlite3
```

## 先新建实体类

- Photo.ts

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column({
        length: 100
    })
    name: string = '';

    @Column('text')
    description: string = '';

    @Column()
    filename: string = '';

    @Column("double")
    views: number = 0;

    @Column()
    isPublished: boolean = false;

    @Column('simple-array')
    times: string[] = [];

    @Column("simple-json")
    profile: { name: string, nickname: string } = { name: '', nickname: ''};
}
```

## 入口类

```ts
import 'reflect-metadata'; // 需要优先导入
import { createConnection, getManager } from 'typeorm'
import path from 'path';
import { Photo } from './entity/Photo';

// 创建连接的方法
createConnection({
    type: 'sqlite', // 数据库的相关配置
    database: path.resolve(__dirname, './db.sqlite'),
    entities: [
        Photo // 需要加入的实体
    ],
    synchronize: true,
}).then(async connection => {
    console.log('连接成功');
    // 可以进行相关的操作
}).catch(err => {
    console.log('连接失败', err);
});
```

## 简单的增删改查

### 增

```ts
    // 增
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;
    photo.times.push('entitys1');
    photo.times.push('entitys2');
    photo.times.push('entitys3');
    photo.profile.name = 'link';
    photo.profile.nickname = 'me';
    getManager().save(photo);
```

![](/images/typeormstart/typeorm1.png)

### 改

```ts
    const photoRepository = getManager().getRepository(Photo);
    const photo = await photoRepository.findOne({
        id: 1
    });
    if(photo){
        photo.views = 10086;
        photoRepository.save(photo);
    }
```

![](/images/typeormstart/typeorm3.png)

### 查

```ts
    const photoRepository = getManager().getRepository(Photo);
    const photos = await photoRepository.findOne({
        id: 1
    })
    console.log(photos);
```

![](/images/typeormstart/typeorm2.png)

### 删

```ts
    const photoRepository = getManager().getRepository(Photo);
    const photo = await photoRepository.findOne({
        id: 1
    });
    if(photo) {
        photoRepository.remove(photo);
    }
```

![](/images/typeormstart/typeorm4.png)

## SQLITE的管理工具

- SQLLiteStudio(简单方便的Sqlite管理工具) 

下载地址:[https://www.cr173.com/soft/94247.html](https://www.cr173.com/soft/94247.html)

![](/images/typeormstart/typeorm5.png)


## Column的类型

- 一些特殊类型 不用自己写入 自动生成
- 时区好像有问题 是格林威治的时区

```ts
// 创建时间
@CreateDateColumn()
createDate: Date = new Date();
// 修改时间
@UpdateDateColumn()
updateDate: Date = new Date();
// 数据版本
@VersionColumn()
version: number = 0;
```

- 枚举类型的字段

```ts
export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    GHOST = "ghost"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GHOST
    })
    role: UserRole
}
```

- 简单的数组类型

```ts
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    names: string[];

}
```

- 简单的json类型

```ts
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-json")
    profile: { name: string, nickname: string };

}
```

- 实体类的继承

```ts
export abstract class Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

}
@Entity()
export class Photo extends Content {

    @Column()
    size: string;

}

@Entity()
export class Question extends Content {

    @Column()
    answersCount: number;

}

@Entity()
export class Post extends Content {

    @Column()
    viewCount: number;

}
```

## 使用实体类作为类型

- 名字的实体
- 只是用来表示类型

```ts
import {Entity, Column} from "typeorm";

export class Name {

    @Column()
    first: string;

    @Column()
    last: string;

}
```

- 使用类型

```ts
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Name} from "./Name";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: string;

    @Column(type => Name)
    name: Name;

    @Column()
    isActive: boolean;

}
```

## 一对一的单向实体连接

- 建立一个实体类

```ts
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: string;

    @Column()
    photo: string;

}
```

- 加入一个实体类的连接
- profile的内容连接到User类里面

```ts
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {Profile} from "./Profile";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(type => Profile)
    @JoinColumn()
    profile: Profile;

}
```

- 先实例化Profile并存入数据库
- 将profile加入user
- 将user加入到数据库

```ts
const profile = new Profile();
profile.gender = "male";
profile.photo = "me.jpg";
await connection.manager.save(profile);

const user = new User();
user.name = 'Joe Smith';
user.profile = profile;
await connection.manager.save(user);
```

- 查询出用户的数据和profile

```ts
const users = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .getMany();
```

## 一对一的双向实体连接

- 先将一个需要绑定的实体指向对象

```ts
import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: string;

    @Column()
    photo: string;

    @OneToOne(type => User, user => user.profile) // specify inverse side as a second parameter
    user: User;

}
```

- 对象中需要有个column来保存profile

```ts
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {Profile} from "./Profile";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(type => Profile, profile => profile.user) // specify inverse side as a second parameter
    @JoinColumn()
    profile: Profile;

}
```

- 通过profile查询绑定的用户数据

```ts
    const profiles = await connection
    .getRepository(Profile)
    .createQueryBuilder("profile")
    .where("user.id = :id", { id: 1 })
    .leftJoinAndSelect("profile.user", "user")
    .getOne();
    console.log(profiles);
```

## 多对单/单对多的实体连接

- 每张图片对应一个用户

```ts
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(type => User, user => user.photos)
    user: User;

}
```

- 每个用户可以对应多张照片

```ts
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Photo} from "./Photo";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

}
```

## PS一些ts的配置

- 使用typeorm的设置

```json
{
    ...
    "strictPropertyInitialization": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
}
```
