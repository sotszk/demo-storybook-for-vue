<template>
  <div id="app">
    <my-navbar/>
    <router-view/>
  </div>
</template>

<script>
import MyNavbar from './components/MyNavbar'

export default {
  name: 'app',
  components: {
    MyNavbar,
  },
}
</script>

<style>
</style>
