;(function() {
	'use stric'
	const doc = window.document
	const $ = (el, method = false) => {
		if (method) {
			return doc.querySelectorAll(el)
		} else {
			return doc.querySelector(el)
		}
	}
	class Game {
		constructor(arg) {
			this.opt = Object.assign({
				el: 'body',
				chessboard: 5,
				timeCallback() {},
				stepSuccess() {},
				success() {}
			}, arg)
			this.$timeEl = $('#time')
			this.__recordSteps = []
			this.el = $(this.opt.el)
		}
		paint () { // 绘制棋盘
			this.__paintInit = true
			this.__ms = 0
			const chessboard = Array.from({ length: this.opt.chessboard }).map((row, index) => {
				index = index + 1
				const rowEl = doc.createElement('div')
				rowEl.className = 'game-row'
				this.el.appendChild(rowEl)
				
				return Array.from({ length: index }).map((child, cindex) => {
					const colEl = doc.createElement('div')
					colEl.className = 'game-col'
					rowEl.appendChild(colEl)
					
					const chess = doc.createElement('div')
					const id = `game-chess-${index}-${cindex+1}`
					chess.id = id
					chess.className = 'game-chess'
					colEl.appendChild(chess)
					const obj = {
						position: [index, cindex+1],
						el: chess,
						status: false // 是否为空
					}
					chess.addEventListener('click', () => {
						this.step(obj, chess)
					})
					return obj
				})
			})
			this.chessboard = chessboard
			this.time()
		}
		step (chess, el) { // 开始跳子，选中的子朝着空位跳，中间必须隔着一个存在的子
			if (this.__paintInit) { // 第一步随便点
				el.classList.add('game-chess__close')
				this.__paintInit = false
				chess.status = true
				this.recordStep(chess)
				return false
			}
			
			const clearFoucs = (method = true) => { // 清理选中的棋子
				this.el.querySelectorAll('.game-chess').forEach(gc => {
					gc.classList.remove('game-chess__foucs')
				})
				if (!chess.status && method) {
					el.classList.add('game-chess__foucs')
					this.__chessA = chess
				}
			}
			
			// 第二步开始需要点击两次
			if (this.__chessA) {
				if (chess.status) { // 落点不能是有棋子的位置
					this.__chessZ = chess
					const clearChess = this.toStep()
					if (clearChess.length == 2) { // 计算位置是否符合游戏规则
						this.recordStep(this.__chessA, this.__chessZ)
						// 初始化棋子
						clearFoucs(false)
						this.__chessA.status = true
						this.__chessA.el.classList.add('game-chess__close')
						this.__chessZ.el.className = 'game-chess'
						this.__chessZ.status = false
						const node = this.chessboard[clearChess[0]-1][clearChess[1]-1]
						node.status = true
						node.el.classList.add('game-chess__close')
						this.__chessA = false
						
						// TODO: 每移动一步就判断是否成功完成游戏
						if (this.isSucessGame()) {
							window.clearTimeout(__clearTIme)
							Object.prototype.toString.call(this.opt.success) === '[object Function]' && this.opt.success({ ms: this.__ms, steps: this.__recordSteps})
						}
					} else {
						clearFoucs()
					}
				} else {
					clearFoucs()
				}
			} else {
				clearFoucs()
			}
		}
		toStep () { // 计算目标位置是否符合放置规则
			const clearPosition = []
			const aRow = this.__chessA.position[0]
			const aCol = this.__chessA.position[1]
			const zRow = this.__chessZ.position[0]
			const zCol = this.__chessZ.position[1]
			
			if (aRow === zRow) {
				clearPosition.push(aRow)
				if (aCol === (zCol - 2)) {
					clearPosition.push(zCol - 1)
				} else if (aCol === (zCol + 2)) {
					clearPosition.push(zCol + 1)
				}
			} else if (aRow === (zRow - 2) || aRow === (zRow + 2)) {
				if (aRow === (zRow - 2)) {
					clearPosition.push(zRow - 1)
				} else if (aRow === (zRow + 2)) {
					clearPosition.push(zRow + 1)
				}
				if (aCol === zCol) {
					clearPosition.push(zCol)
				} else if (aCol === (zCol - 2)) {
					clearPosition.push(zCol - 1)
				} else if (aCol === (zCol + 2)) {
					clearPosition.push(zCol + 1)
				}
			}
			
			if (clearPosition.length == 2) { // 中间的棋子不能为空
				const node = this.chessboard[clearPosition[0]-1][clearPosition[1]-1]
				node.status && (clearPosition.length = 0)
				
			}
			return clearPosition
		}
		recordStep (a, z) { // 记录步骤
			this.__recordSteps.push({
				a: a.position,
				z: (z && z.position) ? z.position : undefined
			})
			Object.prototype.toString.call(this.opt.stepSuccess) === '[object Function]' && this.opt.stepSuccess(this.__recordSteps)
			console.info('记录移动步骤：', this.__recordSteps)
		}
		time () { // 计时器
			if (this.$timeEl) {
				this.__clearTime = setTimeout(() => {
					this.__ms = this.__ms + 60
					Object.prototype.toString.call(this.opt.timeCallback) === '[object Function]' && this.opt.timeCallback(this.__ms)
					this.time()
				}, 60)
			}
		}
		alert (msg) { // 提示信息
			if (this.$alertEl) {
				this.$alertEl.remove()
				this.$alertEl = null
				clearTimeout(this.$alertTime)
				this.$alertTime = null
			}
			const el = doc.createElement('div')
			el.className = 'game-alert'
			el.innerText = msg
			doc.body.appendChild(el)
			this.$alertEl = el
			this.$alertTime = setTimeout(() => {
				if (this.$alertEl) {
					this.$alertEl.remove()
					this.$alertEl = null
				}
				this.$alertTime = null
			}, 2000)
		}
		isSucessGame() { // 是否成功完成游戏
			// 棋盘只剩一粒棋子
			let num = 0
			for (let i=0; i<this.chessboard.length; i++) {
				if (num > 1) {
					break
				}
				const c = this.chessboard[i]
				for (let j=0; j<c.length; j++) {
					if (num > 1) {
						break
					}
					if (c[j] && !c[j].status) {
						num ++
					} 
				}
			}
			if (num !== 1) {
				return false
			}
			return true
		}
	}
	
	doc.addEventListener('DOMContentLoaded', () => {
		const game = new Game({
			el: '#game',
			timeCallback(ms) {
				$('#time').innerHTML = `耗时<small>(秒)</small>：${ms/1000}`
			},
			success({ms, steps}) {
				alert(`恭喜你完成游戏,耗时 ${ms/1000} 秒,一共走了 ${steps.length} 步`)
			}
		})
		game.paint()
	})
}());