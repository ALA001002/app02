<template>
  <div class="message-panel">
    <div ref="mPanel" class="is-grow">
      <message v-for="(item, i) in list" :key="i" :data="item" :user="user"/>
    </div>
    <van-form :style="{paddingBottom: bottom + 'px'}" action="#" class="is-flex-center btns" @submit="sub()">
      <van-field
        v-model.trim="message"
        :placeholder="$t('app.enterMessage')"
        type="text"
        @focus="inputFocus"
      >
        <template #left-icon>
          <image-select @select="imageSelect"/>
        </template>
        <template #button>
          <van-button :disabled="!message" :loading="loading" size="mini" class="is-none" icon="share"/>
        </template>
      </van-field>
    </van-form>
  </div>
</template>

<script>
import message from './Message'
import imageSelect from './Image'
import { get } from 'vuex-pathify'
export default {
  components: { message, imageSelect },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      receiver: null,
      loading: false,
      message: null,
      list: []
    }
  },
  created() {
    this.load()
  },
  watch: {
    list() {
      this.$nextTick(() => {
        if (this.$refs.mPanel.lastElementChild) {
          this.$refs.mPanel.lastElementChild.scrollIntoView()
        }
      })
    },
    wsMessage: {
      handler(val) {
        this.list.push(val)
      }
    }
  },
  computed: {
    user: get('user/info'),
    wsMessage: get('wsData@MESSAGE'),
    bottom: get('config@bottom')
  },
  methods: {
    imageSelect(file) {
      this.sub(file, 1)
    },
    inputFocus() {
      this.$nextTick(() => {
        if (this.$refs.mPanel.lastElementChild) {
          this.$refs.mPanel.lastElementChild.scrollIntoView()
        }
      })
    },
    load() {
      this.$ws.psend('CONTACT_SERVICE').then((data) => {
        this.receiver = data
        return  this.$ws.psend('HISTORY')
      }).then(data => {
        this.list = data
      })
    },
    sub(message, type) {
      message = message || this.message
      if (!message) return
      this.loading = true
      this.message = null
      this.$ws.psend('MESSAGE', {
        content: message,
        receiver: this.receiver,
        type: type || 0
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.message-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  >.is-grow {
    overflow: auto;
  }
}
.tip, .btns {
  margin-top: 0;
  text-align: center;
}
</style>