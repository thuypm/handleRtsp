<template>
  <div class="container">
    <h5>Nhập link rtsp</h5>
    <input type="text" v-model="rtspLink" />
    <button type="button" @click="submit()">Submit</button>
    <div class="list video">
      <div class="video" v-for="(video, index) in listVideo" :key="index">
        <VideoPlay :linkVideo="video" :idVideo="'vid'+index"/>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlay from "./components/video";
// import axios from "axios";
var io = require("socket.io-client");
var socket = io.connect("http://localhost:3000/");
export default {
  name: "index",
  components: {
    VideoPlay,
  },
  data()
  {
      return{
            socket: socket,
            listVideo: [],
            rtspLink: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'
      }
  },
  created()
  {
     socket.on('response-video',(linkVideo)=>{
         linkVideo = 'http://localhost:3000/' + linkVideo;
                this.listVideo.push(linkVideo);
     })
  },
  methods: {
        submit()
        {
            socket.emit("join-a-video-stream", this.rtspLink);
        }
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
