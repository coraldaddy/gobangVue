<template>
  <div>
    <input id="text" type="text" />
    <button @click="send()">Send</button>
    <button @click="closeWebSocket()">Close</button>
    <div id="message"></div>
    <van-button type="primary" @click="goLang()">Italk</van-button>
    <!-- <h2 class="h2Title">五子棋</h2>
    <h3>{{ victory }}</h3>
    <div class="Fbuttons">
      <input type="button" value="重新开始" class="restart" @click="restartInit()" />
      <input type="button" value="悔棋" class="regret" @click="regret()" />
      <input type="button" value="撤销悔棋" class="undo" @click="undo()" />
      <input type="button" :value="toggle ? '切换dom' : '切换canvas'" class="toggle" @click="toggleF()" />
    </div> -->
    <!-- <div class="main">
      <canvas v-show="toggle" id="myCanvas" ref="canvas" width="480" height="480">当前浏览器不支持Canvas</canvas>
      <div v-show="!toggle" id="chess" ref="chessBox">
      </div>
    </div> -->
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
import request from '@/utils/request'
export default {
  name: 'AppLayout',
  data() {
    return {
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
      ]
    }
  },
  components: {
    TabBar
  },
  created() {
    // this.init()
  },
  
  methods: {
    goLang(){
      console.log('111111111111111')
      // request({
      //     url: '/api/user/sendInfo',
      //     method: 'post',
      //     data: {}
      //   }).then(({data}) => {})
      this.$router.push('/aaa')
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
    onmessage(event) {
      console.log('进来了')
      console.log(event.data)
      document.getElementById('message').innerHTML = event.data + '\n'
    },
    init() {
      console.log(this.WebSocket.ws)
      this.WebSocket.ws.onmessage = this.onmessage
      console.log(this.WebSocket.ws)
      //   this.WebSocket.ws.onmessage = function(event){
      //     console.log('wea')
      //     console.log(event.data)
      //  }
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

</style>