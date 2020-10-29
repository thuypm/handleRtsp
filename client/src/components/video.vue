<template>
  <div class="hello">
    <video width="320"  autoplay="true" controls="controls" :id="idVideo" :ref="idVideo"></video>
  </div>
</template>

<script>

import Hls from 'hls.js';
export default {
  name: "video",
  props: ["linkVideo", "idVideo"],
  data() {
    return {};
  },

  methods: {},
  mounted() {
      var video = this.$refs[this.idVideo];
      var hls = new Hls();
        hls.attachMedia(video); 
        hls.loadSource(this.linkVideo);
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
       
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          console.log("load:" + data.levels.length + " quality level");
        });
      })
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
