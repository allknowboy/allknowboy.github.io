---
title: JS脚本的多种加载方式
tags:
  - defer
  - async
categories: 编程语言
abbrlink: 33324c7b
date: 2020-12-12 20:56:38
---

### Html加载js脚本

#### 常规加载js文件

- js文件的加载会堵塞当前的html文档解析，只有当js脚本加载完成并执行后才继续接下来的文档解析

```html
    <script src = "xx.js"></script>
```

#### async方式加载js文件

- js文件的加载分为下载和执行两个部分，下载js文件不会阻塞文档解析，下载完成之后当即执行js文件(无法明确文件的执行顺序)

```html
    <script src = "xx.js" async></script>
```

#### defer方式加载js文件

- js文件的加载分为下载和执行两个部分，下载js文件不会阻塞文档解析，当下载完并且文档解析完成的时候执行js文件(有明确文件的执行顺序))

```html
    <script src = "xx.js" defer></script>
```

#### 不同方式的加载顺序图
![](/images/js脚本加载方式/js脚本加载的方式.png)


#### 测试demo

- index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>
<body>
    <script src = "./defer2.js" defer></script>
    <script src = "./defer1.js" defer></script>
    <script src = "./async1.js" async></script>
    <script src = "./async2.js" async></script>
    <script src = "./normal.js"></script>
    <div id='view' style="width:200px;height:200px;"></div>
</body>
</html>
```

- async1.js

```js
console.log('----------async1.js开始执行------------')
```

- async2.js

```js
console.log('----------async2.js开始执行------------')
```

- defer1.js

```js
console.log('----------defer1.js开始执行------------')
let $view = document.getElementById('view');
$view.style.backgroundColor = '#FF0000';
```

- defer2.js

```js
console.log('----------defer2.js开始执行-----------')
```

- normal.js

```js
window.onload = function () {
    console.log('----------文档加载完成----------')
}
console.log('----------常规js执行------------')
```

- 测试结果

```bash
----------async1.js开始执行------------
----------常规js执行------------
----------defer2.js开始执行-----------
----------defer1.js开始执行-----------
----------async2.js开始执行------------
```