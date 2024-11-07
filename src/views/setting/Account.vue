<template>
  <Layout full>
    <NavBar slot="header" back>{{$t('extra.userCenter')}}</NavBar>
    <div class="page-full-part">
      <div class="section mt-3">
<!--        <div class="email text-22px" v-if="user.email">{{ user.email}}</div>-->
        <div class="email text-18px" v-if="user.phone">{{ user.phone}}</div>
        <div class="uid text-13px text-shallow mt-1">UID:{{ user.uid}}</div>
<!--        <router-link :to="'/setting/'+(user.email?'phone':'email')" v-if="user.uid && (!user.email || !user.phone)" class="bind card-bg text-primary text-14px flex-between pl-3 mt-3" style="height:47px">
          <img class="box20" src="@/assets/images/new/mine_safe_list.svg">
          <div class="flex1 ml-2" v-if="!user.phone">{{$t('extra.bind')}}</div>
          <div class="flex1 ml-2" v-if="!user.email">{{$t('extra.bindEmail')}}</div>
          <van-icon name="arrow"></van-icon>
        </router-link>-->

        <div class="link flex-between mt-5">
          <router-link to="/iframe/1" class="card-bg flex1 px-5 py-3 mr-3 mt-1 flex-around text-15px">
            <img class="box24" src="@/assets/images/new/mine_online.svg">
            {{$t('extra.service')}}
          </router-link>
          <router-link to="/help" class="card-bg flex1 px-5 py-3 flex-around text-15px mt-1">
            <img class="box24" src="@/assets/images/new/mine_help.svg">
            {{$t('extra.helpCenter')}}
          </router-link>
        </div>
      </div>
      <div class="cell mt-2  pb-48">
        <van-cell icon="user" icon-prefix="okcoin" @click="showSelectModal=true" icon-color="#ccc" :title="$t('app.avatar')" is-link notto="/setting/avatar" value="内容">
          <div class="flex-end height-full">
            <Img round width="24px" height="24px" class="" fit="cover" bak="icon icon-morentouxiang" :src="user.avatar" />
          </div>
        </van-cell>
        <van-cell icon="message" icon-prefix="okcoin" :title="$t('extra.msgCenter')" is-link to="/msgCenter" />
        <van-cell icon="safe" icon-prefix="okcoin" :title="$t('extra.safeCenter')" is-link to="/security" />
        <van-cell icon="safe" icon-prefix="okcoin" :title="$t('app.authentication')" is-link to="/authentication" />
        <van-cell icon="about" icon-prefix="okcoin" :title="$t('extra.about')" is-link :to="`/view?id=${aboutMsgId}`" />
        <van-cell icon="setting" icon-prefix="okcoin" :title="$t('extra.setting')" border is-link to="/setting" />
      </div>
    </div>
    <div class="px-5 pb-4">
      <div class="big-btn " @click="confirm">{{$t('app.logout')}}</div>
    </div>
    <van-action-sheet v-model="showSelectModal" close-on-click-action :cancel-text="$t('app.cancel')" :actions="[{name:$t('extra.changeAvatar')}]" :round="false" @select="changeAvatar" />
    <input type="file" hidden name="avatar" ref="avatarInput" @change="imgSelected" accept=".png,.jpg,.jpeg">
  </Layout>
</template>

<script>
import { get, call } from 'vuex-pathify'
import { Dialog } from 'vant'
import { Toast } from 'vant'
import lrz from 'lrz'
export default {
  data() {
    return {
      aboutMsgId: '',
      showSelectModal: false,
    }
  },
  computed: {
    user: get('user/info'),
  },
  watch: {
    user(newValue) {
      console.log('user', newValue)
    },
  },
  created() {
    this.updateInfo()
    // 获取关于我们中的第一条
    this.$http.get('common/getSysNoticeList?type=6').then(data => {
      this.aboutMsgId = data[0]?.id
    })
  },
  methods: {
    logout: call('user/logout'),
    updateInfo: call('user/info'),
    changeAvatar() {
      this.$refs.avatarInput.click()
    },
    async imgSelected(e) {
      const file = e.target.files[0]
      // 创建form对象
      const formdata = new FormData()
      // 尝试压缩
      try {
        const rst = await lrz(file, { width: 1080, height: 1080, quality: 0.7 })
        formdata.append('file', rst.file, file.name)
      } catch (err) {
        Toast(this.$t('app.idCardImgTip'))
        // console.log(err)
        return
      }
      Toast.loading()
      this.$http
        .api({
          method: 'post',
          url: 'user/uploadAvatar',
          headers: { 'Content-type': 'multipart/form-data' },
          data: formdata,
        })
        .then(() => {
          Toast.clear()
          Toast.success()
          this.updateInfo()
        })
        .catch(err => {
          Toast.loading()
          Toast.fail(err.msg)
        })
    },
    confirm() {
      Dialog.confirm({
        title: this.$t('app.confirmLogout'),
        cancelButtonText: this.$t('app.cancel'),
        confirmButtonText: this.$t('app.ok'),
      }).then(() => {
        this.logout()
      })
    },
  },
}
</script>

<style scoped lang="scss">
.big-btn {
  height: 48px;
  line-height: 48px;
  background: #18171c;
  color: #7c7b80;
}
</style>
