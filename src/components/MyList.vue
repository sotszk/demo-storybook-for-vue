<template>
  <ul
    :style="{
      'list-style-type': styleType,
      'color': color
    }"
  ><slot/>
  </ul>
</template>

<script>
export default {
  name: 'MyList',
  computed: {
    styleType () {
      return this.$store.state.list.styleType
    },
    color () {
      return this.$store.state.list.color
    },
  },
}
</script>

<style lang="css">
</style>
