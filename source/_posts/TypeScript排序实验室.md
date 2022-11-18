---
title: TypeScript排序实验室
tags:
  - TypeScript排序实验室
categories: 编程语言
abbrlink: c8b1d873
date: 2019-09-24 09:27:49
---

## BubbleSort

- 冒泡排序

```ts
/**
 * 冒泡排序
 *
 * @param {Array<number>} array
 * @returns {Array<number>}
 */
function BubbleSort(array: Array<number>) : Array<number> {
    let retArray = [].concat(array)
    for (let i = 0, n = retArray.length; i < n; i++) {
        for (let j = 0; j < n  - i - 1; j++) {
            if (retArray[j] > retArray[j + 1]) {
                let temp = retArray[j]
                retArray[j] = retArray[j + 1]
                retArray[j + 1] = temp
            }
        }
    }
    return retArray
}
```

## ChooseSort

- 选择排序

```ts
/**
 * 选择排序
 *
 * @param {Array<number>} array
 * @returns {Array<number>}
 */
function ChooseSort(array: Array<number>) : Array<number> {
    let retArray = [].concat(array)
    let min = 0, key = 0
    for (let i = 0, n = retArray.length; i < n; i++) {
        min = retArray[i]
        key = i
        for (let j = i + 1; j < n; j++) {
            if (min > retArray[j]) {
                key = j
                min = retArray[j]
            }
        }
        if (key != i) {
            let temp = retArray[i]
            retArray[i] = retArray[key]
            retArray[key] = temp
        }
    }
    return retArray
}
```

## InsertSort

- 插入排序

```ts
/**
 * 插入排序
 *
 * @param {Array<number>} array
 * @returns {Array<number>}
 */
function InsertSort(array: Array<number>) : Array<number> {
    let retArray = [].concat(array)
    for (let i = 1, n = retArray.length; i < n; i++ ) {
        let temp = retArray[i]
        let j = i
        while(j > 0 && retArray[j - 1] > temp) {
            retArray[j] = retArray[j - 1]
            j--
        }
        retArray[j] = temp
    }
    return retArray
}
```

## ShellSort

- 希尔排序

```ts
/**
 * 希尔排序
 *
 * @param {Array<number>} array
 * @returns {Array<number>}
 */
function ShellSort(array: Array<number>) : Array<number> {
    let retArray = [].concat(array)
    let n = retArray.length
    let gap = ~~(n / 2)
    while (gap >= 1) {
        for (let i = gap; i < n; i++) {
            let temp = retArray[i]
            let j = i
            while(j > gap - 1 && retArray[j - gap] > temp) {
                retArray[j] = retArray[j - gap]
                j -= gap
            }
            retArray[j] = temp
        }
        gap = ~~(gap / 2)
    }
    return retArray
}
```

## QuickSort

- 快速排序

```ts
/**
 * 快速排序
 *
 * @param {Array<number>} array
 * @returns {Array<number>}
 */
function QuickSort(array: Array<number>) : Array<number> {
    let retArray = [].concat(array)
    let n = retArray.length
    /**
     * 快速排序的递归方法
     *
     * @param {number} left
     * @param {number} right
     */
    function quick(begin: number, end: number) {

        //递归出口
        if (begin >= end) {
            return
        }
        let l = begin // 左指针
        let r = end // 右指针
        let temp = retArray[l] // 基准数，这里取数组第一个数
        // 左右指针相遇的时候退出扫描循环
        while(l < r) {
            // 右指针从右向左扫描，碰到第一个小于基准数的时候停住
            while(l < r && retArray[r] >= temp) {
                r--
            }
            // 左指针从左向右扫描，碰到第一个大于基准数的时候停住
            while(l < r && retArray[l] <= temp) {
                l++
            }
            // 交换左右指针所停位置的数
            [retArray[l], retArray[r]] = [retArray[r], retArray[l]]
        }
        // 最后交换基准数与指针相遇位置的数
        [retArray[begin], retArray[l]] = [retArray[l], retArray[begin]]
        // 递归处理左右数组
        quick(begin, l - 1)
        quick(l + 1, end)
    }
    quick(0, n - 1)
    return retArray
}
```

## 时间测试

- 使用含5000个随机整数的数组测试排序效率

```ts
let testArr = []
let len = 5000
let time = Date.now()
for (let i = 0; i < len; i++) {
    testArr.push(~~(Math.random() * len))
}
// 答案
let resultArr = testArr.sort((a: number, b: number) => a - b)

// 冒泡排序
time = Date.now()
let ans1 = BubbleSort(testArr)
if (JSON.stringify(resultArr) === JSON.stringify(ans1)) {
    console.log('BubbleSort Cost', Date.now() - time, 'ms')
}

// 选择排序
time = Date.now()
let ans2 = ChooseSort(testArr)
if (JSON.stringify(resultArr) === JSON.stringify(ans2)) {
    console.log('ChooseSort Cost', Date.now() - time, 'ms')
}

// 插入排序
time = Date.now()
let ans3 = InsertSort(testArr)
if (JSON.stringify(resultArr) === JSON.stringify(ans3)) {
    console.log('InsertSort Cost', Date.now() - time, 'ms')
}

// 希尔排序
time = Date.now()
let ans4 = ShellSort(testArr)
if (JSON.stringify(resultArr) === JSON.stringify(ans4)) {
    console.log('ShellSort Cost', Date.now() - time, 'ms')
}

// 快速排序
time = Date.now()
let ans5 = QuickSort(testArr)
if (JSON.stringify(resultArr) === JSON.stringify(ans5)) {
    console.log('QuickSort Cost', Date.now() - time, 'ms')
}
```
