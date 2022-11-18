---
title: TypeScript数据结构实验室
tags:
  - TypeScript数据结构实验室
categories: 编程语言
abbrlink: f96a5f3
date: 2019-09-24 09:27:48
---

## Stack

- 栈是一个最基础的数据结构
- 先进后出

```ts
/**
 * 栈
 *
 * @export
 * @class Stack
 * @template T
 */
export class Stack<T> {
    // 使用数组作为数据源
    private _data: Array<T> = new Array<T>()

    /**
     * 添加数据
     *
     * @param {T} element
     * @memberof Stack
     */
    push(element: T) {
        this._data.push(element)
    }

    /**
     * 查看栈顶数据
     *
     * @returns {T}
     * @memberof Stack
     */
    peek() : T {
        if (this._data.length > 0) {
            return this._data[this._data.length - 1]
        }
        return null
    }

    /**
     * 查看并弹出栈顶数据
     *
     * @returns {T}
     * @memberof Stack
     */
    pop() : T {
        return this._data.pop()
    }

    /**
     * 判断栈是否为空
     *
     * @returns {boolean}
     * @memberof Stack
     */
    isEmpty() : boolean {
        return this._data.length == 0
    }

    /**
     * 清除栈的方法
     *
     * @memberof Stack
     */
    clean() {
        this._data = new Array<T>()
    }

    /**
     * 返回栈的长度
     *
     * @returns {number}
     * @memberof Stack
     */
    size() : number {
        return this._data.length
    }

    /**
     * 栈的打印
     *
     * @returns {string}
     * @memberof Stack
     */
    toString() : string {
        return this._data.toString()
    }
}
```

## Queue

- 队列是一个最基础的数据结构
- 先进先出

```ts
/**
 * 队列
 *
 * @export
 * @class Queue
 * @template T
 */
export class Queue<T> {
    // 使用数组作为数据源
    private _data: Array<T> = new Array<T>()

    /**
     * 入队
     *
     * @param {T} element
     * @memberof Queue
     */
    enqueue(element: T) {
        this._data.push(element)
    }

    /**
     * 出队
     *
     * @returns {T}
     * @memberof Queue
     */
    dequeue() : T {
        return this._data.shift()
    }

    /**
     * 查看队伍的第一个
     *
     * @returns {T}
     * @memberof Queue
     */
    front() : T {
        if (this._data.length > 0) {
            this._data[0]
        }
        return null
    }

    /**
     * 是否为空队
     *
     * @returns {boolean}
     * @memberof Queue
     */
    isEmpty() : boolean {
        return this._data.length == 0
    }

    /**
     * 队列的长度
     *
     * @returns {number}
     * @memberof Queue
     */
    size() : number {
        return this._data.length
    }

    /**
     * 队列的打印
     *
     * @returns
     * @memberof Queue
     */
    toString() {
        return this._data.toString()
    }
}
```

## PriorityQueue

- 带优先级的队列，优先级越大越靠前

```ts
/**
 * 队列的数据节点, 带优先级
 *
 * @class QueueElement
 * @template T
 */
class QueueElement<T> {
    constructor(public element: T, public priority: number) {}
}

/**
 * 优先级队列
 *
 * @export
 * @class PriorityQueue
 * @template T
 */
export class PriorityQueue<T> {
    // 优先级队列的数据源
    private _data: Array<QueueElement<T>> = new Array<QueueElement<T>>()

    /**
     * 通过优先级入队,越大越优先
     *
     * @param {T} element
     * @param {number} [priority=0]
     * @memberof PriorityQueue
     */
    enqueue(element: T, priority: number = 0) {
        let added = false
        for (let i = 0; i < this._data.length; i++) {
            if (priority <= this._data[i].priority) {
                this._data.splice(i, 0, new QueueElement(element, priority))
                added = true
                break
            }
        }
        if (!added) {
            this._data.push(new QueueElement(element, priority))
        }
    }

    /**
     * 查看队首位置
     *
     * @returns {T}
     * @memberof PriorityQueue
     */
    front() : T {
        if (this._data.length > 0) {
            return this._data[this._data.length - 1].element
        }
        return null
    }

    /**
     * 出队
     *
     * @returns {T}
     * @memberof PriorityQueue
     */
    dequeue() : T {
        let queueElement: QueueElement<T> = this._data.pop()
        if (queueElement) {
            return queueElement.element
        }
        return null
    }

    /**
     * 队列是否为空
     *
     * @returns {boolean}
     * @memberof PriorityQueue
     */
    isEmpty() : boolean {
        return this._data.length == 0
    }

    /**
     * 队列的数量
     *
     * @returns
     * @memberof PriorityQueue
     */
    size() {
        return this._data.length
    }

    /**
     * 队列的打印
     *
     * @returns
     * @memberof PriorityQueue
     */
    toString() {
        return this._data.toString()
    }
}
```

## LinkedList

- 单向链表

```ts
/**
 * 链表的节点
 *
 * @class LinkedNode
 * @template T
 */
class LinkedNode<T> {
    constructor(public element: T, public next: LinkedNode<T> = null) {}
}

/**
 * 单向链表
 *
 * @export
 * @class LinkedList
 * @template T
 */
export class LinkedList<T> {
    // 链表的表头
    private _head: LinkedNode<T> = null
    // 链表的长度
    private _length: number = 0

    /**
     * 在链表尾部添加元素
     *
     * @param {T} element
     * @memberof LinkedList
     */
    append(element: T) {
        if (this._length == 0) {
            this._head = new LinkedNode<T>(element)
        } else {
            let curNode = this._head
            while(curNode.next) {
                curNode = curNode.next
            }
            curNode.next = new LinkedNode<T>(element)
        }
        this._length++
    }

    /**
     * 在链表中插入元素
     *
     * @param {number} position
     * @param {T} element
     * @returns {boolean}
     * @memberof LinkedList
     */
    insert(position: number, element: T) : boolean {
        if (position < 0 || position > this._length) {
            return false
        }
        let newNode = new LinkedNode<T>(element)
        let curNode = this._head
        if (position == 0) {
            newNode.next = curNode
            this._head = newNode
            this._length++
            return true
        }
        let index = 0
        let preNode = null
        while(index++ < position) {
            preNode = curNode
            curNode =curNode.next
        }
        preNode.next = newNode
        newNode.next = curNode
        this._length++
        return true
    }

    /**
     * 获取指定位置的元素
     *
     * @param {number} position
     * @returns {T}
     * @memberof LinkedList
     */
    get(position: number) : T {
        if (position < 0 || position >= this._length) {
            return null
        }
        let index = 0
        let curNode = this._head
        while(index++ < position) {
            curNode = curNode.next
        }
        return curNode.element
    }

    /**
     * 获得元素的下标
     *
     * @param {T} element
     * @returns {number}
     * @memberof LinkedList
     */
    indexOf(element: T) : number {
        let index = 0
        let curNode = this._head
        while(curNode) {
            if (curNode.element == element) {
                return index
            }
            index++
            curNode = curNode.next
        }
        return -1
    }

    /**
     * 修改指定下标的元素内容
     *
     * @param {number} position
     * @param {T} element
     * @returns {boolean}
     * @memberof LinkedList
     */
    update(position: number, element: T) : boolean {
        if (position < 0 || position >= this._length) {
            return false
        }
        let index = 0
        let curNode = this._head
        while(index++ < position) {
            curNode = curNode.next
        }
        curNode.element = element
        return true
    }

    /**
     * 删除元素
     *
     * @param {T} element
     * @returns {boolean}
     * @memberof LinkedList
     */
    remove(element: T) : boolean {
        if (this.removeAt(this.indexOf(element))) {
            return true
        } else {
            return false
        }
    }

    /**
     * 删除指定下标的元素
     *
     * @param {number} position
     * @returns {T}
     * @memberof LinkedList
     */
    removeAt(position: number) : T {
        if (position < 0 || position >= this._length) {
            return null
        }
        let curNode = this._head
        if (position == 0) {
            this._head = this._head.next
            this._length--
            return curNode.element
        }
        let index = 0
        let preNode = null
        while(index++ < position) {
            preNode = curNode
            curNode = curNode.next
        }
        preNode.next = curNode.next
        this._length--
        return curNode.element
    }

    /**
     * 判断是否为空
     *
     * @returns
     * @memberof LinkedList
     */
    isEmpty() {
        return this._length == 0
    }

    /**
     * 链表的打印
     *
     * @returns
     * @memberof LinkedList
     */
    toString() {
        let curNode = this._head
        let ret = ''
        while (curNode) {
            ret += curNode.element.toString() + '->'
            curNode = curNode.next
        }
        return ret
    }

    /**
     * 链表的长度
     *
     * @returns
     * @memberof LinkedList
     */
    size() {
        return this._length
    }
}
```

## DoublyLinkedList

- 双向链表

```ts
/**
 * 双向链表的节点
 *
 * @class DoublyLinkedNode
 * @template T
 */
class DoublyLinkedNode<T> {
    constructor(public element: T, public previous: DoublyLinkedNode<T> = null, public next: DoublyLinkedNode<T> = null) {}
}

/**
 * 双向链表
 *
 * @export
 * @class DoublyLinkedList
 * @template T
 */
export class DoublyLinkedList<T> {
    // 头节点
    private _head: DoublyLinkedNode<T> = null
    // 尾节点
    private _tail: DoublyLinkedNode<T> = null
    // 链表的长度
    private _length = 0

    /**
     * 添加数据
     *
     * @param {T} element
     * @memberof DoublyLinkedList
     */
    append(element: T) {
        let newNode = new DoublyLinkedNode(element)
        if (this._length == 0) {
            this._head = newNode
            this._tail = newNode
            this._length++
            return
        }
        this._tail.next = newNode
        newNode.previous = this._tail
        this._tail = newNode
        this._length++
    }

    /**
     * 指定位置插入数据
     *
     * @param {number} position
     * @param {T} element
     * @returns {boolean}
     * @memberof DoublyLinkedList
     */
    insert(position: number, element: T) : boolean {
        if (position < 0 || position > this._length) {
            return false
        }
        let newNode = new DoublyLinkedNode(element)
        // 当前的数组为空
        if (this._length == 0) {
            this._head = newNode
            this._tail = newNode
            this._length++
            return true
        }
        // 插入到最前面
        if (position == 0) {
            newNode.next = this._head
            this._head.previous = newNode
            this._head = newNode
            this._length++
            return true
        }
        // 插入到最后
        if (position == this._length) {
            this._tail.next = newNode
            newNode.previous = this._tail
            this._tail = newNode
            this._length++
            return true
        }
        // TODO 实现二分插入 先判断插入位置 然后确定从头或者从尾开始插入
        // 从前面插入
        let index = 0
        let curNode = this._head
        while(index++ < position) {
            curNode = curNode.next
        }
        curNode.previous.next = newNode
        newNode.previous = curNode.previous
        curNode.previous = newNode
        newNode.next = curNode
        this._length++
        return true
    }

    /**
     * 删除数据
     *
     * @param {T} element
     * @returns {boolean}
     * @memberof DoublyLinkedList
     */
    remove(element: T) : boolean {
        if (this.removeAt(this.indexOf(element))) {
            return true
        } else {
            return false
        }
    }

    /**
     * 删除指定节点数据
     *
     * @param {number} position
     * @returns {T}
     * @memberof DoublyLinkedList
     */
    removeAt(position: number) : T {
        if (position < 0 || position >= this._length) {
            return null
        }
        let curNode = null
        if (this._length == 1) {
            curNode = this._head
            this._head = null
            this._tail = null
            this._length--
            return curNode.element
        }
        // 删除第一个节点
        if (position == 0) {
            curNode = this._head
            this._head = this._head.next
            this._head.previous = null
            this._length--
            return curNode.element
        }
        // 删除最后一个节点
        if (position == this._length - 1) {
            curNode = this._tail
            this._tail = this._tail.previous
            this._tail.next = null
            return curNode.element
        }
        // 从前面开始遍历
        let index = 0
        curNode = this._head
        while (index++ < position) {
            curNode = curNode.next
        }
        curNode.previous.next = curNode.next
        curNode.next.previous = curNode.previous
        return curNode.element
    }

    /**
     * 更新指定节点数据
     *
     * @param {number} position
     * @param {T} element
     * @returns {boolean}
     * @memberof DoublyLinkedList
     */
    update(position: number, element: T) : boolean {
        if (position < 0 || position >= this._length) {
            return false
        }
        let index = 0
        let curNode = this._head
        while(index++ < position) {
            curNode = curNode.next
        }
        curNode.element = element
        return true
    }

    /**
     * 返回数据的下标
     *
     * @param {T} element
     * @returns {number}
     * @memberof DoublyLinkedList
     */
    indexOf(element: T) : number {
        let index = 0
        let curNode = this._head
        while(curNode) {
            if (curNode.element == element) {
                return index
            }
            index++
            curNode = curNode.next
        }
        return -1
    }

    /**
     * 获取指定下标的数据
     *
     * @param {number} position
     * @returns {T}
     * @memberof DoublyLinkedList
     */
    get(position: number) : T {
        if (position < 0 || position >= this._length) {
            return null
        }
        // 实现二分读取 先判断读取位置 然后确定从头或者从尾开始读取
        if (position < this._length / 2) {
            // 从前面读取
            let index = 0
            let curNode = this._head
            while(index++ < position) {
                curNode = curNode.next
            }
            return curNode.element
        } else {
            // 从后面读取
            let index = this._length - 1
            let curNode = this._tail
            while(index-- > position) {
                curNode = curNode.previous
            }
            return curNode.element
        }
    }

    /**
     * 判断是否为空
     *
     * @returns {boolean}
     * @memberof DoublyLinkedList
     */
    isEmpty() : boolean {
        return this._length == 0
    }

    /**
     * 返回链表的长度
     *
     * @returns {number}
     * @memberof DoublyLinkedList
     */
    size() : number {
        return this._length
    }

    /**
     * 从尾开始遍历
     *
     * @returns {string}
     * @memberof DoublyLinkedList
     */
    backwardString() : string {
        let ret = ''
        let curNode = this._tail
        while(curNode) {
            ret += curNode.element + '<-'
            curNode = curNode.previous
        }
        return ret
    }

    /**
     * 从头开始遍历
     *
     * @returns {string}
     * @memberof DoublyLinkedList
     */
    forwardString() : string {
        let ret = ''
        let curNode = this._head
        while(curNode) {
            ret += curNode.element + '->'
            curNode = curNode.next
        }
        return ret
    }

    /**
     * 打印链表
     *
     * @returns {string}
     * @memberof DoublyLinkedList
     */
    toString() : string {
        return this.backwardString()
    }

    /**
     * 获取头数据
     *
     * @returns {T}
     * @memberof DoublyLinkedList
     */
    getHead() : T {
        return this._head.element
    }

    /**
     * 获取尾数据
     *
     * @returns {T}
     * @memberof DoublyLinkedList
     */
    getTail() : T {
        return this._tail.element
    }
}
```

## HashTable

- 哈希表
- 要点是哈希函数的均匀分布

```ts
/**
 * 哈希表
 *
 * @export
 * @class HashTable
 * @template K
 * @template V
 */
export class HashTable <K, V>{
    // 哈希表的数据源
    private _storage = []
    // 哈希表的数量
    private _count = 0
    // 哈希表的限制数量
    private _limit = 17

    /**
     * 哈希函数
     *
     * @param {string} str
     * @param {number} size
     * @returns {number}
     * @memberof HashMap
     */
    private hash(str: string, size: number) : number {
        let index = 0
        let hashCode = 0
        for (let i = 0; i < str.length; i++) {
            hashCode = 37 * hashCode + str.charCodeAt(i)
        }
        index = hashCode % size
        return index
    }

    /**
     * 是否是质数
     *
     * @private
     * @param {number} num
     * @returns {boolean}
     * @memberof HashTable
     */
    private isPrime(num: number) : boolean {
        if (num <= 1) {
            return false
        }
        for (let i = 2, n = ~~(Math.sqrt(num)); i <= n; i++) {
            if (num % i == 0) {
                return false
            }
            return true
        }
        return true
    }

    /**
     * 获取素数
     *
     * @private
     * @param {number} num
     * @returns {number}
     * @memberof HashTable
     */
    private getPrime(num: number) : number {
        while(!this.isPrime(num)) {
            num++
        }
        return num
    }

    /**
     * 修改数据大小
     *
     * @private
     * @param {number} limit
     * @memberof HashTable
     */
    private resize(limit: number) {
        let oldStorage = this._storage
        this._count = 0
        this._limit = limit
        this._storage = []
        oldStorage.forEach(bucket => {
            if (bucket) {
                bucket.forEach(tuple => {
                    this.put(tuple[0], tuple[1])
                })
            }
        })
    }

    /**
     * 插入数据
     *
     * @param {K} key
     * @param {V} value
     * @memberof HashTable
     */
    put(key: K, value: V) {
        let index = this.hash(key + '', this._limit)
        let bucket = this._storage[index]
        if (!bucket) {
            bucket = []
            this._storage[index] = bucket
        }
        let has = bucket.some(tuple => {
            if (key + '' === tuple[0]) {
                tuple[1] = value
                return true
            }
            return false
        })
        if (!has) {
            bucket.push([key + '', value])
            this._count++
            if (this._count > this._limit * 0.75) {
                this.resize(this.getPrime(this._limit * 2))
            }
        }
    }

    /**
     * 获取数据
     *
     * @param {K} key
     * @returns {V}
     * @memberof HashTable
     */
    get(key: K) : V {
        let index = this.hash(key + '', this._limit)
        let bucket = this._storage[index]
        if (!bucket) {
            return null
        }
        for (let i = 0; i < bucket.length; i++) {
            let tuple = bucket[i]
            if (key + '' === tuple[0]) {
                return tuple[1]
            }
        }
        return null
    }

    /**
     * 删除数据
     *
     * @param {K} key
     * @returns {V}
     * @memberof HashTable
     */
    remove(key: K) : V {
        let index = this.hash(key + '', this._limit)
        let bucket = this._storage[index]
        if (!bucket) {
            return null
        }
        for (let i = 0; i < bucket.length; i++) {
            let tuple = bucket[i]
            if (key + '' === tuple[0]) {
                bucket.splice(i, 1)
                this._count--
                if (this._limit > 17 && this._count < this._limit * 0.25) {
                    this.resize(this.getPrime(~~(this._limit / 2)))
                }
                return tuple[1]
            }
        }
        return null
    }

    /**
     * 判断是否为空
     *
     * @returns
     * @memberof HashTable
     */
    isEmpty() {
        return this._count == 0
    }

    /**
     * 返回数据大小
     *
     * @returns
     * @memberof HashTable
     */
    size() {
        return this._count
    }

}
```

## BinarySearchTree

- 搜索二叉树
- 删除是难点 多用到递归

```ts
/**
 * 二叉树节点
 *
 * @class TreeNode
 * @template T
 */
class TreeNode<T> {
    constructor(public key: number, public value: T, public left: TreeNode<T> = null, public right: TreeNode<T> = null) {}
}

/**
 * 二叉树
 *
 * @export
 * @class BinarySearchTree
 * @template T
 */
export class BinarySearchTree<T> {
    // 根节点
    root: TreeNode<T> = null

    /**
     * 插入数据
     *
     * @param {number} key
     * @param {T} [value=null]
     * @memberof BinarySearchTree
     */
    insert(key: number, value: T = null) {
        let newNode = new TreeNode<T>(key, value)
        if (this.root == null) {
            this.root = newNode
            return
        }
        this.insertNode(this.root, newNode)
    }

    /**
     * 获取最小值
     *
     * @returns {number}
     * @memberof BinarySearchTree
     */
    min() : number {
        let node = this.root
        while(node.left !== null) {
            node = node.left
        }
        return node.key || 0
    }

    /**
     * 获取最大值
     *
     * @returns {number}
     * @memberof BinarySearchTree
     */
    max() : number {
        let node = this.root
        while(node.right !== null) {
            node = node.right
        }
        return node.key || 0
    }

    /**
     * 查询数据
     *
     * @param {number} key
     * @returns {T}
     * @memberof BinarySearchTree
     */
    search(key: number) : T {
        let node = this.searchNode(this.root, key)
        return node && node.value
    }

    /**
     * 删除数据
     *
     * @param {number} key
     * @returns {T}
     * @memberof BinarySearchTree
     */
    remove(key: number) : T {
        let current = this.root
        let parent = this.root
        let isLeftChild = true
        // 查找要删除的节点
        while(current.key != key) {
            parent = current
            if (key < current.key) {
                isLeftChild = true
                current = current.left
            } else {
                isLeftChild = false
                current = current.right
            }
            if (current == null) {
                return null
            }
        }
        // 删除叶子节点
        if (current.left == null && current.right == null) {
            if (current == parent) {
                this.root = null
                return current.value
            }
            if (isLeftChild) {
                parent.left = null
                return current.value
            } else {
                parent.right = null
                return current.value
            }
        }
        // 删除有一个子节点
        if (current.left == null || current.right == null) {
            if (current == parent) {
                this.root = current.left || current.right
                return current.value
            }
            if (isLeftChild) {
                parent.left = current.left || current.right
                return current.value
            } else {
                parent.right = current.left || current.right
                return current.value
            }
        }
        // 删除有两个节点
        let obj = this.getDelSuccessor(current)

        if (obj.successor != current.right) {
            obj.parent.left = obj.successor.right
            obj.successor.right = current.right
        }
        if (current == parent) {
            this.root = obj.successor
        }
        if (isLeftChild) {
            parent.left = obj.successor.left
        } else {
            parent.left = obj.successor.right
        }
        return current.value
    }

    private getDelSuccessor(delNode: TreeNode<T>) : {successor: TreeNode<T>, parent: TreeNode<T> } {
        let successor = delNode
        let parent = delNode
        let current = delNode.right

        while(current != null) {
            parent = successor
            successor = current
            current = current.left
        }

        return {
            successor, parent
        }
    }

    /**
     * 先序遍历
     *
     * @param {(key: number) => void} handler
     * @memberof BinarySearchTree
     */
    preOrderTraversal(handler: (key: number) => void) {
        this.preOrderTraversalNode(this.root, handler)
    }

    /**
     * 中序遍历
     *
     * @param {(key: number) => void} handler
     * @memberof BinarySearchTree
     */
    middleOrderTraversal(handler: (key: number) => void) {
        this.middleOrderTraversalNode(this.root, handler)
    }

    /**
     * 后序遍历
     *
     * @param {(key: number) => void} handler
     * @memberof BinarySearchTree
     */
    postOrderTraversal(handler: (key: number) => void) {
        this.postOrderTraversalNode(this.root, handler)
    }

    /**
     * 查找节点的递归方法
     *
     * @private
     * @param {TreeNode<T>} node
     * @param {number} key
     * @returns {TreeNode<T>}
     * @memberof BinarySearchTree
     */
    private searchNode(node: TreeNode<T>, key: number) : TreeNode<T> {
        if (node === null) {
            return null
        }

        if (node.key > key) {
            return this.searchNode(node.left, key)
        } else if(node.key < key) {
            return this.searchNode(node.right, key)
        }
        return node
    }

    private postOrderTraversalNode(node: TreeNode<T>, handler: (key: number) => void) {
        if (node != null) {
            this.postOrderTraversalNode(node.left, handler)
            this.postOrderTraversalNode(node.right, handler)
            handler(node.key)
        }
    }

    private middleOrderTraversalNode(node: TreeNode<T>, handler: (key: number) => void) {
        if (node != null) {
            this.middleOrderTraversalNode(node.left, handler)
            handler(node.key)
            this.middleOrderTraversalNode(node.right, handler)
        }
    }

    private preOrderTraversalNode(node: TreeNode<T>, handler: (key: number) => void) {
        if (node != null) {
            handler(node.key)

            this.preOrderTraversalNode(node.left, handler)

            this.preOrderTraversalNode(node.right, handler)
        }
    }

    /**
     * 插入节点的递归方法
     *
     * @private
     * @param {TreeNode<T>} node
     * @param {TreeNode<T>} newNode
     * @memberof BinarySearchTree
     */
    private insertNode(node: TreeNode<T>, newNode: TreeNode<T>) {
        if (newNode.key < node.key) {
            if (node.left == null) {
                node.left = newNode
            } else {
                this.insertNode(node.left, newNode)
            }
        } else {
            if (node.right == null) {
                node.right = newNode
            } else {
                this.insertNode(node.right, newNode)
            }
        }
    }

}
```
