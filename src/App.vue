<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created(){
    // this.localSocket()
  },
  methods:{
    localSocket(){ // 2083  963
      let that = this
      if("WebSocket" in window){
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
      } else {
        console.log('不支持webSocket')
      }
    }
  }
}
</script>
<style lang="scss"></style>
