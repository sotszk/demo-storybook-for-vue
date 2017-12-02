import { configure } from '@storybook/vue'

import Vue from 'vue'
import Vuex from 'vuex'

import MyButton from './../src/components/MyButton.vue'

Vue.use(Vuex)

Vue.component('MyButton', MyButton)

function loadStories () {
  require('./../src/stories')
}

configure(loadStories, module)
