---
title: RPC的JSON函数解析
tags:
  - rpc
  - json
  - 数据解析
categories: 游戏编程
abbrlink: 1b2048c9
date: 2020-11-06 11:42:46
---

### json内容

```json
[
    "do",
    [
        "def", 
        "drawTriangle", 
        [
            "fn", 
            ["left", "top", "right", "color"],
            [
                "do",
                ["drawLine", "left", "top", "color"],
                ["drawLine", "top", "right", "color"],
                ["drawLine", "left", "right", "color"]
            ]
        ]
    ],
    ["consoleLine"],
    ["drawTriangle", {"x": 0, "y": 0}, {"x": 3, "y": 3}, {"x": 6, "y": 0}, "蓝色"],
    ["consoleLine"],
    ["drawTriangle", {"x": 6, "y": 6}, {"x": 10, "y": 10}, {"x": 6, "y": 16}, "红色"],
    ["consoleLine"]
]
```

### 解析文件

```js
let instructions = require("./instructions.json");

function drawLine(p1, p2, color) {
    console.log(`画出当前一条线[${p1.x}, ${p1.y}]到[${p2.x}, ${p2.y}],颜色为${color}`);
    return {p1, p2};
}

function rotate(node, angle) {
    console.log(`${JSON.stringify(node)}旋转角度:${angle}`);
    return {angle};
}

function consoleLine() {
    console.log("-----------------------------");
}

function parseRPC(jsonStr) {
    // 当前变量存储的地方
    const variables = {};
    // 当前支持的函数集合
    const fns = {
        drawLine,
        rotate,
        consoleLine,
        do: (...args) => args[args.length - 1],
        def: (name, v) => variables[name] = v,
    }

    // 将数组转化为map
    const mapArgsWithValues = (args, values) => {
        return args.reduce((res, key, idx) => {
            res[key] = values[idx];
            return res;
        }, {});
    }

    // 解析函数
    const parseFnInstruction = (args, body, oldVariables) => {
        return (...values) => {
            const newVariables = {
                ...oldVariables,
                ...mapArgsWithValues(args, values),
            };
            return parseInstruction(body, newVariables);
        }
    }

    // 解析指令
    const parseInstruction = (ins, variables) => {
        // 判断是否是已经定义的变量
        if (variables[ins]) {
            return variables[ins];
        }
        // 判断是否是数组
        if (!Array.isArray(ins)) {
            return ins;
        }
        const [fName, ...args] = ins;
        // 当前的内容为fn的时候构建新的函数
        if (fName === "fn") {
            return parseFnInstruction(...args, variables);
        }
        // 先检索定义的函数表 没有的话就从自定义表找
        const fn = fns[fName] || variables[fName];
        return fn(...args.map(arg => parseInstruction(arg, variables)));
    }
    // 解析
    parseInstruction(jsonStr, variables);
}

parseRPC(instructions);
```

### 调用结果

```bash
-----------------------------
画出当前一条线[0, 0]到[3, 3],颜色为蓝色
画出当前一条线[3, 3]到[6, 0],颜色为蓝色
画出当前一条线[0, 0]到[6, 0],颜色为蓝色
-----------------------------
画出当前一条线[6, 6]到[10, 10],颜色为红色
画出当前一条线[10, 10]到[6, 16],颜色为红色
画出当前一条线[6, 6]到[6, 16],颜色为红色
-----------------------------
```

### Tips

**可以用于游戏中一些带函数调用的配置文件处理，比如关卡的配置和人物技能配置等**

### 参考链接

[https://stopa.io/post/265](https://stopa.io/post/265)
