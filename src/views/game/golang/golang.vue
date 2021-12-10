<template>
  <div>
    <!-- <input id="text" type="text" />
    <button @click="send()">Send</button>
    <button @click="closeWebSocket()">Close</button>
    <div id="message"></div>
    <div class="goBang">aa</div> -->
    <!-- <h2 class="h2Title">五子棋</h2>
    <h3>{{ victory }}</h3>
    <div class="Fbuttons">
      <input type="button" value="重新开始" class="restart" @click="restartInit()" />
      <input type="button" value="悔棋" class="regret" @click="regret()" />
      <input type="button" value="撤销悔棋" class="undo" @click="undo()" />
      <input type="button" :value="toggle ? '切换dom' : '切换canvas'" class="toggle" @click="toggleF()" />
    </div> -->
    <div>
      当前房间号： {{roomId}}，当前房间人数： {{num}}
    </div>
    <input type="button"  value="退出" class="restart" @click="back()" />
    <div v-if="color == '' && num == 2">
      <input type="button" v-if="changeedColor != 'white'" value="白子" class="restart" @click="clickColor('white')" />
      <input type="button" v-if="changeedColor != 'black'" value="黑子" class="restart" @click="clickColor('black')" />
    </div>
    <div v-if="color != '' && num == 2" >
      已选择 {{this.color}}
      <input type="button" v-if="color != ''" value="重新选择" class="restart" @click="color = ''" />
    </div>
    <div v-if=" num < 2" >
      请等待好友进入
    </div>
    <input type="button" value="重新开始" class="restart" @click="restartInit()" />
    <div class="main">
      <canvas v-show="toggle" id="myCanvas" ref="canvas" width="480" height="480">当前浏览器不支持Canvas</canvas>
      <div v-show="!toggle" id="chess" ref="chessBox">
        <!-- <div id="box01"></div>
					<div id="box02"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
import request from '@/utils/request'
export default {
  name: 'AppLayout',
  data() {
    return {
      color: '',
      changeedColor: '',
      userId: this.WebSocket.userId,
      tabbars: [
        {
          title: '首页',
          to: {
            name: 'Home'
          },
          icon: 'home-o'
        },
        {
          title: '关于我',
          to: {
            name: 'About'
          },
          icon: 'user-o'
        }
      ],
      pieceMapArr: [], //记录棋盘落子情况
      pieceColor: ['black', 'white'], //棋子颜色
      step: 0, //记录当前步数
      checkMode: [
        //输赢检查方向模式
        [1, 0], //水平
        [0, 1], //竖直
        [1, 1], //左斜线
        [1, -1] //右斜线
      ],
      flag: false,
      downFlag: true,
      victory: '',
      history: [], //历史记录位置
      historyVal: [], //历史记录不被删除数组
      stepHistory: 0,
      domPiece: [], //
      toggle: true, //true为canvas,false为dom
      roomId: '',
      num: 0
    }
  },
  components: {
    TabBar
  },
  created: function () {
    console.log('created')
    console.log(this.$route.params)
    this.roomId = this.$route.params.roomId
    if(this.roomId == '' || this.roomId == null){
      this.$router.push('/home')
    }
    this.init()
    // console.log(this.WebSocket.ws)
  },
  mounted() {
    const myCanvas = document.getElementById('myCanvas')
    if (myCanvas.getContext) {
      // alert('当前浏览器不支持Canvas.')
      this.toggle = false
      this.drawpieceBoardDom()
    } else {
      console.log('当前浏览器支持Canvas', this.toggle)
      this.drawpieceBoard()
      const canvas = this.$refs.canvas
      // 添加点击监听事件
      canvas.addEventListener('click', e => {
        if (this.flag) {
          alert('游戏结束,请重新开始~')
          return
        }
        //判断点击范围是否越出棋盘
        if (e.offsetX < 25 || e.offsetX > 450 || e.offsetY < 25 || e.offsetY > 450) {
          return
        }
        let dx = Math.floor((e.offsetX + 15) / 30) * 30
        let dy = Math.floor((e.offsetY + 15) / 30) * 30
        console.log('this.pieceMapArr 数组', this.pieceMapArr)
        if (this.pieceMapArr[dx / 30 - 1][dy / 30 - 1] == 0) {
          console.log('落下棋子', dx, dy, this.pieceColor[this.step % 2])
          this.drawPiece(dx, dy, this.pieceColor[this.step % 2]) //落下棋子
          this.pieceMapArr[dx / 30 - 1][dy / 30 - 1] = this.pieceColor[this.step % 2]

          //历史记录位置
          this.history.length = this.step
          this.history.push({
            dx,
            dy,
            color: this.pieceColor[this.step % 2]
          })
          this.historyVal.push({
            dx,
            dy,
            color: this.pieceColor[this.step % 2]
          })
          this.stepHistory++
          console.log('this.history', this.history)
          // 检查当前玩家是否赢了游戏
          for (var i = 0; i < 4; i++) {
            this.checkWin(dx / 30 - 1, dy / 30 - 1, this.pieceColor[this.step % 2], this.checkMode[i])
          }
          this.step++
        } else {
          alert('不能落在有棋子的地方！')
        }
      })
    }
  },
  beforeDestroy() {
    // this.WebSocket.ws.close()
  },
  methods: {
    back(){
      var data = {
        type:'outRoom',
        roomId: this.roomId
      }
      this.WebSocket.send(data)
      this.$router.push('goBangHall')
    },
    clickColor(color) {
      this.color = color
      var d = {
        color: color
      }
      var data = {
        type: 'changeColor',
        data: d
      }
      if(color == 'black'){
        this.downFlag = false
      }else{
        // this.downFlag = true
      }
      console.log(data)
      this.WebSocket.send(JSON.stringify(data))
    },
    toggleF() {
      this.toggle = !this.toggle
      if (!this.toggle) {
        // console.log("当前---------------1")
        // let elem = document.getElementById('box01');
        // if (elem !== null) {
        // 	elem.parentNode.removeChild(elem);
        // 	let elem02 = document.getElementById('box02');
        // 	elem02.parentNode.removeChild(elem02);
        // }
        // this.drawpieceBoardDom();
        this.restartInit()
      } else {
        this.restartInit()
        // this.drawpieceBoard();
      }
    },
    //初始化棋盘数组
    pieceArr() {
      for (let i = 0; i < 15; i++) {
        this.pieceMapArr[i] = []
        for (let j = 0; j < 15; j++) {
          this.pieceMapArr[i][j] = 0
        }
      }
    },
    //重新开始
    restartInit() {
      if (!this.toggle) {
        // console.log("-----dom-------")
        var elem = document.querySelector('#box01')
        // console.log("elem",elem)
        if (elem != null) {
          elem.parentNode.removeChild(elem)
          let elem02 = document.querySelector('#box02')
          elem02.parentNode.removeChild(elem02)
        }
        this.drawpieceBoardDom()
        this.flag = false
        this.step = 0
        this.stepHistory = 0
        this.historyVal = []
        this.history = []
      } else {
        //重画
        this.repaint()
        // 绘制棋盘
        this.drawpieceBoard()
        this.flag = false
        this.step = 0
        this.stepHistory = 0
        this.historyVal = []
        this.history = []
      }
    },
    //---------canvas----------
    // 绘制棋盘
    drawpieceBoard() {
      //初始化棋盘数组
      this.pieceArr()
      //canvas 绘制
      let canvas = this.$refs.canvas
      // 调用canvas元素的getContext 方法访问获取2d渲染的上下文
      let context = canvas.getContext('2d')
      context.strokeStyle = '#666'
      for (let i = 0; i < 15; i++) {
        //落在方格(canvas 的宽高是450)
        // context.moveTo(15 + i * 30, 15)
        // context.lineTo(15 + i * 30, 435)
        // context.stroke()
        // context.moveTo(15, 15 + i * 30)
        // context.lineTo(435, 15 + i * 30)
        // context.stroke()
        //落在交叉点(480)
        context.beginPath()
        context.moveTo((i + 1) * 30, 30)
        context.lineTo((i + 1) * 30, canvas.height - 30)
        context.closePath()
        context.stroke()
        context.beginPath()
        context.moveTo(30, (i + 1) * 30)
        context.lineTo(canvas.width - 30, (i + 1) * 30)
        context.closePath()
        context.stroke()
      }
    },
    //绘制棋子
    drawPiece(x, y, color) {
      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')
      context.beginPath() //开始一条路径或重置当前的路径
      context.arc(x, y, 15, 0, Math.PI * 2, false)
      context.closePath()
      context.fillStyle = color
      context.fill()
    },
    //胜负判断函数
    checkWin(x, y, color, mode) {
      let count = 1 //记录
      for (let i = 1; i < 5; i++) {
        if (this.pieceMapArr[x + i * mode[0]]) {
          if (this.pieceMapArr[x + i * mode[0]][y + i * mode[1]] == color) {
            count++
          } else {
            break
          }
        }
      }
      for (let j = 1; j < 5; j++) {
        if (this.pieceMapArr[x - j * mode[0]]) {
          if (this.pieceMapArr[x - j * mode[0]][y - j * mode[1]] == color) {
            count++
          } else {
            break
          }
        }
      }
      // console.log('胜负判断函数', count)
      // console.log('color', color)
      if (count >= 5) {
        if (color == 'black') {
          this.victory = '黑子棋方胜利！'
        } else {
          this.victory = '白子棋方胜利！'
        }
        // 游戏结束
        alert(this.victory)
        console.log('游戏结束')
        this.flag = true
      }
    },
    //重画函数
    repaint() {
      //重画
      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')
      context.fillStyle = 'bisque'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.beginPath()
      context.closePath()
    },

    //悔棋:
    // canvas 创建一个二维数组，下棋或者悔棋都操作这个数组。操作完数据，把画布全清，重新用数据画一个棋盘。
    // dom   二维数组删除数组最后一项, 先清空棋子的填充颜色,在渲染上颜色
    regret() {
      if (!this.toggle) {
        // console.log("-----dom------this.domPiece",this.domPiece)
        if (this.history.length && !this.flag) {
          this.history.pop() //删除数组最后一项
          console.log('-----dom------this.history', this.history)
          //重画
          this.pieceArr()
          // let elem = document.getElementById('box01');
          // if (elem !== null) {
          // 	elem.parentNode.removeChild(elem);
          // 	let elem02 = document.getElementById('box02');
          // 	elem02.parentNode.removeChild(elem02);
          // } //这个太耗性能了
          // this.drawpieceBoardDom();
          // 清空棋子的填充颜色
          this.domPiece.forEach(e => {
            e.forEach(qz => {
              qz.style.backgroundColor = ''
            })
          })
          // 渲染棋子颜色
          this.history.forEach(e => {
            this.domPiece[e.m][e.n].style.backgroundColor = e.color
            this.pieceMapArr[e.m][e.n] = e.color
          })
          this.step--
        } else {
          alert('已经不能悔棋了~')
        }
      } else {
        if (this.history.length && !this.flag) {
          this.history.pop() //删除数组最后一项
          //重画
          this.repaint()
          // 绘制棋盘
          this.drawpieceBoard()
          //绘制棋子
          this.history.forEach(e => {
            this.drawPiece(e.dx, e.dy, e.color)
            this.pieceMapArr[e.dx / 30 - 1][e.dy / 30 - 1] = e.color
          })
          this.step--
        } else {
          alert('已经不能悔棋了~')
        }
      }
    },
    //撤销悔棋
    undo() {
      if (!this.toggle) {
        // console.log("-----dom------this.domPiece",this.domPiece)
        if (this.historyVal.length > this.history.length && !this.flag) {
          this.history.push(this.historyVal[this.step])
          console.log('-----dom------this.history', this.history)
          // 清空棋子的填充颜色
          this.domPiece.forEach(e => {
            e.forEach(qz => {
              qz.style.backgroundColor = ''
            })
          })
          // 渲染棋子颜色
          this.history.forEach(e => {
            this.domPiece[e.m][e.n].style.backgroundColor = e.color
            this.pieceMapArr[e.m][e.n] = e.color
          })
          this.step++
        } else {
          alert('不能撤销悔棋了~')
        }
      } else {
        if (this.historyVal.length > this.history.length && !this.flag) {
          this.history.push(this.historyVal[this.step])
          //重画
          this.repaint()
          // 绘制棋盘
          this.drawpieceBoard()
          this.history.forEach(e => {
            this.drawPiece(e.dx, e.dy, e.color)
            this.pieceMapArr[e.dx / 30 - 1][e.dy / 30 - 1] = e.color
          })
          this.step++
        } else {
          alert('不能撤销悔棋了~')
        }
      }
    },
    // -----------dom-----------
    drawpieceBoardDom() {
      // console.log("this", this)
      let that = this
      //调用初始化棋盘数组函数
      that.pieceArr()
      //创建一个容器
      const box = document.querySelector('#chess')
      const box01 = document.createElement('div')
      box01.setAttribute('id', 'box01')
      box.appendChild(box01)
      //画棋盘
      const chess01 = document.querySelector('#box01')
      const box02 = document.createElement('div')
      box02.setAttribute('id', 'box02')
      box.appendChild(box02)
      let arr = new Array()
      for (let i = 0; i < 14; i++) {
        arr[i] = new Array()
        for (let j = 0; j < 14; j++) {
          arr[i][j] = document.createElement('div')
          arr[i][j].setAttribute('class', 'squre')
          box02.appendChild(arr[i][j])
        }
      }
      //画棋子
      let arr01 = this.domPiece
      for (let i = 0; i < 15; i++) {
        arr01[i] = new Array()
        for (let j = 0; j < 15; j++) {
          arr01[i][j] = document.createElement('div')
          arr01[i][j].setAttribute('class', 'qz')
          arr01[i][j].setAttribute('id', i + '_' + j)
          chess01.appendChild(arr01[i][j])
        }
      }
      // console.log("this.domPiece",this.domPiece)
      // 填充颜色和判断
      for (let m = 0; m < 15; m++) {
        for (let n = 0; n < 15; n++) {
          arr01[m][n].onclick = function () {
            that.downPieceOwn(this, m, n, that.color)
          }
        }
      }
    },
    downPieceOwn(_this, m, n, color) {
      console.log(this.downFlag)
      if (this.downFlag) {
        return
      }
      console.log(this.WebSocket.ws)
      let that = this
      console.log(_this)
      console.log(document.getElementById('8_6'))
      console.log('----------------------------')
      console.log(that.pieceMapArr)
      //判断游戏是否结束
      if (!that.flag) {
        if (that.pieceMapArr[m][n] == 0) {
          var d = {
            x: m,
            y: n,
            color: color
          }
          var data = {
            type: 'downPiece',
            data: d
          }
          console.log(data)
          that.WebSocket.send(JSON.stringify(data))
          that.downPiece(_this, m, n, color)
          that.downFlag = true
        } else {
          alert('不能落在有棋子的地方！')
          return
        }
      } else {
        // that.flag = true;
        alert('游戏结束,请重新开始~')
        return
      }
    },
    downPiece(_this, m, n, color) {
      console.log(this.history)
      console.log(this.historyVal)
      let that = this
      _this.style.backgroundColor = color
      //写入棋盘数组
      that.pieceMapArr[m][n] = color
      //历史记录位置
      that.history.length = that.step
      that.history.push({
        m,
        n,
        color: color
      })
      that.historyVal.push({
        m,
        n,
        color: color
      })
      that.stepHistory++
      console.log('this.history', that.history)
      // }
      //检查当前是否赢了
      for (var i = 0; i < 4; i++) {
        that.checkWin(m, n, color, that.checkMode[i])
      }
      that.step++
    },
    send() {
      console.log(this.WebSocket.ws)
      var msg = document.getElementById('text').value
      this.WebSocket.send(msg)
      // console.log(this.WebSocket.ws.readyState == 1)
      // if(this.WebSocket.ws && this.WebSocket.ws.readyState == 1){
      //   console.log('发送消息',msg)
      //   // this.WebSocket.ws.send(msg)
      // }
    },
    init() {
      this.localSocket()
      console.log(this.WebSocket.ws)
    },
    localSocket(){
      let that = this
      if("WebSocket" in window){
        if(that.roomId == '' || that.roomId == null){
          return
        }
        // that.ws = new WebSocket('ws://127.0.0.1:9528/websocket/dictSocket/'+that.WebSocket.userId+'/'+that.roomId)
        that.ws = new WebSocket('ws://127.0.0.1:9528/websocket/dictSocket/'+that.WebSocket.userId)
        that.WebSocket.setWs(that.ws)
        that.WebSocket.ws.onopen = function(){
          console.log('websocket链接成功！')
        }
        // that.ws.onmessage = function(event){
        //   console.log(event)
        // }
        that.WebSocket.ws.onclose = function(){
          console.log('链接断开')
          setTimeout(() => {
            that.localSocket()
          }, 2000);
        }
        this.WebSocket.ws.onmessage = this.onmessage
      } else {
        console.log('不支持webSocket')
      }
    },
    onmessage(event) {
      console.log('进来了')
      console.log(event)
      var sendData = JSON.parse(event.data)
      console.log(sendData)
      if (sendData.type == 'downPiece') { // 落子
        var data = sendData.data
        console.log(data)
        if (data.color == this.color) {
          return
        }
        console.log(data.x)
        console.log(data.y)
        this.downPiece(document.getElementById(data.x + '_' + data.y), data.x, data.y, data.color)
        this.downFlag = false
      } else if (sendData.type == 'changeColor'){ // 对方选择颜色
        var data = sendData.data
        if(data.color == this.color){
          return 
        }
        this.changeedColor = data.color
      } else if (sendData.type == 'userNum'){ // 当前用户
        var data = sendData.data
        this.num = data.num
        if(this.num < 2){
          this.color = ''
          this.changeedColor = ''
        }
      }
      // document.getElementById('message').innerHTML = event.data + '\n'
    },
    closeWebSocket() {
      this.WebSocket.ws.close()
    },
    handleChange(v) {
      console.log('tab value:', v)
    }
  }
}
</script>

<style>
.goBang {
  width: 50px;
  height: 50px;
}
body {
  margin: 0;
  padding: 0;
}
/* #app {
  padding-left: 30%;
  width: 500px;
} */
.h2Title {
  text-align: center;
}
#app h3 {
  color: red;
}
.Fbuttons {
  margin-bottom: 1rem;
}
.main {
  /* background-color: bisque; */
  background-color: bisque;
  /* width: 30rem; */
}
.restart,
.regret,
.undo {
  background: bisque;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
#chess {
  position: relative;
  /* width: 440px;
  height: 450px;
  padding-left: 30px;
  padding-top: 30px; */
  /* 315处理下 */
  width: 290px;
  height: 300px;
  /* padding-left: 20px; */
  padding-top: 20px;
  background-color: bisque;
  margin: 0 auto;
}

#chess .squre {
  /* width: 28px;
  height: 28px; */
  width: 18px;
  height: 18px;
  border: 1px solid #666;
  float: left;
}

#box01 .squre:hover {
  background-color: pink;
}

#box01 {
  position: absolute;
  margin: 0 auto;
  /* width: 450px;
  height: 450px;
  top: 15px;
  left: 15px; */
  width: 300px;
  height: 300px;
  top: 10px;
  left: -10px;
}

#box01 .qz {
  /* width: 28px;
				height: 28px; */
  width: 18px;
  height: 18px;
  /* width: 30px;
  height: 30px; */
  border: 1px solid rgba(209, 156, 87, 0);
  float: left;
  border-radius: 50%;
  /* margin: 1px; */
}

#box01 .qz:hover {
  background-color: pink;
}
.toggle {
  float: right;
}
</style>