---
title: 游戏引擎渲染基础之WebGl
tags:
  - JavaScript
  - WebGl
  - parcel
categories: 游戏编程
abbrlink: 2cdc85be
date: 2019-06-10 21:41:34
---

### 使用TS开发环境搭建

- parcel网址

[https://parceljs.org/](https://parceljs.org/)

- 安装命令

```bash
npm install -g parcel-bundler
```

- 新建一个index.html文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <canvas id="webgl" width="400" height="400"></canvas>
    <script src="./main.ts"></script>
</body>
</html>
```

- 同目录下新建一个main.ts的文件

```ts
console.log('hello ts')
```

- 构建环境

```bash
parcel index.html
```

- 打开网址

[http://localhost:1234/](http://localhost:1234/)

在console里面可以看到打印的"hello ts", 接下来可以使用ts进行web的开发

- 源码地址

[https://gitee.com/limo/basic_webgl/tree/master/basic01](https://gitee.com/limo/basic_webgl/tree/master/basic01)

### 显示一个webgl的黑色屏幕

- 工具方法用于不同浏览器获取WebGl的句柄

```ts
/**
 * 获取当前的webgl句柄
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGLRenderingContext}
 */
function getWebGLContext(canvas: HTMLCanvasElement) : WebGLRenderingContext {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl
}
```

- 渲染的方法

```ts
/**
 * 渲染的方法
 *
 */
function render() {
    // 清除颜色
    gl.clearColor(0, 0, 0, 1)
    // 使用深度测试
    gl.enable(gl.DEPTH_TEST)
    // 清除模式
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT)
    // 启动混合模式(后面图片会用到)
    gl.enable(gl.BLEND);
    // 设置混合模式
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // 设置视界
    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // 动画帧方法(多次调用)
    requestAnimationFrame(render)
}
```

- 当前的源码

```ts
// 当前的gl句柄
let gl: WebGLRenderingContext = null
let CANVAS_WIDTH: number = 0
let CANVAS_HEIGHT: number = 0

function main() {
    let canvas: HTMLCanvasElement = document.getElementById("webgl") as HTMLCanvasElement
    CANVAS_WIDTH = canvas.width
    CANVAS_HEIGHT = canvas.height
    gl = getWebGLContext(canvas)
    // 调用渲染
    render()
}

main()

/**
 * 渲染的方法
 *
 */
function render() {
    // 清除颜色
    gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // 设置视界
    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // gl.drawArrays(gl.TRIANGLES, 0, count)
    requestAnimationFrame(render)
}

/**
 * 获取当前的webgl句柄
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGLRenderingContext}
 */
function getWebGLContext(canvas: HTMLCanvasElement) : WebGLRenderingContext {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl
}

```

- 显示的内容

![](/images/basicwebgl/basicwebgl01.png)


- 源码地址

[https://gitee.com/limo/basic_webgl/tree/master/basic02](https://gitee.com/limo/basic_webgl/tree/master/basic02)

### 画一个三角形

#### 创建shader，顶点着色器和片面着色器

- 创建并编译shader的工具方法

```ts
/**
 * 创建shader程序的方法
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    // 通过类型创建着色器对象
    const shader = gl.createShader(type)
    // 将着色器代码装载到着色器对象内
    gl.shaderSource(shader, source)
    // 编译着色器
    gl.compileShader(shader)
    // 检测着色器的编译情况
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if(!compiled){
        // 获取当前的错误数据
        const err = gl.getShaderInfoLog(shader)
        console.error('Failed to compile shader: ' + err)
        // 删除着色器
        gl.deleteShader(shader)
        return null
    }
    return shader
}
```

- 基础的GLSL源码

```ts
// 顶点着色器的源码
const V_SHADER_SOURCE: string =`
attribute vec3 a_Position;
attribute vec3 a_Color;
varying vec3 v_Color;
void main() {
    gl_Position = vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);
    v_Color = a_Color;
}`

// 片段着色器
const F_SHADER_SOURCE: string =`
precision mediump float;
varying vec3 v_Color;
void main() {
    gl_FragColor = vec4(v_Color.r, v_Color.g, v_Color.b, 1.0);;
}`
```

#### 创建Program 着色器程序

```ts
/**
 * 创建着色程序
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vShaderSrc
 * @param {string} fShaderSrc
 * @returns {WebGLProgram}
 */
function createProgram(gl: WebGLRenderingContext, vShaderSrc?: string, fShaderSrc?: string) : WebGLProgram {
    // 加载顶点和片段着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc || V_SHADER_SOURCE)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc || F_SHADER_SOURCE)
    // 创建着色程序
    const program = gl.createProgram()
    // 将编译过的着色器附加到着色程序上
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    // 链接着色程序
    gl.linkProgram(program)
    // 使用着色程序
    gl.useProgram(program)
    return program
}
```

#### 初始化顶点数据和颜色数据的buffer

- 初始化顶点和颜色

```ts
/**
 * 初始化数据
 *
 * @param {WebGLRenderingContext} gl
 */
function initBuffer(gl: WebGLRenderingContext) {
    // 定义顶点数据
    const vertices = new Float32Array([
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
    ])
    // 写入顶点
    const vertexBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false,0, 0);
    gl.enableVertexAttribArray(a_Position);

    // 定义颜色数据
    const colors = new Float32Array([
        1.0, 0, 0,
        1.0, 0, 0,
        1.0, 0, 0,
    ])
    // 写入颜色
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    count = vertices.length / 3
    console.log(count)
}
```

- 画出缓存的方法 渲染的模式为三角形
- count表示为顶点的数量(3个一组为顶点)

```ts
gl.drawArrays(gl.TRIANGLES, 0, count)
```

- 当前的源码

```ts
console.log('hello ts')

// 顶点着色器的源码
const V_SHADER_SOURCE: string =`
attribute vec3 a_Position;
attribute vec3 a_Color;
varying vec3 v_Color;
void main() {
    gl_Position = vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);
    v_Color = a_Color;
}`

// 片段着色器
const F_SHADER_SOURCE: string =`
precision mediump float;
varying vec3 v_Color;
void main() {
    gl_FragColor = vec4(v_Color.r, v_Color.g, v_Color.b, 1.0);;
}`



// 当前的gl句柄
let gl: WebGLRenderingContext = null
let program: WebGLProgram = null
let CANVAS_WIDTH: number = 0
let CANVAS_HEIGHT: number = 0
let count = 0

/**
 * 初始化数据
 *
 * @param {WebGLRenderingContext} gl
 */
function initBuffer(gl: WebGLRenderingContext) {
    // 定义顶点数据
    const vertices = new Float32Array([
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
    ])
    // 写入顶点
    const vertexBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false,0, 0);
    gl.enableVertexAttribArray(a_Position);

    // 定义颜色数据
    const colors = new Float32Array([
        1.0, 0, 0,
        1.0, 0, 0,
        1.0, 0, 0,
    ])
    // 写入颜色
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    count = vertices.length / 3
    console.log(count)
}

function main() {
    let canvas: HTMLCanvasElement = document.getElementById("webgl") as HTMLCanvasElement
    CANVAS_WIDTH = canvas.width
    CANVAS_HEIGHT = canvas.height
    gl = getWebGLContext(canvas)
    program = createProgram(gl)
    initBuffer(gl)
    // 调用渲染
    render()
}

main()

/**
 * 渲染的方法
 *
 */
function render() {
    // 清除颜色
    gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // 设置视界
    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
    requestAnimationFrame(render)
}

/********* 工具方法 ***********/

/**
 * 获取当前的webgl句柄
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGLRenderingContext}
 */
function getWebGLContext(canvas: HTMLCanvasElement) : WebGLRenderingContext {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl
}

/**
 * 创建shader程序的方法
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    // 通过类型创建着色器对象
    const shader = gl.createShader(type)
    // 将着色器代码装载到着色器对象内
    gl.shaderSource(shader, source)
    // 编译着色器
    gl.compileShader(shader)
    // 检测着色器的编译情况
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if(!compiled){
        // 获取当前的错误数据
        const err = gl.getShaderInfoLog(shader)
        console.error('Failed to compile shader: ' + err)
        // 删除着色器
        gl.deleteShader(shader)
        return null
    }
    return shader
}

/**
 * 创建着色程序
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vShaderSrc
 * @param {string} fShaderSrc
 * @returns {WebGLProgram}
 */
function createProgram(gl: WebGLRenderingContext, vShaderSrc?: string, fShaderSrc?: string) : WebGLProgram {
    // 加载顶点和片段着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vShaderSrc || V_SHADER_SOURCE)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc || F_SHADER_SOURCE)
    // 创建着色程序
    const program = gl.createProgram()
    // 将编译过的着色器附加到着色程序上
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    // 链接着色程序
    gl.linkProgram(program)
    // 使用着色程序
    gl.useProgram(program)
    return program
}

```

- 显示的内容

![](/images/basicwebgl/basicwebgl02.png)

#### 修改顶点颜色

**渲染的颜色为RGB值，3个一组，表示3个顶点的颜色，每个顶点需要单独设置颜色**

```ts
  // 定义颜色数据
  const colors = new Float32Array([
      1.0, 0, 0,
      0, 1.0, 0,
      0, 0, 1.0,
  ])
```

- 显示的内容

![](/images/basicwebgl/basicwebgl03.png)

### 画出一个矩形

#### 使用两个三角形拼成一个矩形

```ts
  // 定义顶点数据
  const vertices = new Float32Array([
      -0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
  ])
  // 定义颜色数据
  const colors = new Float32Array([
      1.0, 0, 0,
      1.0, 0, 0,
      1.0, 0, 0,
      1.0, 0, 0,
      1.0, 0, 0,
      1.0, 0, 0,
  ])
```

- 显示的内容

![](/images/basicwebgl/basicwebgl04.png)


#### 矩形的构造方式

- 顶点使用逆时针方式排序
- 由两个三角形拼凑而成
- x0 -> x1 -> x2
- y0 -> y1 -> y2
- 每个顶点对应一个颜色

![](/images/basicwebgl/basicwebgl05.png)

#### 使用TRIANGLE_STRIP方式构造三角形带

- 使用共用顶点的方式构造多个三角形
- 第二个三角形可以使用第一个三角形的两个顶点
- 使用此方式可以减少顶点的数据量
- 但是因为共用顶点，所以顶点颜色也是共用的，只能设置4个顶点颜色，适合创建单身模型

```ts
  const vertices = new Float32Array([
      -0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,
      // 0.5, 0.5, 0.5,
      // -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
  ])

    // 定义颜色数据
  const colors = new Float32Array([
      1.0, 1.0, 0,
      1.0, 1.0, 0,
      1.0, 1.0, 0,
      1.0, 1.0, 0,
  ])
```

![](/images/basicwebgl/basicwebgl06.png)


- 源码地址

[https://gitee.com/limo/basic_webgl/tree/master/basic03](https://gitee.com/limo/basic_webgl/tree/master/basic03)

### 贴图渲染

- 贴图渲染的GLSL源码

```ts
// 带图片的顶点着色器的源码
const V_IMAGE_SHADER_SOURCE: string =`
attribute vec2 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = vec4(a_Position.x, a_Position.y, 0.5, 1.0);
    v_TexCoord = a_TexCoord;
}`

// 带图片的片段着色器
const F_IMAGE_SHADER_SOURCE: string =`
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    vec4 c = texture2D(u_Sampler,v_TexCoord);
    gl_FragColor = c;
}`
```

- 初始化顶点和uv缓存数据

```ts
/**
 * 初始化带图片的buffer
 *
 * @param {WebGLRenderingContext} gl
 */
function initBufferWithImage(gl: WebGLRenderingContext) {
    // 定义顶点数据
    const vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ])
    // 写入顶点
    const vertexBuffer =  gl.createBuffer()
    // 获取当前数据的比特长度
    const bSize = vertices.BYTES_PER_ELEMENT
    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 写入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    // 获得着色程序中的参数的数据位置seek
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, bSize * 4, 0)
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, bSize * 4, bSize * 2)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(a_TexCoord)

    count = vertices.length / 4
    console.log(count)
}
```

- 初始化纹理加载(使用image加载图片)

```ts
/**
 * 初始化纹理资源
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 */
function initTextures(gl: WebGLRenderingContext, program: WebGLProgram) {
    const texture = gl.createTexture()
    const u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
    const image = new Image()
    image.src = "./head.jpeg"
    image.onload = () => {
        // 对图形进行Y轴的反转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
        // 开启0号纹理单元
        gl.activeTexture(gl.TEXTURE0)
        // 绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // 配置纹理参数 可以不用使用2的N次幂
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        // 配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
        // 将0号纹理传递给着色器
        gl.uniform1i(u_Sampler, 0)
        render()
    }
}
```

- 修改main的方法

```ts
function main() {
    let canvas: HTMLCanvasElement = document.getElementById("webgl") as HTMLCanvasElement
    CANVAS_WIDTH = canvas.width
    CANVAS_HEIGHT = canvas.height
    gl = getWebGLContext(canvas)
    program = createProgram(gl, V_IMAGE_SHADER_SOURCE, F_IMAGE_SHADER_SOURCE)
    initBufferWithImage(gl)
    initTextures(gl, program)
}
```

![](/images/basicwebgl/basicwebgl07.png)

- 源码地址

[https://gitee.com/limo/basic_webgl/tree/master/basic04](https://gitee.com/limo/basic_webgl/tree/master/basic04)