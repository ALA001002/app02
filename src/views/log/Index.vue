<template>
  <div id="log-page">
    <p v-for="(item,index) in logData" v-bind:key="index">{{item}}</p>
  </div>
</template>

<script>
  import { call,get } from 'vuex-pathify'
  export default {
    data(){
      return {}
    },
    mounted() {
    },
    computed:{
      logData: get('log/data')
    },
    methods:{
      ...call({
        addLog: 'log/addLog',
      }),
    }
  }
</script>

<style>
  #log-page{
    z-index: 1000;
    display: block;
    position: fixed;
    width: 50%;
    height: 500px;
    color: white;
    background: rgba(0,0,0,0.5);
  }
  p{
    word-break: break-all;
  }
</style>
