<template>
    <div style="overflow:hidden;">
        <div  class="img-box" v-for="(item,index) in list" :key="index">
            <img :src="item" alt="" :style="getStyle" @click="prew(item)">
        </div>
        <Modal
         v-model="modal1" :footer-hide="true">
            <img :src="url" alt="" width="100%">
        </Modal>
    </div>
</template>

<script>

export default {
  name: 'ImgPreview',
  components: {

  },
  data () {
    return {
      modal1: false,
      url: ''
    }
  },
  props: {
    width: String,
    height: String,
    list: Array
  },
  computed: {
    getStyle () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  methods: {
    prew (url) {
      this.url = url
      this.modal1 = true
    }
  }
}
</script>

<style scoped>
    .img-box{
        margin: 10px;
        float: left;
        border:1px solid #ddd;
    }
</style>
