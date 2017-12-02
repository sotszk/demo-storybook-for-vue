<template>
  <button
    type="button"
    :name="name"
    @click="handleClick"
  ><slot/>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    name: String,
  },
  methods: {
    handleClick (e) {
      this.$emit('event-click', e)
    },
  },
}
</script>

<style lang="css">
button {
  color: #fff;
  background-color: #3d70b2;
  border: 0;
  border-radius: 0;
  padding: .5em 1em;
}
</style>
