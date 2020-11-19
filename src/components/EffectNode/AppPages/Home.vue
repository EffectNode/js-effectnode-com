<template>
  <div ref="kv">
    <!--  -->
  </div>
</template>

<script>
import { KeyVisual } from '../AppParts/Home/KeyVisual'
export default {
  mounted () {
    new KeyVisual({ el: this.$refs.kv })
  }
}
</script>

<style>

</style>