<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <Loan class="section py-0"></Loan>
  </Layout>
</template>
<script>
import Loan from './Repayment.vue'

export default {
  components: { Loan },
}
</script>