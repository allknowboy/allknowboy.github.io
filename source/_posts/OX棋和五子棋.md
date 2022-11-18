---
title: OX棋和五子棋
tags:
  - CocosCreator
  - OX棋
  - 五子棋
categories: 游戏编程
abbrlink: 5b90d2f
date: 2020-08-05 18:55:02
---

> 阅读所需基础技能

- colyseus
- cocos creator
- 状态同步

> 游戏效果

<iframe src="/games/chess/index.html" style="display:block; margin:0 auto; width:320px; height:568px; text-align:center;">
</iframe>


## OX棋

![OX棋](/images/OX棋和五子棋/ox.gif)

### 服务器房间主要代码

```ts
import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';

// 一个回合的时间(秒)
const TURN_TIMEOUT = 10
// 棋盘宽度
const BOARD_WIDTH = 3

class Player extends Schema {
    @type('string')
    id: string
    @type('string')
    name: string
}

// 状态同步的内容
class State extends Schema {
    @type('string')
    currentTurn: string
    @type({map: Player })
    players = new MapSchema<Player>()
    @type(['number'])
    board: number[] = new ArraySchema<number>(0, 0, 0, 0, 0, 0, 0, 0, 0);
    @type('string')
    winner: string
    @type('boolean')
    draw: boolean
}


export class TicTacTocRoom extends Room<State> {
	maxClients = 2
	randomMoveTimeout: Delayed

	onCreate (options: any) {
        this.setState(new State())
        // 消息回调
        this.onMessage("*", this.messageHandler.bind(this))

	}

	messageHandler(client: Client, type: any, message: any) {
		// 当前已经有赢家或者为平局
		if (this.state.winner || this.state.draw) {
			return
		}
		// 当前玩家的回合
		if (client.sessionId === this.state.currentTurn) {
		let data: any = message
		const playerIds = Object.keys(this.state.players)
		const index = data.x + BOARD_WIDTH * data.y
		if (this.state.board[index] === 0) {
			const move = (client.sessionId === playerIds[0]) ? 1 : 2
			this.state.board[index] = move
			if (this.checkWin(data.x, data.y, move)) {
			this.state.winner = client.sessionId
			} else if (this.checkBoardComplete()) {
			this.state.draw = true;
			} else {
			// 获取另一个玩家的id
			const otherPlayerSessionId = (client.sessionId === playerIds[0]) ? playerIds[1] : playerIds[0]
			// 设置当前的轮回
			this.state.currentTurn = otherPlayerSessionId
			// 开启自动移动定时器
			this.setAutoMoveTimeout()
			}
		}
		}
	}

	onJoin (client: Client, options: any) {
		let player = new Player()
		player.id = client.sessionId
		player.name = options.name || this.randomName()
		this.state.players[client.sessionId] = player
		if (Object.keys(this.state.players).length === 2) {
			// 当前的turn
			this.state.currentTurn = client.sessionId
			this.setAutoMoveTimeout()
			// 锁定当前的房间
			this.lock()
		}
	}

	randomName() {
		return ~~(Math.random() * 10000) + ''
	}

	// 设置自动移动的定时器
	setAutoMoveTimeout() {
		if (this.randomMoveTimeout) {
			this.randomMoveTimeout.clear()
		}
		this.randomMoveTimeout = this.clock.setTimeout(() => this.doRandomMove(), TURN_TIMEOUT * 1000)
	}

  	// 随机移动
	doRandomMove() {
		const sessionId = this.state.currentTurn
		for (let x=0; x<BOARD_WIDTH; x++) {
			for (let y=0; y<BOARD_WIDTH; y++) {
			const index = x + BOARD_WIDTH * y;
			if (this.state.board[index] === 0) {
				this.messageHandler({ sessionId } as Client, 'pos' ,{ x, y })
				return;
			}
			}
		}
	}

  	// 检测当前的底板是否已经满了
	checkBoardComplete() {
		return this.state.board.filter(item => item === 0).length === 0;
	}

	// 检测是否成功
	checkWin (x: number, y: number, move: number) {
		let won = false
		let board = this.state.board
		// 横向
		for(let y = 0; y < BOARD_WIDTH; y++){
			const i = x + BOARD_WIDTH * y
			if (board[i] !== move) { break }
			if (y == BOARD_WIDTH-1) {
				won = true
			}
		}

		// 纵向
		for(let x = 0; x < BOARD_WIDTH; x++){
			const i = x + BOARD_WIDTH * y
			if (board[i] !== move) { break }
			if (x == BOARD_WIDTH-1) {
				won = true;
			}
		}

		// 交叉
		if(x === y) {
			for (let xy = 0; xy < BOARD_WIDTH; xy++){
			const i = xy + BOARD_WIDTH * xy
			if (board[i] !== move) { break }
			if (xy == BOARD_WIDTH-1) {
				won = true;
			}
			}
		}

		for (let x = 0; x < BOARD_WIDTH; x++) {
			const y = (BOARD_WIDTH - 1) - x
			const i = x + BOARD_WIDTH * y
			if (board[i] !== move) { break }
			if (x == BOARD_WIDTH - 1){
				won = true
			}
		}

		return won
	}

	onLeave (client: Client, consented: boolean) {
		// 删除当前离开的玩家
		delete this.state.players[ client.sessionId ]
		// 清除自动移动的定时器
		if (this.randomMoveTimeout) {
			this.randomMoveTimeout.clear()
		}
		// 获取剩余玩家
		let remainingPlayerIds = Object.keys(this.state.players)
		if (remainingPlayerIds.length > 0) {
			// 设置当前玩家为赢家
			this.state.winner = remainingPlayerIds[0]
		}
	}

	onDispose() {

	}

}

```

### 客户端主要代码

- TicTacToe.ts  

```ts
import OXChess from "./OXChess";

const {ccclass, property} = cc._decorator;

const enum ResultType {
    WIN,
    LOSE,
    DRAW
}

const enum GameState {
    NON,
    MATCH,
    GAME,
    RESULT
}

@ccclass
export default class TicTacToe extends cc.Component {
    client: Colyseus.Client
    room: Colyseus.Room
    gameState: GameState = GameState.NON

    @property() host: string = ''
    @property(cc.Node) boardNode: cc.Node = null
    @property(cc.Node) matchingLayer: cc.Node = null
    @property(cc.Node) resultLayer: cc.Node = null
    @property(cc.Label) turnLabel: cc.Label = null
    @property(cc.Label) timeLabel: cc.Label = null
    @property(cc.Label) resultLabel: cc.Label = null
    @property(cc.Button) matchBtn: cc.Button = null
    @property(cc.EditBox) nameEditBox: cc.EditBox = null
    @property(cc.Label) yourName: cc.Label = null
    @property(cc.Label) otherName: cc.Label = null
    curTurn: string
    turnTimer: any
    time: number = 0
    playerMap: Map<string, {name: string, id: string}> = new Map<string, {name: string, id: string}>()

    start() {
        this.matchBtn.node.on('click', () => {
            this.resultLayer.active = false
            this.matchBtn.node.active = false
            this.startMatch()
        })

        this.boardNode.children.forEach((node: cc.Node, i: number) => {
            node.on(cc.Node.EventType.TOUCH_START, () => {
                if (this.gameState != GameState.GAME) {
                    return
                }
                this.room.send('pos', { x: (i % 3) , y: ~~(i / 3)})
            })
        })
        this.client = new Colyseus.Client(this.host)
    }


    startMatch() {
        this.gameState = GameState.MATCH
        this.matchingLayer.active = true
        this.nameEditBox.node.active = false
        this.client.joinOrCreate('tictactoc', {name: this.nameEditBox.string}).then(room => {
            this.room = room
            room.state.players.onAdd = (player: any) => {
                this.playerMap.set(player.id, player)
                if (room.sessionId === player.id) {
                    this.yourName.string = player.name
                } else {
                    this.otherName.string = player.name
                }
            }
            room.state.players.onChange = (player: any) => {
                this.playerMap.set(player.id, player)
            }
            room.state.players.onRemove= (player: any) => {
                this.playerMap.delete(player.id)
            }

            room.onStateChange(state => {
                if (this.gameState == GameState.MATCH && Object.keys(room.state.players).length === 2) {
                    this.curTurn = state.currentTurn
                    this.startGame()
                }
                if (state.draw) {
                    this.gameResult(ResultType.DRAW)
                }
                if (state.winner) {
                    if (this.room.sessionId === state.winner) {
                        this.gameResult(ResultType.WIN)
                    } else {
                        this.gameResult(ResultType.LOSE)
                    }
                }
                if (this.gameState == GameState.GAME) {
                    this.turnLabel.string = this.room.sessionId === state.currentTurn ? '你的回合' : '对手回合'
                }
                // 棋局
                this.boardNode.children.forEach((node: cc.Node, i: number) => {
                    let chess = node.getComponent(OXChess)
                    if (this.gameState == GameState.GAME && chess.getCurIndex() == 0 && state.board[i] != 0) {
                        this.changeTurn()
                    }
                    chess.setIcon(state.board[i])
                })
            })
        }) as any
    }

    startGame() {
        this.gameState = GameState.GAME
        this.matchingLayer.active = false
        
        this.changeTurn()
    }

    gameResult(type: ResultType) {
        this.gameState = GameState.RESULT
        this.matchBtn.node.active = true
        this.resultLayer.active = true
        this.nameEditBox.node.active = true
        this.yourName.string = ''
        this.otherName.string = ''
        this.playerMap.clear()
        switch(type) {
            case ResultType.WIN: {
                this.resultLabel.string = '赢就是这样简单'
                break
            }
            case ResultType.LOSE: {
                this.resultLabel.string = '失败也是一种进步'
                break
            }
            case ResultType.DRAW: {
                this.resultLabel.string = '和棋是一种态度'
                break
            }
        }
        this.turnLabel.string = '未知'
        this.timeLabel.string = '0'
        if (this.turnTimer) {
            clearInterval(this.turnTimer)
        }
    }

    changeTurn() {
        this.time = 10
        this.timeLabel.string = this.time + ''
        if (this.turnTimer) {
            clearInterval(this.turnTimer)
        }
        this.turnTimer = setInterval(() => {
            this.time--
            if (this.time < 0) {
                this.time = 0
            }
            this.timeLabel.string = this.time + ''
        }, 1000)
    }
    // update (dt) {}
}
```

- OXChess.ts  

```ts
const {ccclass, property} = cc._decorator;

@ccclass
export default class OXChess extends cc.Component {

    @property([cc.SpriteFrame])
    chessIcons: cc.SpriteFrame[] = []

    @property(cc.Sprite)
    icon: cc.Sprite = null

    curIndex: number = 0

    setIcon(id: number) {
        switch(id) {
            case 0: {
                this.icon.spriteFrame = null
                break
            }
            case 1: {
                this.icon.spriteFrame = this.chessIcons[0]
                break
            }
            case 2: {
                this.icon.spriteFrame = this.chessIcons[1]
                break
            }
        }
        this.curIndex = id
    }

    getCurIndex() {
        return this.curIndex
    }
}
```

## 五子棋

![OX棋](/images/OX棋和五子棋/five.gif)

### 服务器房间主要代码

```ts
import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';

// 一个回合的时间
const TURN_TIMEOUT = 10
// 棋盘宽度
const BOARD_WIDTH = 13

class Player extends Schema {
    @type('string')
    id: string
    @type('string')
    name: string
}

const boardMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

// 状态同步的内容
class State extends Schema {
    @type('string')
    currentTurn: string
    @type({map: Player })
    players = new MapSchema<Player>()
    @type(['number'])
    board: number[] = new ArraySchema<number>(...boardMap)
    @type('string')
    winner: string
    @type('boolean')
    draw: boolean
}


export class FiveRoom extends Room<State> {
    maxClients = 2
    randomMoveTimeout: Delayed

    onCreate (options: any) {
        this.setState(new State())
        // 消息回调
        this.onMessage("pos", this.posMessageHandler.bind(this))
        this.onMessage("ai", (client: Client, message: any) => {
            this.posMessageHandler(client, this.useAiMove())
        })
    }

    posMessageHandler(client: Client, message: any) {
        // 当前已经有赢家或者为平局
        if (this.state.winner || this.state.draw) {
            return
        }
        // 当前玩家的回合
        if (client.sessionId === this.state.currentTurn) {
            let data: any = message
            const playerIds = Object.keys(this.state.players)
            const index = data.x + BOARD_WIDTH * data.y
            if (this.state.board[index] === 0) {
            const move = (client.sessionId === playerIds[0]) ? 1 : 2
            this.state.board[index] = move
            if (this.checkWin(data.x, data.y, move)) {
                this.state.winner = client.sessionId
            } else if (this.checkBoardComplete()) {
                this.state.draw = true;
            } else {
                // 获取另一个玩家的id
                const otherPlayerSessionId = (client.sessionId === playerIds[0]) ? playerIds[1] : playerIds[0]
                // 设置当前的轮回
                this.state.currentTurn = otherPlayerSessionId
                // 开启自动移动定时器
                this.setAutoMoveTimeout()
            }
            }
        }
    }

    onJoin (client: Client, options: any) {
        let player = new Player()
        player.id = client.sessionId
        player.name = options.name || this.randomName()
        this.state.players[client.sessionId] = player
        if (Object.keys(this.state.players).length === 2) {
            // 当前的turn
            this.state.currentTurn = client.sessionId
            this.setAutoMoveTimeout()
            // 锁定当前的房间
            this.lock()
        }
    }

    randomName() {
        return ~~(Math.random() * 10000) + ''
    }

    // 设置自动移动的定时器
    setAutoMoveTimeout() {
        if (this.randomMoveTimeout) {
            this.randomMoveTimeout.clear()
        }
        this.randomMoveTimeout = this.clock.setTimeout(() => this.doRandomMove(), TURN_TIMEOUT * 1000)
    }

    useAiMove() : {x: number, y: number} {
        const playerIds = Object.keys(this.state.players)
        const move = (this.state.currentTurn === playerIds[0]) ? 1 : 2
        let maxX = 0,
			maxY = 0,
			maxWeight = 0,
			i, j, tem
		for (i = 14; i >= 0; i--) {
			for (j = 14; j >= 0; j--) {
				if (this.getChessColor(i, j) !== 0) {
					continue
				}
				tem = this.computeWeight(i, j, move)
				if (tem > maxWeight) {
					maxWeight = tem
					maxX = i
					maxY = j
				}
			}
		}
        return {x: maxX, y: maxY}
    }

    // 随机移动
    doRandomMove() {
        // 当前的id
        const sessionId = this.state.currentTurn
        this.posMessageHandler({ sessionId } as Client, this.useAiMove())
        
        // for (let x=0; x<BOARD_WIDTH; x++) {
        //     for (let y=0; y<BOARD_WIDTH; y++) {
        //         const index = x + BOARD_WIDTH * y;
        //         if (this.state.board[index] === 0) {
        //             this.messageHandler({ sessionId } as Client, 'pos' ,{ x, y })
        //             return;
        //         }
        //     }
        // }
    }

    //计算下子至i,j的权重
    computeWeight(i: number, j: number, move: number) {
        var weight = 14 - (Math.abs(i - 7) + Math.abs(j - 7)), //基于棋盘位置权重
            pointInfo: any = {},	//某点下子后连子信息
            chessColor = move
        //x方向
        pointInfo = this.putDirectX(i, j, chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
        pointInfo = this.putDirectX(i, j, -chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
        //y方向
        pointInfo = this.putDirectY(i, j, chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
        pointInfo = this.putDirectY(i, j, -chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
        //左斜方向
        pointInfo = this.putDirectXY(i, j, chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
        pointInfo = this.putDirectXY(i, j, -chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
        //右斜方向
        pointInfo = this.putDirectYX(i, j, chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
        pointInfo = this.putDirectYX(i, j, -chessColor);
        weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
        return weight;
    }
    // 下子到i，j X方向 结果: 多少连子 两边是否截断
    putDirectX(i: number, j: number, chessColor: number) {
		var m, n,
			nums = 1,
			side1 = false,
			side2 = false
		for (m = j - 1; m >= 0; m--) {
			if (this.getChessColor(i, m) === chessColor) {
				nums++;
			}
			else {
				if (this.getChessColor(i, m) === 0) {
					side1 = true;
				}
				break;
			}
		}
		for (m = j + 1; m < 15; m++) {
			if (this.getChessColor(i, m) === chessColor) {
				nums++;
			}
			else {
				if (this.getChessColor(i, m)=== 0) {
					side2 = true;
				}
				break;
			}
		}
		return {"nums": nums, "side1": side1, "side2": side2}
    }
    
    // 下子到i，j Y方向 结果
	putDirectY(i: number, j: number, chessColor: number) {
		let m, n,
			nums = 1,
			side1 = false,
			side2 = false
		for (m = i - 1; m >= 0; m--) {
			if (this.getChessColor(m, j) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, j) === 0) {
					side1 = true
				}
				break
			}
		}
		for (m = i + 1; m < 15; m++) {
			if (this.getChessColor(m, j) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, j) === 0) {
					side2 = true
				}
				break
			}
		}
		return {"nums": nums, "side1": side1, "side2": side2}
    }
    
    //下子到i，j XY方向 结果
	putDirectXY(i: number, j: number, chessColor: number) {
		let m, n,
			nums = 1,
			side1 = false,
			side2 = false;
		for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
			if (this.getChessColor(m, n) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, n) === 0) {
					side1 = true
				}
				break
			}
		}
		for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
			if (this.getChessColor(m, n) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, n) === 0) {
					side2 = true
				}
				break
			}
		}
		return {"nums": nums, "side1": side1, "side2": side2};
    }
    
    putDirectYX(i: number, j: number, chessColor: number) {
		let m, n,
			nums = 1,
			side1 = false,
			side2 = false
		for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
			if (this.getChessColor(m, n) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, n) === 0) {
					side1 = true
				}
				break;
			}
		}
		for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
			if (this.getChessColor(m, n) === chessColor) {
				nums++
			} else {
				if (this.getChessColor(m, n) === 0) {
					side2 = true
				}
				break
			}
		}
		return {"nums": nums, "side1": side1, "side2": side2}
	}
    
    // 权重方案   独：两边为空可下子，单：一边为空
	weightStatus(nums: number, side1: number, side2: number, isAI: boolean) {
		let weight = 0
		switch (nums) {
			case 1:
				if (side1 && side2) {
					weight = isAI ? 15 : 10;	//独一
				}
				break
			case 2:
				if (side1 && side2) {
					weight = isAI ? 100 : 50;	//独二
				}
				else if (side1 || side2) {
					weight = isAI ? 10 : 5;	//单二
				}
				break
			case 3:
				if (side1 && side2) {
					weight = isAI ? 500 : 200;	//独三
				}
				else if (side1 || side2) {
					weight = isAI ? 30 : 20;	//单三
				}
				break
			case 4:
				if (side1 && side2) {
					weight = isAI ? 5000 : 2000;	//独四
				}
				else if (side1 || side2) {
					weight = isAI ? 400 : 100;	//单四
				}
				break
			case 5:
				weight = isAI ? 100000 : 10000;	//五
				break
			default:
				weight = isAI ? 500000 : 250000;
				break
		}
		return weight
	}

    // 检测当前的底板是否已经满了
    checkBoardComplete() {
        return this.state.board.filter(item => item === 0).length === 0;
    }

    getChessColor(x: number, y: number) {
        return this.state.board[x + BOARD_WIDTH * y]
    }

    // 检测是否成功
    checkWin (i: number, j: number, move: number) : boolean {
		let num = 1, chessColor = move, m = 0, n = 0
		//x方向
		for (m = j - 1; m >= 0; m--) {
			if (this.getChessColor(i, m) === chessColor) {
				num++;
			}
			else {
				break;
			}
		}
		for (m = j + 1; m < 15; m++) {
			if (this.getChessColor(i, m) === chessColor) {
				num++
			}
			else {
				break;
			}
		}
		if (num >= 5) {
			return true
		} else {
			num = 1
		}
		//y方向
		for (m = i - 1; m >= 0; m--) {
			if (this.getChessColor(m, j) === chessColor) {
				num++
			} else {
				break
			}
		}
		for (m = i + 1; m < 15; m++) {
			if (this.getChessColor(m, j)  === chessColor) {
				num++
			} else {
				break
			}
		}
		if (num >= 5) {
			return true
		} else {
			num = 1
		}
		//左斜方向
		for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
			if (this.getChessColor(m, n) === chessColor) {
				num++
			} else {
				break
			}
		}
		for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
			if (this.getChessColor(m, n) === chessColor) {
				num++
			} else {
				break
			}
		}
		if (num >= 5) {
			return true
		} else {
			num = 1
		}
		//右斜方向
		for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
			if (this.getChessColor(m, n) === chessColor) {
				num++
			} else {
				break
			}
		}
		for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
			if (this.getChessColor(m, n) === chessColor) {
				num++
			} else {
				break
			}
		}
		if (num >= 5) {
			return true
        }
        return false
    }

    onLeave (client: Client, consented: boolean) {
        // 删除当前离开的玩家
        delete this.state.players[ client.sessionId ]
        // 清除自动移动的定时器
        if (this.randomMoveTimeout) {
            this.randomMoveTimeout.clear()
        }
        // 获取剩余玩家
        let remainingPlayerIds = Object.keys(this.state.players)
        if (remainingPlayerIds.length > 0) {
            // 设置当前玩家为赢家
            this.state.winner = remainingPlayerIds[0]
        }
    }

    onDispose() {

    }

}

```

### 客户端主要代码

- FiveGame.ts

```ts
import FiveChess from "./FiveChess";

const {ccclass, property} = cc._decorator;

const enum ResultType {
    WIN,
    LOSE,
    DRAW
}

const enum GameState {
    NON,
    MATCH,
    GAME,
    RESULT
}

@ccclass
export default class FiveGame extends cc.Component {

    client: Colyseus.Client
    room: Colyseus.Room
    gameState: GameState = GameState.NON

    @property() host: string = ''
    @property(cc.Node) boardNode: cc.Node = null
    @property(cc.Node) matchingLayer: cc.Node = null
    @property(cc.Node) resultLayer: cc.Node = null
    @property(cc.Label) turnLabel: cc.Label = null
    @property(cc.Label) timeLabel: cc.Label = null
    @property(cc.Label) resultLabel: cc.Label = null
    @property(cc.Button) matchBtn: cc.Button = null
    @property(cc.EditBox) nameEditBox: cc.EditBox = null
    @property(cc.Label) yourName: cc.Label = null
    @property(cc.Label) otherName: cc.Label = null
    @property(cc.Button) aiButton: cc.Button = null
    curTurn: string
    turnTimer: any
    time: number = 0
    playerMap: Map<string, {name: string, id: string}> = new Map<string, {name: string, id: string}>()
    useAi: boolean = false

    start () {

        this.aiButton.node.on('click', () => {
            this.room.send('ai')
        })

        this.matchBtn.node.on('click', () => {
            this.resultLayer.active = false
            this.matchBtn.node.active = false
            this.startMatch()
        })

        this.boardNode.children.forEach((node: cc.Node, i: number) => {
            node.on(cc.Node.EventType.TOUCH_START, () => {
                console.log('点击')
                if (this.gameState != GameState.GAME) {
                    return
                }
                this.room.send('pos', { x: (i % 13) , y: ~~(i / 13)})
            })
        })
        this.client = new Colyseus.Client(this.host)
        this.cleanBoard()
    }

    cleanBoard() {
        this.boardNode.children.forEach((node: cc.Node) => {
            node.getComponent(FiveChess).setIcon(0)
        })
    }

    startMatch() {
        this.gameState = GameState.MATCH
        this.matchingLayer.active = true
        this.nameEditBox.node.active = false
        this.useAi = false
        if (this.nameEditBox.string == 'joker') {
            this.useAi = true
        }
        this.client.joinOrCreate('five', {name: this.nameEditBox.string}).then(room => {
            this.room = room
            room.state.players.onAdd = (player: any) => {
                this.playerMap.set(player.id, player)
                if (room.sessionId === player.id) {
                    this.yourName.string = player.name
                } else {
                    this.otherName.string = player.name
                }
            }
            room.state.players.onChange = (player: any) => {
                this.playerMap.set(player.id, player)
            }
            room.state.players.onRemove= (player: any) => {
                this.playerMap.delete(player.id)
            }

            room.onStateChange(state => {
                if (this.gameState == GameState.MATCH && Object.keys(room.state.players).length === 2) {
                    this.curTurn = state.currentTurn
                    this.startGame()
                }
                if (state.draw) {
                    this.gameResult(ResultType.DRAW)
                }
                if (state.winner) {
                    if (this.room.sessionId === state.winner) {
                        this.gameResult(ResultType.WIN)
                    } else {
                        this.gameResult(ResultType.LOSE)
                    }
                }
                if (this.gameState == GameState.GAME) {
                    this.turnLabel.string = this.room.sessionId === state.currentTurn ? '你的回合' : '对手回合'
                }
                // 棋局
                this.boardNode.children.forEach((node: cc.Node, i: number) => {
                    let chess = node.getComponent(FiveChess)
                    if (this.gameState == GameState.GAME && chess.getCurIndex() == 0 && state.board[i] != 0) {
                        this.changeTurn()
                    }
                    chess.setIcon(state.board[i])
                })
            })
        }) as any
    }

    startGame() {
        this.aiButton.node.active = this.useAi
        this.gameState = GameState.GAME
        this.matchingLayer.active = false
        this.changeTurn()
    }

    gameResult(type: ResultType) {
        this.gameState = GameState.RESULT
        this.matchBtn.node.active = true
        this.resultLayer.active = true
        this.nameEditBox.node.active = true
        this.aiButton.node.active = false
        this.yourName.string = ''
        this.otherName.string = ''
        this.playerMap.clear()
        switch(type) {
            case ResultType.WIN: {
                this.resultLabel.string = '赢就是这样简单'
                break
            }
            case ResultType.LOSE: {
                this.resultLabel.string = '失败也是一种进步'
                break
            }
            case ResultType.DRAW: {
                this.resultLabel.string = '和棋是一种态度'
                break
            }
        }
        this.turnLabel.string = '未知'
        this.timeLabel.string = '0'
        if (this.turnTimer) {
            clearInterval(this.turnTimer)
        }
    }

    changeTurn() {
        this.time = 10
        this.timeLabel.string = this.time + ''
        if (this.turnTimer) {
            clearInterval(this.turnTimer)
        }
        this.turnTimer = setInterval(() => {
            this.time--
            if (this.time < 0) {
                this.time = 0
            }
            this.timeLabel.string = this.time + ''
        }, 1000)
    }
}

```

- FiveChess.ts

```ts
const {ccclass, property} = cc._decorator;

@ccclass
export default class FiveChess extends cc.Component {

    @property([cc.SpriteFrame])
    chessIcons: cc.SpriteFrame[] = []

    @property(cc.Sprite)
    icon: cc.Sprite = null

    curIndex: number = 0

    setIcon(id: number) {
        switch(id) {
            case 0: {
                this.icon.spriteFrame = null
                break
            }
            case 1: {
                this.icon.spriteFrame = this.chessIcons[1]
                break
            }
            case 2: {
                this.icon.spriteFrame = this.chessIcons[0]
                break
            }
        }
        this.curIndex = id
    }

    getCurIndex() {
        return this.curIndex
    }
}
```