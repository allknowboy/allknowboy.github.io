---
title: Golang编译wasm
tags:
  - Golang
  - wasm
categories: 编程语言
abbrlink: ca453128
date: 2020-11-17 19:24:12
---

### 使用Go

#### 创建main.go文件

- main.go

```
package main

import ("fmt")

func main() {
	fmt.Println("Hello, Go WebAssembly!")
}
```

#### 编译go文件，得到lib.wasm文件

```
set GOOS=js
echo %GOOS%
set GOARCH=wasm
echo %GOARCH%
go build -o lib.wasm main.go
pause
```

#### 获取wasm_exec.js

[https://github.com/golang/go/blob/master/misc/wasm/wasm_exec.js](https://github.com/golang/go/blob/master/misc/wasm/wasm_exec.js)


#### 新建一个index.html文件

- index.html

```
<!doctype html>
<!--
Copyright 2018 The Go Authors. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
-->
<html>

<head>
	<meta charset="utf-8">
	<title>Go wasm</title>
</head>

<body>
	<!--
	Add the following polyfill for Microsoft Edge 17/18 support:
	<script src="https://cdn.jsdelivr.net/npm/text-encoding@0.7.0/lib/encoding.min.js"></script>
	(see https://caniuse.com/#feat=textencoder)
	-->
	<script src="wasm_exec.js"></script>
	<script>
		if (!WebAssembly.instantiateStreaming) { // polyfill
			WebAssembly.instantiateStreaming = async (resp, importObject) =- {
				const source = await (await resp).arrayBuffer();
				return await WebAssembly.instantiate(source, importObject);
			};
		}

        const go = new Go();
        console.log(go.importObject);
		console.log(WebAssembly);
		go.importObject.env = go.importObject.env || {};
		go.importObject.env['command-line-arguments.add'] = function(x, y) {
        	return x + y
		};

		let mod, inst;
		WebAssembly.instantiateStreaming(fetch("lib.wasm"), go.importObject).then((result) =- {
			mod = result.module;
			inst = result.instance;
			document.getElementById("runButton").disabled = false;
		}).catch((err) =- {
			console.error(err);
		});

		async function run() {
			console.clear();
			await go.run(inst);
			inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
        }
        
	</script>

	<button onClick="run();" id="runButton" disabled>Run</button>
</body>

</html>
```

#### 需要go服务器支持wasm的meta类型

- server.go

```
package main

import (
	"flag"
	"log"
	"net/http"
)

var (
	listen = flag.String("listen", ":8080", "listen address")
	dir    = flag.String("dir", ".", "directory to serve")
)

func main() {
	flag.Parse()
	log.Printf("listening on %q...", *listen)
	err := http.ListenAndServe(*listen, http.FileServer(http.Dir(*dir)))
	log.Fatalln(err)
}
```

#### 启动服务器

```
go run server.go
```



### 使用Tinygo

#### 创建main.go文件

- main.go

```
package main

func main() {
    println("Hello, tinygo wsam!!!")
    println("adding two numbers:", add(2, 3)) // expecting 5
}

func add(x, y int) int

func multiply(x, y int) int {
    return x * y;
}
```

#### 编译go文件，得到lib.wasm文件

```
tinygo build -o lib.wasm -target wasm ./main.go
pause
```

#### 获取wasm_exec.js

[https://github.com/tinygo-org/tinygo/blob/release/targets/wasm_exec.js](https://github.com/tinygo-org/tinygo/blob/release/targets/wasm_exec.js)

#### 新建一个index.html文件

- index.html

```
<!doctype html>
<!--
Copyright 2018 The Go Authors. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
-->
<html>

<head>
	<meta charset="utf-8">
	<title>Go wasm</title>
</head>

<body>
	<!--
	Add the following polyfill for Microsoft Edge 17/18 support:
	<script src="https://cdn.jsdelivr.net/npm/text-encoding@0.7.0/lib/encoding.min.js"></script>
	(see https://caniuse.com/#feat=textencoder)
	-->
	<script src="wasm_exec.js"></script>
	<script>
        const go = new Go();
		const WASM_URL = 'lib.wasm';
		go.importObject.env = go.importObject.env || {};
		go.importObject.env['command-line-arguments.add'] = function(x, y) {
        	return x + y
		};
		console.log(go.importObject);
		var wasm;
		if ('instantiateStreaming' in WebAssembly) {
			WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
				wasm = obj.instance;
				go.run(wasm);
				console.log('multiplied two numbers:', wasm.exports.multiply(5, 3));
			})
		} else {
			fetch(WASM_URL).then(resp =>
				resp.arrayBuffer()
			).then(bytes =>
				WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
					wasm = obj.instance;
					go.run(wasm);
					console.log('multiplied two numbers:', wasm.exports.multiply(5, 3));
				})
			)
		}
		
	</script>
</body>

</html>
```

#### 需要go服务器支持wasm的meta类型

- server.go

```
package main

import (
	"flag"
	"log"
	"net/http"
)

var (
	listen = flag.String("listen", ":8080", "listen address")
	dir    = flag.String("dir", ".", "directory to serve")
)

func main() {
	flag.Parse()
	log.Printf("listening on %q...", *listen)
	err := http.ListenAndServe(*listen, http.FileServer(http.Dir(*dir)))
	log.Fatalln(err)
}
```

#### 启动服务器

```
go run server.go
```