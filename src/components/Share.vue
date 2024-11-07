<template>
  <van-share-sheet v-model="show" :options="options" :title="$t('invite.shareNow')" get-container="body" @select="select">
    <template #description>
      <div ref="shareImg" class="share-panel">
        <slot />
      </div>
    </template>
  </van-share-sheet>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    isFormat: {
      type: Boolean,
      default: false
    },
    text: {
      type: Number,
      default: null
    },
    format: {
      type: Function,
      default: text => (text > 0 ? '+' : '') + text.toFixed(2) + '%'
    }
  },
  data() {
    return {
      show: false,
      options: [
        { name: '保存图片', icon: 'poster' }
      ]
    }
  },
  methods: {
    select() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.is-block {
  color: white;
  width: 3.5rem;
  text-align: center;
  line-height: 1.6rem;
  border-radius: 2px;
}
</style>
