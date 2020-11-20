<template>
  <div class="full">
    <div class="full absolute top-0 left-0" ref="kv1"></div>
    <div class="absolute top-0 left-0 text-white" v-if="getApp">
      GUI
    </div>
  </div>
</template>

<script>
import { KeyVisual } from '../Packages/Home/KeyVisual'
export default {
  data () {
    return {
      getApp: false
    }
  },
  mounted () {
    let _kv = new KeyVisual({ el: this.$refs.kv1 })
    this.getApp = () => _kv
    console.log(_kv)
  },
  beforeDestroy () {
    window.location.reload()
  }
}
</script>

<style>
</style>
