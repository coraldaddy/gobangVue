<!-- home -->
<template>
  <div class="index-container">
  <van-row type="flex" justify="space-around" v-for="(item, index) in list" :key="index">
    <van-col span="6" class="room" v-for="(data, key) in item.data" :key="key" @click="gotoRoom(data.code)">
      <div class="roomClass">
        {{data.name}}
      </div>
    </van-col>
  </van-row>
    <!-- <div class="warpper">
      <h1 class="demo-home__title"><img src="https://www.sunniejs.cn/static/weapp/logo.png" /><span> VUE H5开发模板</span></h1>
      <h2 class="demo-home__desc">
        A vue h5 template with Vant UI
      </h2>
    </div> -->
    <!-- <van-cell icon="success" v-for="item in list" :key="item" :title="item" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          data: [
            {name: '房间A',code: 'gobang0001'},
            {name: '房间B',code: 'gobang0002'},
            {name: '房间C',code: 'gobang0003'}
          ]
        },
        {
          data: [
            {name: '房间D',code: 'gobang0004'},
            {name: '房间E',code: 'gobang0005'},
            {name: '房间F',code: 'gobang0006'}
          ]
        },{
          data: [
            {name: '房间G',code: 'gobang0007'},
            {name: '房间H',code: 'gobang0008'},
            {name: '房间I',code: 'gobang0009'}
          ]
        }
      ]
    }
  },

  computed: {},

  mounted() { },

  methods: {
    gotoRoom(roomId){
      console.log(roomId)
      var data = {
        type:'gotoRoom',
        roomId: roomId
      }
      console.log(this.WebSocket.ws)
      // this.WebSocket.send(JSON.stringify(data))
      this.$router.push({ name: 'aaa', params: { roomId: roomId }})
    }
  }
}
</script>
<style lang="scss" scoped>
.room{
  height: 100px;
}
.roomClass{
  border-radius: 20%;
  background-color: cornflowerblue;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 20px;
}
.index-container {
  .warpper {
    padding: 12px;
    background: #fff;
    .demo-home__title {
      margin: 0 0 6px;
      font-size: 32px;
      .demo-home__title img,
      .demo-home__title span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        width: 32px;
      }
      span {
        margin-left: 16px;
        font-weight: 500;
      }
    }
    .demo-home__desc {
      margin: 0 0 20px;
      color: rgba(69, 90, 100, 0.6);
      font-size: 14px;
    }
  }
}
</style>
