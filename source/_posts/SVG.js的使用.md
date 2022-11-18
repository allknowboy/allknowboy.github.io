---
title: SVG.js的使用
tags:
  - SVG.js
  - js类库
categories: 游戏编程
abbrlink: d4558153
date: 2020-12-27 16:10:30
---

### 介绍
![SVG.js](/images/svg.js的使用/logo.png)

　　**svg.js是一个轻量级的操纵和制作SVG动画的js插件库。svg.js可以生成SVG图形、图像、文字和路径等等**

#### 下载地址

- 官网
[https://svgjs.com/docs/3.0/](https://svgjs.com/docs/3.0/)
- github
[https://github.com/svgdotjs/svg.js](https://github.com/svgdotjs/svg.js)

#### 类库版本

- 当前最新版本为3.1,此处使用的为3.0的稳定版本

### HelloWorld

- 编辑一个html文件
- 引入svg.js类库

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../lib/svg.js"></script>
</head>
<body>
    <script src="./index.js"></script>
</body>
</html>
```

- index.js文件
- 画出一个矩形

```js
let draw = SVG().addTo('body').size(300, 300)
let rect = draw.rect(100, 100)
.fill('#f03')
.move(100, 100);
```

![](/images/svg.js的使用/pic01.jpg)

### 基础图形

#### 矩形

```js
let draw = SVG().addTo('body').size(300, 300)
let rect = draw.rect(100, 100)
.fill('#f03')
.move(100, 100);
```
![](/images/svg.js的使用/pic01.jpg)

#### 圆形

```js
let draw = SVG().addTo('body').size(300, 300)
let circle = draw.circle(100, 100).fill('#f96').move(100, 100);
```
![](/images/svg.js的使用/pic02.jpg)

#### 圆角矩形

```js
const { Rect } = SVG;
let draw = SVG().addTo('body').size(500, 500);
let rect = new Rect().fill('#f30').size(100, 100).radius(20).addTo(draw); 
```

![](/images/svg.js的使用/pic03.jpg)

#### 椭圆

```js
const { Rect, Circle, Ellipse, Line } = SVG;
let draw = SVG().addTo('body').size(500, 500);
let ellipse = new Ellipse().move(300, 300).fill('#f80').radius(75, 50).addTo(draw); 
```

![](/images/svg.js的使用/pic04.jpg)

#### 线段

```js
const { Rect, Circle, Ellipse, Line } = SVG;
let draw = SVG().addTo('body').size(500, 500);
let line = draw.line(0, 0, 200, 200).move(20, 20).stroke({
    color: '#f06',
    width: 10, 
    linecap: 'round' 
})
```
![](/images/svg.js的使用/pic05.jpg)

#### 多边形线

```js
const { Polyline } = SVG;
let draw = SVG().addTo('body').size(500, 500);
let polyline = draw.polyline('0,0 100,50 50,100')
.fill('none')
.move(100, 100)
.animate(500)
.stroke({width: 5, color: '#f60', linecap: 'round', linejoin: 'round'})
```
![](/images/svg.js的使用/pic06.jpg)

#### 文本 

```js
const { Text } = SVG;
let draw = SVG().addTo('body').size(300, 130)
let txt = draw.text('哈哈');
```
![](/images/svg.js的使用/pic07.jpg)

#### 多边形

```js
let draw = SVG().addTo('body').size(1000, 1000)
let poly = draw.polygon([
    [200, 300],
    [250, 300],
    [400, 500],
    [300, 650],
]).fill('#c3185c').stroke('#252525');
```
![](/images/svg.js的使用/pic08.jpg)

#### 超链接

```js
let draw = SVG().addTo('body').size(500, 500);
let link = draw.link('http://svgdotjs.github.io/');
link.target('_blank')
let rect = link.rect(100, 100);
```

### 高级应用

#### 渐变图形
```js
let draw = SVG().addTo('body').size(1000, 1000);
let circle = draw.circle(300);
circle.move(20, 20)
let gradient = draw.gradient('linear', function(add) {
	add.stop(0, '#a18cd1')
    add.stop(1, '#fbc2eb')
});
gradient.from(0, 1).to(0, 0);
circle.attr({
    fill: gradient
})

draw.circle(300).fill(draw.gradient('linear', function(add) {
    add.stop(0, '#eea2a2')
    add.stop(0.19, '#bbc1bf')
    add.stop(0.42, '#57c6e1')
    add.stop(0.79, '#b49fda')
    add.stop(1, '#7ac5d8')
}).from(0, 0).to(1, 0)).move(400, 20);
```
![](/images/svg.js的使用/pic10.jpg)

### 动作

- 执行多个动作

```js
let draw = SVG().addTo('body').size(1000, 1000);
let rect1 = draw.rect(100, 100).attr({fill: '#b03'});
rect1.animate().move(150, 150);
let rect2 = draw.rect(100, 100).attr({fill: '#a03'});
rect2.animate({
    duration: 2000,
    delay: 1000,
    when: 'now',
    swing: true,
    times: 5,
    wait: 200
}).attr({ fill: '#393' })
let rect3 = draw.rect(100, 100).attr({fill: '#003'}).animate({
    delay: 200
}).move(300, 200);
```
![](/images/svg.js的使用/ani03.gif)

### 事件

- 鼠标的事件

```js
const { Text } = SVG;
let draw = SVG().addTo('body').size(1000, 1000);
let rect = draw.rect(100, 100).attr({fill: '#b03'});
let circle = draw.circle(100).attr({fill: '#b03'}).move(100, 100);
addEvent(rect);
addEvent(circle);

function addEvent(element) {
    element.on('mousedown', mousedown)
    element.on('mouseup', mouseup)
    element.on('mouseover', mouseover)
    element.on('mouseout', mouseout)
}

function mousedown() {
    this.animate(100, '<>').fill('#000');
}

function mouseup() {
    this.animate(100, '<>').fill('#b03');
}

function mouseover() {
    this.animate(100, '<>').fill('#f90');
}

function mouseout() {
    this.animate(100, '<>').fill('#b03');
}
```
![](/images/svg.js的使用/ani04.gif)

### 附加类库

#### 缓动类库
- 类库地址
[https://github.com/svgdotjs/svg.easing.js](https://github.com/svgdotjs/svg.easing.js)

- 提供的缓动函数
  - quadIn
  - quadOut
  - quadInOut
  - cubicIn
  - cubicOut
  - cubicInOut
  - quartIn
  - quartOut
  - quartInOut
  - quintIn
  - quintOut
  - quintInOut
  - sineIn
  - sineOut
  - sineInOut
  - expoIn
  - expoOut
  - expoInOut
  - circIn
  - circOut
  - circInOut
  - backIn
  - backOut
  - backInOut
  - swingFromTo
  - swingFrom
  - swingTo
  - bounce
  - bounceOut
  - elastic

- 测试类库

```js
let draw = SVG().addTo('body').size(1000, 1000);
let rect = draw.rect(200, 100).radius(20).move(100, 100).fill('#f96');
rect.animate(300).ease(SVG.easing.backOut).transform({
    rotate: 125,
    translateX: 300,
    translateY: 100,
    scale: 1.5 
});
```

![](/images/svg.js的使用/ani05.gif)

#### 滤镜类库
- 类库地址
[https://github.com/svgdotjs/svg.filter.js](https://github.com/svgdotjs/svg.filter.js)

- 测试类库

```js
let draw = SVG().addTo('body').size(1200, 1200);
const W = 180;
const H = 120;

let image = null;
// 高斯模糊
image = draw.image('./test.jpg').size(W, H).move(0 * W, 0 * H);
image.filterWith(add => {
    add.gaussianBlur(2);
})

// 径向模糊
image = draw.image('./test.jpg').size(W, H).move(1 * W, 0 * H);
image.filterWith(add => {
    add.gaussianBlur(2, 0);
})

// 色彩饱和度
image = draw.image('./test.jpg').size(W, H).move(2 * W, 0 * H);
image.filterWith(add => {
    add.colorMatrix('saturate', 0);
})

// 对比度
image = draw.image('./test.jpg').size(W, H).move(3 * W, 0 * H);
image.filterWith(add => {
    let amount = 4
    add.componentTransfer({
        type: 'linear',
        slope: amount,
        intercept: -(0.3 * amount) + 0.3
    })
})

// 旧时光
image = draw.image('./test.jpg').size(W, H).move(0 * W, 1 * H);
image.filterWith(add => {
    add.colorMatrix('matrix', [ .343, .669, .119, 0, 0
        , .249, .626, .130, 0, 0
        , .172, .334, .111, 0, 0
        , .000, .000, .000, 1, 0 ])
})

// 颜色翻转
image = draw.image('./test.jpg').size(W, H).move(1 * W, 1 * H);
image.filterWith(add => {
    add.colorMatrix('hueRotate', 180)
})

// 底片效果
image = draw.image('./test.jpg').size(W, H).move(2 * W, 1 * H);
image.filterWith(add => {
    add.colorMatrix('luminanceToAlpha')
})

// 加滤色
image = draw.image('./test.jpg').size(W, H).move(3 * W, 1 * H);
image.filterWith(add => {
    add.colorMatrix('matrix', [ 1.0, 0,   0,   0,   0
        , 0,   0.2, 0,   0,   0
        , 0,   0,   0.2, 0,   0
        , 0,   0,   0,   1.0, 0 ])
})


image = draw.image('./test.jpg').size(W, H).move(0 * W, 2 * H);
image.filterWith(function(add) {
    add.morphology("dilate", 2);
})

image = draw.image('./test.jpg').size(W, H).move(1 * W, 2 * H);
image.filterWith(function(add) {
    let blur = add.offset(0, 1).in(add.$sourceAlpha).gaussianBlur(1)
    add.blend(add.$source, blur)
})


image = draw.image('./test.jpg').size(W, H).move(2 * W, 2 * H);
image.filterWith(function(add){
    var matrix = add.convolveMatrix([
        1,0,0,0,0,0,
        0,1,0,0,0,0,
        0,0,1,0,0,0,
        0,0,0,1,0,0,
        0,0,0,0,1,0,
        0,0,0,0,0,1
    ]).attr({
    devisor: '2',
    preserveAlpha: 'false'
    }).in(add.$sourceAlpha)

    //recolor it
    var color = add.composite(add.flood('#ff2222'),matrix,'in');

    //merge all of them toggether
    add.merge(color,add.$source);
})
```
![](/images/svg.js的使用/pic09.jpg)

### 例子

#### 点击变换切割矩形
```js
let draw = SVG().addTo('body').size(1000, 1000)

let cutX = 0;
let cutY = 0;

let polygon = draw.polygon([
    [cutX, 0],
    [400, 0],
    [400, 400],
    [0, 400],
    [0, cutY],
    [cutX, cutY],
]).attr({
    'fill': '#b2d749',
    'stroke': '#092323',
    'stroke-width': 5
}).move(20, 20);

document.addEventListener('mousedown', event => {
    cutX = event.clientX - 25;
    cutY = event.clientY - 25;
    polygon.clear();
    polygon.animate(600).plot([
        [cutX, 0],
        [400, 0],
        [400, 400],
        [0, 400],
        [0, cutY],
        [cutX, cutY],
    ]).attr({
        'fill': '#b2d749',
        'stroke': '#092323',
        'stroke-width': 5
    }).move(20, 20);;
})

```
![](/images/svg.js的使用/ani01.gif)

#### 文本按钮和图形按钮

```js
let draw = SVG().addTo('body').size(1000, 1000);
let btn = draw.group();
let rect = draw.rect(80, 40).radius(10).fill('#f96');
btn.add(rect);
let txt = draw.text("Button").fill("#FFF").center(40, 20);
btn.add(txt);
btn.move(100, 100)
btn.css('cursor', 'pointer')

btn.click(function() {
    alert('点击到了按钮！')
    btn.click(null)
})

let imageBtn = draw.group();
let image = draw.image('./btn.jpg').scale(0.1);
imageBtn.add(image);
imageBtn.move(300, 90)
imageBtn.css('cursor', 'pointer')
imageBtn.click(function() {

})

addEvent(imageBtn);

function addEvent(element) {
    element.on('mousedown', mousedown)
    element.on('mouseup', mouseup)
    element.on('mouseover', mouseover)
    element.on('mouseout', mouseout)
}

function mousedown() {
    this.animate(100).transform({
        scale: 0.9
    })
}

function mouseup() {
    this.animate(100).transform({
        scale: 1.0
    })
}

function mouseover() {
    // this.animate(100).transform({
    //     scale: 1.0
    // })
}

function mouseout() {
    this.animate(100).transform({
        scale: 1.0
    })
}
```

![](/images/svg.js的使用/ani06.gif)

#### snap的测试demo

```js
let draw = SVG().addTo('body').size(1000, 1000)
let bigCircle = draw.circle(300).move(60, 60);
bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
});
let smallCircle = draw.circle(210).move(30, 90);
let discs = draw.group();
discs.add(smallCircle);
discs.add(draw.circle(210).move(180, 90));
discs.attr({
    fill: "#FFF"
});
let mask = draw.mask().add(discs);
bigCircle.maskWith(mask);
smallCircle.animate(1000).size(150)
discs.find("circle:nth-child(2)").animate(1000).size(150);
let p = draw.pattern(10, 10, function(add) {
    add.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
        fill: "none",
        stroke: "#bada55",
        strokeWidth: 5
    });
})
bigCircle.attr({
    fill: p
});

let gradient = draw.gradient('linear', function(add) {
	add.stop(0, '#a18cd1')
    add.stop(1, '#fbc2eb')
}).from(0, 0).to(0, 1);

discs.attr({
    fill: gradient
})
```

![](/images/svg.js的使用/ani02.gif)

