---
title: WebGL的shader编写
tags:
  - webgl
  - shader
categories: 编程语言
abbrlink: d048c050
date: 2020-12-29 10:50:45
---

### 介绍
![](/images/WebGL的shader编写/logo.jpg)

WebGL(Web图形库)是一个JavaScript API,可在任何兼容的Web浏览器中渲染高性能的交互式3D和2D图形。

### 函数支持查询
[http://web.eecs.umich.edu/~sugih/courses/eecs487/common/notes/APITables-zhs.xml](http://web.eecs.umich.edu/~sugih/courses/eecs487/common/notes/APITables-zhs.xml)

### 基础内容

#### gl_FragCoord
- 这个是当前着色器像素点的位置，是一个vec2值,表明了当前像素点的位置
- 类似与图片中某一点的像素都有对应的x和y的坐标

#### u_time
- 一个时间的增量
- 用来推动整个shader世界的运行

#### u_resolution
- 设备分辨率
- 类似与图片的宽度与高度

#### gl_FragColor
- 片着色器的颜色设置，是一个vec4值
- 类似修改图片中对应[x,y]坐标中的像素

### 高级内容
#### 转换区间
- 原始数值区间是笛卡尔坐标系 x[0 ~ 1], y[0 ~ 1],原点在左下角
- 当坐标减去一个 vec2(0.5)值 可以转化为x[-0.5, 0.5], y[-0.5, 0.5]，原点在中心
- 在减去0.5的基础上再乘以2 可以转化为x[-1, 1], y[-1, 1],原点在中心


### 无图Shader实例
#### 灰色背景
- 一个简单的灰色背景
- 【precision mediump float;】为精度描述
- 【gl_FragColor】为输出片颜色

```cpp
#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec3 color = vec3(0.6, 0.6, 0.6);
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/pic01.jpg)

#### 画一个圆

- step(edge, x)
  - 如果x < edge，返回0.0，否则返回1.0
- length(x)
  - 返回矢量x的长度
- 将小于当前radius的部分涂成黑色 其他涂成白色 实现画出圆

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float circleShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 position = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    float circle = circleShape(position, 0.2);
    color = vec3(circle);
    gl_FragColor = vec4(color.rgb, 1.0);
}
```

![](/images/WebGL的shader编写/pic02.jpg)

#### 画一个矩形

- 使用vec2(0.5) - size * 0.5 使得矩形的中心点在当前的窗口中心

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float rectShape(vec2 position, vec2 size) {
    size = vec2(0.5) - size * 0.5;
    vec2 shaper = vec2(step(size.x, position.x), step(size.y, position.y));
    shaper *= vec2(step(size.x, 1.0 - position.x), step(size.y, 1.0 - position.y));
    return shaper.x * shaper.y;
}

void main() {
    vec2 position = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    color = vec3(rectShape(position, vec2(0.2, 0.5)));
    gl_FragColor = vec4(color.rgb, 1.0);
}
```

![](/images/WebGL的shader编写/pic03.jpg)


#### 画一个多边形

- atan和cos为常规的数学库函数
- 画出的其实为三角形的组合体
- 当边数很大的时候可以画出光滑圆

```cpp
#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535;

uniform vec2 u_resolution;

float polyShape(vec2 position, float radius, float sides) {
	position = position * 2.0 - 1.0;
	float angle = atan(position.x, position.y);
	float slice = PI * 2.0 / sides;
	return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

void main() {
    vec2 position = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    color = vec3(polyShape(position, 0.6, 12.0));
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/pic04.jpg)

#### 移动一个圆

- 与上文圆的代码基本相同
- 加入一个translate的二维向量 可以控制圆的位置

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float circleShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    vec2 translate = vec2(.2, .1);
    coord += translate;
    color = vec3(circleShape(coord, 0.3));
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/pic05.jpg)

#### 运动的圆

- x轴做sin函数运动 区间为 -1 到 1
- y轴做cos函数运动 区间为 -1 到 1
- 缩小区间 修改轴心 使得圆绕视窗中心做圆周运动

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circleShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    vec2 translate = vec2(sin(u_time) / 2.0, cos(u_time) / 2.0);
    coord += translate * 0.5;
    color = vec3(circleShape(coord, 0.2));
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/gif01.gif)

#### 放大缩小的圆

- 图形世界中的各种变换都是由矩阵去完成的
- mat2 2维矩阵 控制当前点的缩放

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

mat2 scale(vec2 scale) {
    return mat2(scale.x, .0, .0, scale.y);
}

float circleShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 position = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    position -= vec2(0.5);
    position = scale(vec2(sin(u_time))) * position;
    position += vec2(0.5);
    color = vec3(circleShape(position, 0.1));
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/gif02.gif)

#### 旋转矩形

- mat2 2维矩阵 控制当前点的旋转

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float rectShape(vec2 position, vec2 size) {
    size = vec2(0.5) - size * 0.5;
    vec2 shaper = vec2(step(size.x, position.x), step(size.y, position.y));
    shaper *= vec2(step(size.x, 1.0 - position.x), step(size.y, 1.0 - position.y));
    return shaper.x * shaper.y;
}

mat2 rotate(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    coord -= vec2(0.5);
    coord = rotate(0.3) * coord;
    coord += vec2(0.5);
    color = vec3(rectShape(coord, vec2(0.3, 0.3)));
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/pic06.jpg)

#### 迷幻波系列

- 使用sin和cos函数加上时间变量产生各种奇幻的波纹 

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    color += cos(coord.x * sin(u_time / 30.0) * 60.0) + cos(coord.y * sin(u_time / 15.0) * 10.0);
    color += sin(coord.x * cos(u_time / 30.0) * 60.0) + sin(coord.y * cos(u_time / 15.0) * 10.0);
    color += sin(u_time / 10.0) * 0.5;
    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/gif03.gif)

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = 6.0 * gl_FragCoord.xy / u_resolution;
    for (int n = 1; n < 8; n++) {
        float i = float(n);
        coord += vec2(0.7 / i * sin(i * coord.y + u_time + 0.3 * i) + 0.8, 0.4 / i * sin(coord.x + u_time + 0.3 * i) + 1.6);
    }
    // coord *= vec2(0.7 / sin(coord.y + u_time +0.3) + 0.8, 0.4 / sin(coord.x + u_time +0.3) +1.6);
    vec3 color = vec3(.5 * sin(coord.x) + 0.5, 0.5 * sin(coord.y) + 0.5, sin(coord.x + coord.y));

    gl_FragColor = vec4(color, 1.0);
}
```

![](/images/WebGL的shader编写/gif04.gif)

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
const int AMOUNT = 12;

void main() {
    vec2 coord = 20.0 * (gl_FragCoord.xy - u_resolution / 2.0) / min(u_resolution.x, u_resolution.y);
    float len;
    for (int i = 0; i < AMOUNT; i++) {
        len = length(vec2(coord.x, coord.y));
        coord.x -= cos(coord.y + sin(len)) + cos(u_time / 9.0);
        coord.y += sin(coord.y + cos(len)) + sin(u_time / 12.0);
    }
    gl_FragColor = vec4(cos(len * 2.4), cos(len * 3.2), cos(len * 1.3), 1.0);
}
```
![](/images/WebGL的shader编写/gif05.gif)


```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    float color = .0;
    color += sin(coord.x * 50.0 + cos(u_time + coord.y * 10.0 + sin(coord.x * 50.0 + u_time))) * 2.0;
    color += cos(coord.x * 20.0 + sin(u_time + coord.y * 10.0 + cos(coord.x * 50.0 + u_time))) * 2.0;
    color += sin(coord.x * 30.0 + cos(u_time + coord.y * 10.0 + sin(coord.x * 50.0 + u_time))) * 2.0;
    color += cos(coord.x * 40.0 + sin(u_time + coord.y * 10.0 + cos(coord.x * 50.0 + u_time))) * 2.0;
    gl_FragColor = vec4(color + coord.y, color + coord.x, color, 1.0);
}
```
![](/images/WebGL的shader编写/gif06.gif)


```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    float color = .0;
    color += sin(coord.x * 6.0 + sin(u_time + coord.y * 90.0 + cos(coord.x * 30.0 + u_time * 2.0))) * 0.5;
    gl_FragColor = vec4(color + coord.x, color + coord.x, color , 1.0);
}
```
![](/images/WebGL的shader编写/gif07.gif)

#### 彩虹漩涡

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    float angle = atan(-coord.y + 0.25, coord.x - 0.5) * 0.1;
    float len = length(coord - vec2(0.5, 0.25));
    color.r += sin(len * 40.0 + angle * 30.0 + u_time);
    color.g += cos(len * 30.0 + angle * 60.0 - u_time);
    color.b += sin(len * 50.0 + angle * 50.0 + 3.0);
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif08.gif)


#### 横向扫描线

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(1.0);
    float size = 20.0;
    float alpha = sin(floor(coord.x * size) + u_time * 4.0) + 0.5;
    color.r = coord.x;
    color.g = coord.y;
    color.b = coord.x * coord.y;
    gl_FragColor = vec4(color, alpha);
}
```
![](/images/WebGL的shader编写/gif09.gif)

#### 移动光球

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(.0);
    coord.x += sin(u_time) + cos(u_time * 2.1);
    coord.y += cos(u_time) + sin(u_time * 2.1);
    color += 0.1 * abs(sin(u_time) + 0.1) / length(coord);
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif10.gif)

#### 光圈

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = (gl_FragCoord.xy / u_resolution);
    vec3 color = vec3(.0);
    vec2 translate = vec2(-0.5, -0.5);
    coord += translate;
    for(int i = 0; i < 40; i++) {
        float radius = 0.3;
        float rad = radians(360.0 / 40.0) * float(i);
        color += 0.003 /length(coord + vec2(radius * cos(rad), radius * sin(rad)));
    }

    
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/pic07.jpg)


#### 格子光斑

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy * 1.0 - u_resolution;
    vec3 color = vec3(.0);

    color += abs(cos(coord.x / 10.0) + sin(coord.y / 10.0) - cos(u_time));

    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif11.gif)

#### 金属格子光束

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random2d(vec2 coord) {
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 coord = gl_FragCoord.xy * 0.1;
    vec3 color = vec3(.0);
    coord -= u_time + vec2(sin(coord.y), cos(coord.x));
    float rand01 = fract(random2d(floor(coord)) + u_time / 60.0);
    float rand02 = fract(random2d(floor(coord)) + u_time / 40.0);
    rand01 *= 0.4 - length(fract(coord));
    gl_FragColor = vec4(rand01 * 4.0, rand02 * rand01 * 4.0, .0, 1.0);
}
```
![](/images/WebGL的shader编写/gif12.gif)

#### 彩色光球

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    vec2 translate = vec2(-0.5);
    coord += translate;
    color.r += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.9 / 12.0)));
    color.g += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.6 / 4.0)));
    color.b += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.3 / 2.0)));
    gl_FragColor = vec4(0.1 / color, 1.0);
}
```
![](/images/WebGL的shader编写/gif13.gif)

#### 基础噪音

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_nouse;

float nouse1d(float value) {
    return cos(value + cos(value * 90.0) * 100.0) * 0.5 + 0.5;
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    color.r += nouse1d(u_time);
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif14.gif)

#### 白噪音

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float random2d(vec2 coord) {
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    float grain = .0;
    grain = random2d(vec2(sin(coord))* u_time) ;
    color = vec3(grain);
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif15.gif)

#### 变换背景

- 在一些游戏中可以充当一个变换的背景

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.5 + 0.5 * cos(u_time + coord.xyx + vec3(0.0, 2.0, 4.0)));
    gl_FragColor = vec4(color, 1.0);
}
```
![](/images/WebGL的shader编写/gif16.gif)

#### 变换液体

- 在一些游戏中可以充当一个变换的背景

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float roundLookingBlob(vec2 fragCoord, vec2 tPos, float r) {
    vec2 pos = fragCoord.xy / u_resolution.yy - vec2(0.5);
    pos.x -= ((u_resolution.x- u_resolution.y) / u_resolution.y)/2.0;
    return pow(max(1.0-length(pos-tPos), 0.0) , r);
}

void main() {
	float v = 0.0 
        + roundLookingBlob(gl_FragCoord.xy * 0.2,vec2(sin(u_time)* 2.0, cos(u_time)*0.004), 10.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(sin(u_time*0.6)*0.2, cos(u_time)*0.3), 7.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(cos(u_time*0.8)*0.3, sin(u_time*1.1)*0.04), 5.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(cos(u_time*0.2)*0.2, sin(u_time*0.9)*0.05), 8.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(cos(u_time*1.2)*0.2, 2.0 *sin(u_time*0.9)*0.05), 8.0)
        + roundLookingBlob(gl_FragCoord.xy,vec2(cos(u_time*0.3)*0.4, sin(u_time*1.1)*0.4), 5.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(sin(u_time*0.6)*0.9, cos(u_time)*0.3), 7.0)
    	+ roundLookingBlob(gl_FragCoord.xy,vec2(sin(u_time*0.6)*0.3, cos(u_time)*0.8), 7.0)
        + roundLookingBlob(gl_FragCoord.xy,vec2(cos(u_time*0.3)*0.9, sin(u_time*0.1)*0.4), 3.0)
        ;
    v = clamp((v-0.5)*1000.0, 0.0, 1.0);
    float r = 
        -1.0 * 1.0 *sin(u_time) 
        - 2.0* cos(1.0 * u_time) * gl_FragCoord.x / u_resolution.x * gl_FragCoord.y / u_resolution.y;
    float g = 0.0 - 0.5 * cos(2.0 * u_time) *  gl_FragCoord.y / u_resolution.y;
    float b = 4.0 + sin(u_time) - g + 0.8;
	gl_FragColor = vec4(r * v, v * g, v * b, 1.0);
}
```
![](/images/WebGL的shader编写/gif17.gif)

#### 光影圆球

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec4 color = vec4(0);
    vec3 u = vec3(2. * gl_FragCoord.xy - u_resolution.xy, u_resolution.y) / 3e2;
    u = normalize(vec3(u.xy, sqrt(max(u.z * u.z - dot(u.xy, u.xy) * 2., 0.))));
    for(int i = 0; i < 2; i++) {
        float l = length(u);
        u.xz += sin(u.z + u_time * .2 + l);
        u.y += cos(u.x + u_time *.6);
        color += cos(l + vec4(.3, .1, 0,0));
    }
    gl_FragColor = vec4(color);
}
```
![](/images/WebGL的shader编写/gif18.gif)

#### 彩色格子

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec4 color = vec4(0);
    vec3 u = vec3(2. * gl_FragCoord.xy - u_resolution.xy, u_resolution.y) / 3e2;
    u = normalize(vec3(u.xy, sqrt(max(u.z * u.z - dot(u.xy, u.xy) * 2., 0.))));
    for(int i = 0; i < 2; i++) {
        float l = length(u);
        u.xz += sin(u.z + u_time * .2 + l);
        u.y += cos(u.x + u_time *.6);
        color += cos(l + vec4(.3, .1, 0,0));
    }
    gl_FragColor = vec4(color);
}
```
![](/images/WebGL的shader编写/gif19.gif)

#### 绿色细胞

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

vec2 N22(vec2 point) {
    vec3 a = fract(point.xyx * vec3(123.45, 234.34, 345.65));
    a += dot(a, a + 34.45);
    return fract(vec2(a.x * a.y, a.y * a.z));
}

void main() {
    // Zooms out so it goes from -1.0 to 1.0
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
    float m = 0.0;
    float time = u_time * 0.5;
    float cellIndex = 0.0;
    // Initialize minDist at a large distance
    float minDist = 100.0;
    
    vec3 color = vec3(0.0);
    
    // Multiply uv
    uv *= 2.0;

    // Make grid
    vec2 gridUv = fract(uv) - 0.5;

    // Determine grid cell
    vec2 id = floor(uv);

    vec2 cellId = vec2(0.0);

    for (float y = -1.0; y <= 1.0; y++) {
        for (float x = -1.0; x <= 1.0; x++) {
            vec2 offset = vec2(x, y);
            vec2 n = N22(vec2(id + offset));
            vec2 point = offset + sin(n * time) * 0.5 ;

            point -= gridUv;
            // Euclidian distance
            float eDist = length(point);

            // Manhattan distance
            float mDist = abs(point.x) + abs(point.y);

            // Interpolate between distances
            //float dist = mix(eDist, mDist, 0.5);
            float dist = eDist;

            if (dist < minDist) { 
                minDist = dist;
                cellId = id + offset;
            }
        }
        
        // Visualize gridUv
        //color.rb = gridUv;
        
        color = vec3(minDist);
        color.rb = cellId * 0.01;
        //color *= vec3(0.75, 0.3, 1.0);
    }
    
    //vec3 color = vec3(minDist);   
 	//vec3 color = vec3(cellIndex/50.0);   

    // Output to screen
    gl_FragColor = vec4(color,1.0);
}
```
![](/images/WebGL的shader编写/gif20.gif)

#### 萤火虫

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float rand( vec2 c )
{
	return fract( sin( dot( c.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float circle(vec2 pos, float radius, float glow){
    float sdf = length(pos);
    sdf = smoothstep(radius-0.700,radius,sdf);
    float circles = 1.0 - smoothstep(0.0,1.0,sdf*10.280);
    float glows = exp(-sdf*4.496) * glow * (1.0 - circles);
    return circles+glows;
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy ) / u_resolution.y;
    st *= 20.0;
    vec2 uv = st;
    float noisest = noise(vec2(uv.x - u_time, uv.y - u_time));
    uv += noisest*0.13;
    uv += vec2(noise(vec2(u_time) * 0.2) * 6.0, -u_time * 2.0);
    vec3 color = vec3(0.);
    vec2 pos = fract(uv)-0.5;
    vec2 id = floor(uv);
    for(int y = -1; y <= 1; y++){
        for(int x = -1; x <= 1; x++){
            vec2 neighbour = vec2(x,y);
            vec2 rand2 = rand2(id+neighbour);
            float a = noise(rand2 + u_time * 2.8);
            vec2 offset = 0.5*(sin(u_time + rand2*6.28))*2.2;
            float size = rand(id+neighbour)*0.75 + a*0.15;
            color += circle(pos-neighbour+offset,size,size*1.400)/9.0 * vec3(rand2.x*7.884,7.2,rand2.y*6.832);
        }
    }
    float xRange = 1.0 - abs(2.0 * st.x)*0.02;
    vec3 ambient = smoothstep(1.0,0.0,st.y*0.05+0.9) * vec3(0.401,0.570,0.443);
    color = max(ambient, color) * xRange;
    gl_FragColor = vec4(color,1.0);
}
```
![](/images/WebGL的shader编写/gif21.gif)

#### 液态光斑

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

const vec4 col1 = vec4(0.0,0.0,0.0,1.0);
const vec4 col2 = vec4(1.0,1.0,1.0,1.0);

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float s = sin(u_time*0.1);
    float s2 = .25+sin(u_time*1.8);
    vec2 d = uv*(4.0+s*.3);
    
    d.x += u_time*0.25+sin(d.y + u_time*0.3)*0.5;
    d.y += u_time*0.25+sin(d.x + u_time*0.3)*0.5;
    float v1=length(0.5-fract(d.yx))+0.95;
    
    float zoom = 0.42;
    d = (1.0+zoom)*0.5-(uv*zoom);
    float v2=length(0.5-fract(d.xy));
    v1 *= 1.0-v2*v1*1.64;
    v1 = v1*v1*v1;
    v1 *= 1.9+s2*0.2;
    gl_FragColor = mix(col2,col1,v1)*(10.+(s2*.2));
    vec3 _col = vec3(mod( uv.x + uv.y, .0)*0.002);
    gl_FragColor += vec4(_col, 1.);
}
```
![](/images/WebGL的shader编写/gif22.gif)

#### 三维线

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 R=u_resolution.xy,
    U=(gl_FragCoord.xy-.5*R.xy)/R.y;
    float D,t=u_time;
    vec3 P,B = normalize( vec3( U.x, U.y,1) );
    for(int i = 0; i<64;i++) {
        P = vec3(0, sin(U.x*5.+t), -5)+ B*D;
        P.z-=t*6.; 
        P=mod(P,3.)-1.5;
        P.z -= clamp( P.z, 0., 5. );
        D+=length(P) - .05;
    }
    float c = ((D< 16.) ? 1.:0.);
    gl_FragColor = vec4(c, c, .0, 1.0);
}
```
![](/images/WebGL的shader编写/gif23.gif)

### 图片Shader实例
#### 测试图片
![](/images/WebGL的shader编写/pic08.png)

#### 高斯模糊

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

float normpdf(in float x, in float sigma) {
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

vec3 gaussianBlur(sampler2D tex, vec2 coord, vec2 res, int amount) {
    //declare stuff
    const int mSize = 22;
    const int kSize = (mSize-1)/2;
    float kernel[mSize];
    vec3 final_colour = vec3(0.0);

    //create the 1-D kernel
    float sigma = 7.0;
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j) {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }

    for (int j = 0; j < mSize; ++j) {
        Z += kernel[j];
    }

    //read out the texels
    for (int i=-kSize; i <= kSize; ++i) {
        for (int j=-kSize; j <= kSize; ++j) {
            final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(u_tex0, (coord.xy+vec2(float(i),float(j))) / res.xy).rgb;

        }
    }
    return final_colour/(Z*Z);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
	vec4 c = texture2D(u_tex0, uv);
    gl_FragColor = vec4(gaussianBlur(u_tex0, gl_FragCoord.xy, u_resolution.xy, 11), c.a);
}
```
![](/images/WebGL的shader编写/pic20.jpg)

#### 噪点图片

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

float amount = 0.8;

float random2d(vec2 coord) {
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.0);
    vec4 image = texture2D(u_tex0, coord);
    float noise = (random2d(coord) - .5) * amount;
    image.r += noise;
    image.g += noise;
    image.b += noise;
    gl_FragColor = image;
}
```
![](/images/WebGL的shader编写/pic09.jpg)

#### 去色

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec4 texColor = texture2D(u_tex0, coord);
    vec3 lum = vec3(0.299, 0.587, 0.114);
    gl_FragColor = vec4(vec3(dot(texColor.rgb, lum)), texColor.a);
}
```
![](/images/WebGL的shader编写/pic11.jpg)

#### 图片混合流动

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 col = 0.5 + 0.5 * cos(u_time + coord.xyx + vec3(0, 2, 4));
    vec4 disp = texture2D(u_tex0, coord + vec2(u_time * 0.01, u_time * 0.02));
    float resx = u_resolution.x;
    float resy = u_resolution.y;
    vec2 center = (vec2(sin(u_time) * resx * 0.75 * 0.5, cos(u_time) * resy * 0.6 * 0.5) + 
                   vec2(sin(2.0*u_time) * resx * 0.25 * 0.5, cos(2.0*u_time) * resy * 0.4 * 0.5) +
                   vec2(resx * 0.5, resy * 0.5));
    float dist = length(gl_FragCoord.xy - center);
    float mag = exp(-dist * (0.01 + 0.005 * sin(u_time)));
    disp = disp * mag;
    vec4 image = texture2D(u_tex1, coord);
    vec4 col2 = texture2D(u_tex1, coord + disp.rg * 0.2);
    gl_FragColor = vec4(col2.xyz, image.a);

}

```
![](/images/WebGL的shader编写/gif25.gif)


#### 马赛克

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

const vec2 pixelSize = vec2(5.0);

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 c;
    vec4 src = texture2D(u_tex0, coord);
	vec3 sum;
    for(int a=0;a<int(pixelSize.x);a++) {
        for(int b=0;b<int(pixelSize.y);b++) {
            c = texture2D(u_tex0, (gl_FragCoord.xy-mod(gl_FragCoord.xy, pixelSize) + vec2(a,b)) / u_resolution.xy).rgb;
            sum += c;
        }
    }
    sum /= pixelSize.x * pixelSize.y;
    gl_FragColor = vec4(sum, src.a);
}
```
![](/images/WebGL的shader编写/pic13.jpg)

#### 【抖音】特效1

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

const float PI = 3.1415926;
const float duration = 2.0;

vec4 getMask(float time, vec2 textureCoords, float padding) {
    vec2 translation = vec2(sin(time * (PI * 2.0 / duration)),
                            cos(time * (PI * 2.0 / duration)));
    vec2 translationTextureCoords = textureCoords + padding * translation;
    vec4 mask = texture2D(u_tex0, translationTextureCoords);

    return mask;
}

float maskAlphaProgress(float currentTime, float hideTime, float startTime) {
    float time = mod(duration + currentTime - startTime, duration);
    return min(time, hideTime);
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    float time = mod(u_time, duration);
    float scale = 1.1;
    float padding = 0.3 * (1.0 - 1.0 / scale);
    vec2 textureCoords = vec2(0.5, 0.5) + (coord - vec2(0.5, 0.5)) / scale;

    float hideTime = 0.9;
    float timeGap = 0.12;

    float maxAlphaR = 0.4; // max R
    float maxAlphaG = 0.01; // max G
    float maxAlphaB = 0.02; // max B

    vec4 mask = getMask(time, textureCoords, padding);
    float alphaR = 1.0; // R
    float alphaG = 1.0; // G
    float alphaB = 1.0; // B

    vec4 resultMask;

    for (float f = 0.0; f < duration; f += timeGap) {
        float tmpTime = f;
        vec4 tmpMask = getMask(tmpTime, textureCoords, padding);
        float tmpAlphaR = maxAlphaR - maxAlphaR * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;
        float tmpAlphaG = maxAlphaG - maxAlphaG * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;
        float tmpAlphaB = maxAlphaB - maxAlphaB * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;

        resultMask += vec4(tmpMask.r * tmpAlphaR,
                           tmpMask.g * tmpAlphaG,
                           tmpMask.b * tmpAlphaB,
                        1.0);
        alphaR -= tmpAlphaR;
        alphaG -= tmpAlphaG;
        alphaB -= tmpAlphaB;
    }
    resultMask += vec4(mask.r * alphaR, mask.g * alphaG, mask.b * alphaB, 1.0);
    gl_FragColor = resultMask;
}
```
![](/images/WebGL的shader编写/pic14.jpg)

#### 【抖音】特效2

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

float duration = 1.2;
float maxAlpha = 0.6;
float maxScale = 1.5;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec4 color = vec4(.0);
    float progress = mod(u_time, duration) / duration;
    float alpha = maxAlpha * (1.0 - progress);
    float scale = 1.0 + (maxScale - 1.0) * progress;
    float weakX = 0.5 + (coord.x - 0.5) / scale;
    float weakY = 0.5 + (coord.y - 0.5) / scale;
    vec2 weakTextureCoords = vec2(weakX, weakY);
    vec4 weakImage = texture2D(u_tex0, weakTextureCoords);
    vec4 maskImage = texture2D(u_tex0, coord);
    gl_FragColor = maskImage * (1.0 - alpha) + weakImage * alpha;
}
```
![](/images/WebGL的shader编写/pic15.jpg)

#### 【抖音】特效3

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

float duration = 0.65;
float maxScale = 1.2;
float offset = 0.025;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec4 color = vec4(.0);
    float progress = mod(u_time, duration) / duration;
    vec2 offsetCoord = vec2(offset) * progress;
    float scale = 1.0 + (maxScale - 1.0) * progress;
    vec2 scaleTextureCoords = vec2(0.5, 0.5) + (coord - vec2(0.5, 0.5)) / scale;
    vec4 maskR = texture2D(u_tex0, scaleTextureCoords + offsetCoord);
    vec4 maskB = texture2D(u_tex0, scaleTextureCoords - offsetCoord);
    vec4 mask = texture2D(u_tex0, scaleTextureCoords);
    gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
}
```
![](/images/WebGL的shader编写/pic16.jpg)

#### 【抖音】特效4

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

const float PI = 3.1415926;
const float maxJitter = 0.06;
const float duration = 0.3;
const float colorROffset = 0.01;
const float colorBOffset = -0.025;

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    float time = mod(u_time, duration * 2.0);
    float amplitude = max(sin(time * (PI / duration)), 0.0);

    float jitter = rand(coord.y) * 2.0 - 1.0; // -1~1
    bool needOffset = abs(jitter) < maxJitter * amplitude;

    float textureX = coord.x + (needOffset ? jitter : (jitter * amplitude * 0.006));
    vec2 textureCoords = vec2(textureX, coord.y);

    vec4 mask = texture2D(u_tex0, textureCoords);
    vec4 maskR = texture2D(u_tex0, textureCoords + vec2(colorROffset * amplitude, 0.0));
    vec4 maskB = texture2D(u_tex0, textureCoords + vec2(colorBOffset * amplitude, 0.0));

    gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
}
```
![](/images/WebGL的shader编写/pic17.jpg)

#### 浮雕

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_resolution;
uniform vec2 u_tex0Resolution;
uniform float u_time;

const float dir = 60.; 
const float dist = 0.006; 
const float strength = 2.;
const float invert = 1.; //0, 1
const float BnW = 1.; //Black and white? 0, 1

void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 image = texture2D(u_tex0, uv);
    vec4 color = vec4(0.);
    if (invert < 1.) {
	    color = vec4(0.5 + ((texture2D(u_tex0, uv).rgb - texture2D(u_tex0, uv + (vec2(cos(radians(dir)), sin(radians(dir))) * dist)).rgb) * strength), 1.0);
    } else {
        color = vec4(0.5 + ((texture2D(u_tex0, uv + (vec2(cos(radians(dir)), sin(radians(dir))) * dist)).rgb - texture2D(u_tex0, uv).rgb) * strength), 1.0);    
    }
    if (BnW >= 1.) { 
        color = vec4((color.r + color.g + color.b) / vec3(3.), color.a);
    }
    gl_FragColor = color;
}
```
![](/images/WebGL的shader编写/pic19.jpg)

#### 描边

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

const float outlineSize = 3.0;
const vec3 outlineColor = vec3(1.0, 0.0, 0.298);
const vec3 foregroundColor = vec3(1.0, 1.0, 1.0);

// 判断在这个角度上距离为outlineSize那一点是不是透明  
int getIsStrokeWithAngel(float angel) {  
    vec2 coord = gl_FragCoord.xy / u_resolution;
    int stroke = 0;  
    float rad = angel * 0.01745329252; // 这个浮点数是 pi / 180，角度转弧度  
    float a = texture2D(u_tex0, vec2(coord.x + outlineSize * cos(rad) / u_resolution.x, coord.y + outlineSize * sin(rad) / u_resolution.y)).a; // 这句比较难懂，outlineSize * cos(rad)可以理解为在x轴上投影，除以textureSize.x是因为texture2D接收的是一个0~1的纹理坐标，而不是像素坐标  
    if (a >= 0.5)// 我把alpha值大于0.5都视为不透明，小于0.5都视为透明  
    {  
        stroke = 1;  
    }  
    return stroke;  
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec4 myC = texture2D(u_tex0, vec2(coord.x, coord.y)); // 正在处理的这个像素点的颜色  
    myC.rgb *= foregroundColor;  
    if (myC.a >= 0.5) {  
        gl_FragColor = myC;
        return;
    }
    int strokeCount = 0;  
    strokeCount += getIsStrokeWithAngel(0.0);  
    strokeCount += getIsStrokeWithAngel(30.0);  
    strokeCount += getIsStrokeWithAngel(60.0);  
    strokeCount += getIsStrokeWithAngel(90.0);  
    strokeCount += getIsStrokeWithAngel(120.0);  
    strokeCount += getIsStrokeWithAngel(150.0);  
    strokeCount += getIsStrokeWithAngel(180.0);  
    strokeCount += getIsStrokeWithAngel(210.0);  
    strokeCount += getIsStrokeWithAngel(240.0);  
    strokeCount += getIsStrokeWithAngel(270.0);  
    strokeCount += getIsStrokeWithAngel(300.0);  
    strokeCount += getIsStrokeWithAngel(330.0);  
    if (strokeCount > 0) // 四周围至少有一个点是不透明的，这个点要设成描边颜色  
    {  
        myC.rgb = outlineColor;
        // myC.r = sin(u_time / 5.0 + cos(u_time * 3.0));
        // myC.g = cos(u_time / 3.0 + sin(u_time * 5.0));
        myC.a = 1.0;  
    }  
    gl_FragColor = myC;
}
```
![](/images/WebGL的shader编写/pic12.jpg)

#### 卡通效果

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_resolution;
uniform float u_time;

#define GAMMA 1.0
#define RATE 6.0
#define POWER 6.0
#define EPSILON 1e-9
#define T(d) pow(texture2D(u_tex0, fract(d)),vec4(GAMMA))

bool reset() {
    return texture2D(u_tex0, vec2(32.5/256.0, 0.5) ).x > 0.5;
}

void main() {
    const float _K0 = -20.0/6.0; // center weight
    const float _K1 = 4.0/6.0;   // edge-neighbors
    const float _K2 = 1.0/6.0;   // vertex-neighbors
    
    vec2 vUv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1. / u_resolution.xy;
    
    // 3x3 neighborhood coordinates
    float step_x = texel.x;
    float step_y = texel.y;
    vec2 n  = vec2(0.0, step_y);
    vec2 ne = vec2(step_x, step_y);
    vec2 e  = vec2(step_x, 0.0);
    vec2 se = vec2(step_x, -step_y);
    vec2 s  = vec2(0.0, -step_y);
    vec2 sw = vec2(-step_x, -step_y);
    vec2 w  = vec2(-step_x, 0.0);
    vec2 nw = vec2(-step_x, step_y);
    vec4 u = T(vUv);
    
    vec4 u_nb[8];
    u_nb[0] = T(vUv+n);
    u_nb[1] = T(vUv+e);
    u_nb[2] = T(vUv+s);
    u_nb[3] = T(vUv+w);
    u_nb[4] = T(vUv+nw);
    u_nb[5] = T(vUv+sw);
    u_nb[6] = T(vUv+ne);
    u_nb[7] = T(vUv+se);
    float k[8];
    k[0] = _K1;
    k[1] = _K1;
    k[2] = _K1;
    k[3] = _K1;
    k[4] = _K2;
    k[5] = _K2;
    k[6] = _K2;
    k[7] = _K2;
    vec4 m[8];
    vec4 sum = vec4(0);
    for (int i = 0; i < 8; i++) {
        vec4 f = k[i] / (EPSILON + pow(abs(u_nb[i] - u), vec4(POWER))); 
    	m[i] = f;
        sum += f;
    }
    
    vec4 lapl = vec4(0);
    for (int i = 0; i < 8; i++) {
    	lapl += m[i] * u_nb[i] / sum;
    }
    
    lapl -= u;
    gl_FragColor = pow(vec4(u + RATE*lapl),vec4(1.0/GAMMA));
}
```
![](/images/WebGL的shader编写/pic18.jpg)


#### UV动画

```cpp
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

vec4 tint = vec4(1.0, 1.0, 1.0, 1.0);
int tileX = 4;
int tileY = 4;
float speed = 30.0;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float gridIndex = mod(u_time * speed, float(tileX * tileY));
    int indexY = int(gridIndex) / tileX;
    int indexX = int(gridIndex) - tileX * indexY;
    uv = vec2((uv.x + float(indexX)) / float(tileX), (uv.y + float(indexY)) / float(tileY));
    vec4 image = texture2D(u_tex0, uv);
    gl_FragColor = image * tint;
}
```
![](/images/WebGL的shader编写/gif26.gif)

