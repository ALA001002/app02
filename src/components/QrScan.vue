<template>
  <div v-show="value" class="scan-panel">
    <div id="bcid" class="is-grow">
      <p class="tip">loading...</p>
    </div>
    <div class="section is-flex-center btns">
      <van-icon name="clear" class="is-grow" size="40" @click="close"/>
      <van-icon name="photo" class="is-grow" size="40" @click="selectQr"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scan: null
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.$nextTick(() => {
            this.scanQr()
          })
        }
      }
    },
    methods: {
      scanQr() {
        if (!window.plus) {
          alert('Not Supported')
          return
        }
        if (!this.scan) {
          delete this.scan
        }
        this.scan = new plus.barcode.Barcode('bcid')
        this.scan.onmarked = this.onMarked
        this.scan.start()
      },
      selectQr() {
        if (!window.plus) {
          alert('Not Supported')
          return
        }
        // 从相册中选择图片，获取到图片地址 path
        plus.gallery.pick((path) => {
            //识别二维码图片
          plus.barcode.scan(path, this.onMarked, () => {
            plus.nativeUI.alert('No QrCode')
          })
        }, function(){
          // console.log('Failed: ' + err.message)
        })
      },
      onMarked(type, result) {
        result = result.replace(/\n/g, '')
        this.$emit('scan', result, type)
        this.close()
      },
      close() {
        this.scan.close()
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped>
.scan-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, .7);
}
.tip, .btns {
  margin-top: 0;
  text-align: center;
}
</style>