<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section">
      <div class="text-24px " style="line-height:1.4">{{title}}</div>
      <div class="text-mid line2" id="panel" v-html="html"></div>
    </div>
  </Layout>
</template>

<script>
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Toast } from 'vant'
export default {
  data() {
    return {
      title: null,
      html: null,
    }
  },
  mounted() {
    NProgress.configure({ parent: '#panel' })
    this.title = this.$route.query.title
    this.load()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    content() {
      return this.$route.query.content
    },
    type() {
      return this.$route.query.type || 'id'
    },
  },
  watch: {
    id() {
      this.load()
    },
  },
  methods: {
    load() {
      this.html = null
      if (this.content) {
        this.html = this.content
        return
      }
      NProgress.start()
      var url =
        (this.type == 'key'
          ? 'common/getSysArticle?key='
          : 'common/getSysNoticeById?id=') + this.id
      this.$http.api
        .get(url)
        .then(data => {
          NProgress.done()
          data = data.data
          this.title = data.title
          this.html = data.content
        })
        .catch(err => {
          NProgress.done()
          Toast.fail({
            icon: 'cross',
            message: err.msg,
            forbidClick: false,
            duration: 2500,
          })
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// ::v-deep .container {
//   background-color: white !important;
//   #panel {
//     font-family: PingFangSC-Regular, PingFang SC;
//     overflow-x: hidden;
//     overflow-y: auto;
//     image,
//     img {
//       max-width: 100%;
//     }
//     p {
//       margin: 2px 0;
//     }
//   }
// }
</style>
