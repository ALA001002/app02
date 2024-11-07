<template>
  <Layout>
    <div class="section pb-1 has-text-centered header" slot="header">
      <span class="has-text-weight-bold is-size-6">{{ $t("app.community") }}</span>
    </div>
    <van-tabs
      title-active-color="#377DFF"
      title-inactive-color="#999999"
      color="#377DFF"
      :border="false"
      :line-width="'20%'"
      :line-height="3"
      background="transparent"
      class="hero"
    >
<!--      <van-tab :title="$t('app.news')">-->
<!--        <News />-->
<!--      </van-tab>-->
      <van-tab :title="$t('app.article')">
        <Article />
      </van-tab>
      <van-tab :title="$t('app.newbie')" v-if="!config.shequFlag">
        <Newbie />
      </van-tab>
    </van-tabs>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import Article from '@/views/community/Article.vue'
import Newbie from '@/views/community/Newbie.vue'
import News from '@/views/community/News.vue'
import {get} from 'vuex-pathify'
export default {
  components: { Layout, Article, Newbie, News },
  computed:{
    config: get('bgConfig'),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep {
  .hero {
    height: 100%;
  }
  .van-tabs__content {
    flex-grow: 1;
    flex-basis: 0;
    overflow: auto;
    background-color: white;
  }
}
</style>
