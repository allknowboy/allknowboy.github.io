---
title: C++与lua的交互
tags:
  - c++
  - lua
  - sol
categories:
  - 游戏编程
abbrlink: 9d45694a
date: 2020-12-23 20:40:33
---

```blockquote 佚名
   **所有那些太美的、太好的、太深刻的、太慎重的、太重大的东西，总让人下意识地想去躲避。**
```

### Lua

#### 介绍
![](/images/C++与lua的交互/lua.jpg)
Lua 是一种轻量小巧的脚本语言，常与c++/c配合进行游戏的开发。对于一些需要动态实现的部分，可以说十分胜任。

#### 下载
- 在官网上可以下载到最新版本的lua
- 直接下载最新版本的源码即可
[https://www.lua.org/download.html](https://www.lua.org/download.html)

#### 编译源码

- 将源码包src下的源文件导入到vs工程下
- 注意需要去除【lua.c】【luac.c】两个文件，不然无法编译通过

![](/images/C++与lua的交互/pic2.jpg)

#### 编写测试

- test.lua
- 在lua中定义内容，在c++中获取

```lua
str = "I am so cool"
tbl = {name = "shun", id = 20114442}
function add(a,b)
	return a + b
end
```

- main.cpp
- 创建可运行的lua虚拟栈

```cpp
#include <iostream>
#include <string.h-  
#include <cassert>
#include <lua.hpp>

using namespace std;

int main()
{
    //1.创建Lua状态  
    lua_State* L = luaL_newstate();
    if (L == NULL)
    {
        cout << "state is null\n";
        return 0;
    }
    //2.加载lua文件 
    int bRet = luaL_loadfile(L, "test.lua");
    if (bRet) {
        cout << "load file error" << endl;
        return 0;
    }
    //3.运行Lua文件
    bRet = lua_pcall(L, 0, 0, 0);
    if (bRet) {
        cout << "pcall error" << endl;
        return 0;
    }
    //4.读取变量
    lua_getglobal(L, "str");
    string str = lua_tostring(L, -1);
    cout << "str = " << str.c_str() << endl;
    //5.读取table
    lua_getglobal(L, "tbl");
    lua_getfield(L, -1, "name");
    str = lua_tostring(L, -1);
    cout << "tbl:name = " << str.c_str() << endl;
    //6.读取函数  
    lua_getglobal(L, "add");        // 获取函数，压入栈中  
    lua_pushnumber(L, 10);          // 压入第一个参数  
    lua_pushnumber(L, 20);          // 压入第二个参数  
    int iRet = lua_pcall(L, 2, 1, 0);// 调用函数，调用完成以后，会将返回值压入栈中，2表示参数个数，1表示返回结果个数。  
    if (iRet)                       // 调用出错  
    {
        const char* pErrorMsg = lua_tostring(L, -1);
        cout << pErrorMsg << endl;
        lua_close(L);
        return 0;
    }
    if (lua_isnumber(L, -1))        //取值输出  
    {
        double fValue = lua_tonumber(L, -1);
        cout << "Result is " << fValue << endl;
    }
    //7关闭state
    lua_close(L);
    return 0;
}
```

#### 执行结果

- lua文件内定义变量和函数被顺利取出
- 当前已经具备了执行lua的环境
- **但是这样的操作台过麻烦，每次倒要去做出栈和压栈操作，还要知道数据栈的位置**

![](/images/C++与lua的交互/base1.jpg)

### SOL

#### 介绍
![](/images/C++与lua的交互/sol.jpg)
当前的方式使用lua还是比较的麻烦，我们需要借助于一个框架实现lua与c++的绑定。

#### 下载
- 下载源码即可
[https://github.com/ThePhD/sol2/releases](https://github.com/ThePhD/sol2/releases)

#### 打包单一头文件
- 运行源码 single文件夹下的single.py脚本
- 可以得到单一的头文件
- **导入项目即可**

![](/images/C++与lua的交互/pic1.jpg)

### C++与Lua

#### 编写一个主入口类

- GameMain.h
- 作为当前主程序的入口，用于初始化lua运行时和绑定
- printNum为需要在lua中调用的函数

```cpp
#pragma once
#include <iostream>

namespace LuaScripting
{
	class LuaRuntime;
}

using namespace std;

class GameMain
{
private:
	LuaScripting::LuaRuntime* m_luaRuntime;
public:
	void init();
	bool printNum(int num);
	LuaScripting::LuaRuntime* getLuaRuntime();
};
```

- GameMain.cpp

```cpp
#include "GameMain.h"
#include "LuaRuntime.h"

void GameMain::init()
{
	m_luaRuntime = new LuaScripting::LuaRuntime();
	m_luaRuntime->init(this);
}

bool GameMain::printNum(int num)
{
	cout << "num:" << num << endl;
	return false;
}

LuaScripting::LuaRuntime* GameMain::getLuaRuntime()
{
	return m_luaRuntime;
}

```

#### 编写一个lua运行时类

- LuaRuntime.h

```cpp
#pragma once
#include <sol/sol.hpp>
class GameMain;

namespace LuaScripting
{
	class LuaRuntime
	{
		public:
			LuaRuntime();
			~LuaRuntime();
			bool init(GameMain* main);
			void cleanup();
			sol::state* getLuaState();
		private:
			sol::state* m_state;
	};

}
```

- LuaRuntime.cpp
- 在init的时候初始化sol
  - 打开需要用到的标准库
  - 注册绑定C++函数
  - 注册全局变量
- 在初始化和启动的时候调用对应的lua文件

```cpp
#include "LuaRuntime.h"
#include "LuaAPI.h"
#include "GameMain.h"

namespace LuaScripting
{

	LuaRuntime::LuaRuntime()
	{
		m_state = NULL;
	}

	LuaRuntime::~LuaRuntime()
	{
		delete m_state;
	}

	bool LuaRuntime::init(GameMain* main)
	{
		m_state = new sol::state();

		// 打开标准库
		m_state->open_libraries(
			sol::lib::base,
			sol::lib::package,
			sol::lib::coroutine,
			sol::lib::string,
			sol::lib::table,
			sol::lib::math,
			sol::lib::io,
			sol::lib::debug,
			sol::lib::os
		);

		RegisterUserTypes(m_state);
		RegisterGlobals(m_state, main);

		// 执行Lua初始化脚本，注册枚举、全局工具函数等
		const auto result = m_state->safe_script("require \"bootstrap\"",
			sol::script_pass_on_error);
		if (!result.valid())
		{
			const sol::error err = result;
			return false;
		}

		return false;
	}

	void LuaRuntime::cleanup()
	{
		const auto result = m_state->safe_script("require \"shutdown\"",
			sol::script_pass_on_error);
		if (!result.valid())
		{
			const sol::error err = result;
		}
	}

	sol::state* LuaRuntime::getLuaState()
	{
		return m_state;
	}
}
```

#### 编写luaAPI
- LuaAPI.h
- 定义命名空间用来包含需要在lua中实现调用的内容

```cpp
#pragma once
#include <sol/sol.hpp>

class GameMain;

namespace LuaScripting
{
	class NativeUtils {
	private:
		sol::state* m_state;
		GameMain* m_main;
	public:
		NativeUtils(sol::state* state, GameMain* main);

		GameMain* GetMain();
	};

	void RegisterUserTypes(sol::state* state);

	void RegisterGlobals(sol::state* state, GameMain* main);
}
```

- LuaAPI.cpp

```cpp
#include "LuaAPI.h"
#include "GameMain.h"

namespace LuaScripting
{
	void RegisterUserTypes(sol::state* state) {
		
		const auto printNum = [](GameMain& main, int num) {
			main.printNum(num);
			return true;
		};
		state->new_usertype<GameMain>("GameMain",
			"new", sol::no_constructor,
			"printNum", printNum
		);

		state->new_usertype<NativeUtils>("NativeUtils",
			"new", sol::no_constructor,
			"GetMain", &NativeUtils::GetMain
		);
	}

	void RegisterGlobals(sol::state* state, GameMain* main)
	{
		(*state)["g_nativeUtils"] = NativeUtils{ state, main };
	}

	NativeUtils::NativeUtils(sol::state* state, GameMain* main)
		: m_state(state)
		, m_main(main)
	{

	}

	GameMain* NativeUtils::GetMain()
	{
		return m_main;
	}
}
```

#### 编写入口

- main.cpp

```cpp
#include <iostream>
#include <string.h-  
#include <cassert>
#include <sol.hpp>
#include "GameMain.h"
#include "LuaRuntime.h"

using namespace std;

int main() {
    GameMain* main = new GameMain();
    main->init();
    main->getLuaRuntime()->getLuaState()->script_file("hello.lua");

    return 0;
}
```

#### 一些lua文件

- bootstrap.lua 
- 启动回调文件

```lua
print("-------------bootstrap----------------")
```

- shutdown.lua
- 关闭回调文件

```lua
print("--------------shutdown---------------")
```

- hello.lua
- 执行lua的输出
- 调用了GameMain中定义的方法

```lua
print("Hello CPP")
print(g_nativeUtils)
g_main = g_nativeUtils:GetMain()
print(g_main)
g_main:printNum(10086)
```

#### 执行测试

- c++与lua实现了互相调用
- C++与lua实现了函数绑定

![](/images/C++与lua的交互/base2.jpg)

### TIPS
- **lua虚拟栈**
![](/images/C++与lua的交互/pic4.png)
- **lua虚拟栈的流程图**
![](/images/C++与lua的交互/pic3.gif)
- **SOL对C++的新特性支持比较激进，需要使用最新的C++版本编译**
- **SOL中还有许多内容，比如线程 优化等**
[https://sol2.readthedocs.io/en/latest/](https://sol2.readthedocs.io/en/latest/)
