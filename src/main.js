import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import routes from './router/routes'
import myStore from './store/store'
import App from './App.vue'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  routes,
});
const store = new Vuex.Store(myStore);

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
})
