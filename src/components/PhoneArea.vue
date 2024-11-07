<template>
  <div class="section">
    <span @click='show=true'>
      <!--      {{ area.areaCode }} {{ area.country }}-->
      {{ area.areaCode }}
      <van-icon name="arrow-down" />
    </span>
    <van-popup v-model="show" round position="bottom">
      <van-picker show-toolbar :cancel-button-text="$t('extra.cancel')" :confirm-button-text="$t('extra.confirm')" :columns="columns" :default-index="select" @confirm="onConfirm" @cancel="show = false" />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      areas: [],
      show: false,
      select: 0,
    }
  },
  created() {
    this.load()
  },
  computed: {
    columns() {
      // return this.areas.map(p => p.areaCode + ' ' + p.country)
      return this.areas.map(p => p.areaCode)
    },
    area() {
      if (this.areas) {
        return this.areas[this.select] || {}
      }
      return {}
    },
  },
  watch: {
    area: {
      handler(val) {
        this.$emit('select', val)
      },
    },
  },
  methods: {
    load() {
      this.$http.get('common/countryList').then(data => {
        this.areas = data
      })
    },
    onConfirm(v, i) {
      this.select = i
      this.show = false
    },
  },
}
</script>

