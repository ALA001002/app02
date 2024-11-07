<template>
  <div class="mx-3 my-1" :class="isMe?'me':'other'">
    <div class="message">
      <van-image v-if="isImg" class="message-image" fit="scale-down" :src="data.content" @click="preview"/>
      <div v-else class="message-text">
        {{data.content}}
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isMe() {
      return this.user.uid == this.data.sender
    },
    isImg() {
      return this.data.type == 1
    }
  },
  methods: {
    preview() {
      ImagePreview([this.data.content])
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  position: relative;
  padding: 7px 12px;
  border-radius: 7px;
}
.me, .other{
  display: flex;
  >.message{
    display: flex;
    max-width: 80vw;
  }
  .message-text {
    word-wrap:break-word;
    overflow: auto;
  }
  .message-image {
    min-width: 30px;
    min-height: 30px;
  }
}
.me {
  flex-direction: row-reverse;
  >.message {
    color: white;
    background-color: #377DFF;
    &::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border: 7px solid transparent;
      border-left: 7px solid #377DFF;
      position: absolute;
      bottom: 8px;
      right: -14px;
    }
  }
}

.other {
  >.message {
    color: #242424;
    background-color: white;
    &::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border: 7px solid transparent;
      border-right: 7px solid white;
      position: absolute;
      bottom: 8px;
      left: -14px;
    }
  }
}

</style>