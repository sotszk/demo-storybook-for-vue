<template>
  <div>
    <h1>Top</h1>
    <hr>
    <div>
      <h2>Components</h2>
      <h3>MyButton</h3>
      <MyButton
        @event-click="changeListColor"
      >I change the color</MyButton>
      <MyButton
        @event-click="changeListStyleType"
      >I change the list style type</MyButton>
      <h3>MyList</h3>
      <MyList>
        <li>Buy something useful for yourself</li>
        <li>Go to the bargen on Sunday</li>
      </MyList>
    </div>
  </div>
</template>

<script>
import MyButton from './../components/MyButton'
import MyList from './../components/MyList'

export default {
  name: 'Top',

  components: {
    MyButton,
    MyList,
  },

  methods: {
    changeListStyleType () {
      const currentType = this.$store.state.list.styleType
      const newType = currentType === 'disc' ? 'decimal' : 'disc'
      this.$store.dispatch('changeListStyleType', newType)
    },

    changeListColor () {
      let newColor
      const num = Math.random() * 100
      if (num <= 25) {
        newColor = 'blue'
      } else if (num <= 50) {
        newColor = 'red'
      } else if (num <= 75) {
        newColor = 'orange'
      } else {
        newColor = 'black'
      }
      this.$store.dispatch('changeListColor', newColor)
    },
  },
}
</script>

<style>

</style>
