import Vuex from 'vuex'

import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withNotes } from '@storybook/addon-notes'
import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  color,
} from '@storybook/addon-knobs'
import Centered from '@storybook/addon-centered'
import StoryRouter from 'storybook-router'

import Welcome from './../components/Welcom.vue'
import MyButton from './../components/MyButton.vue'
import MyNavbar from './../components/MyNavbar.vue'
import MyList from './../components/MyList.vue'

const Top = {
  template: `<div>Top</div>`,
}

const About = {
  template: `<div>About</div>`,
}

storiesOf('Welcom', module)
  .addDecorator(Centered)
  .add('with Links', () => ({
    components: {
      Welcome,
      MyButton,
    },
    template: `
      <div>
        <Welcome/>
        <MyButton @event-click="toNavbar">to MyNavbar</MyButton>
        <MyButton @event-click="toButton">to MyButton</MyButton>
        <MyButton @event-click="toList">to MyList</MyButton>
        <MyButton @event-click="toKnobs">to Knobs</MyButton>
      </div>
    `,
    methods: {
      toNavbar: linkTo('MyNavbar'),
      toButton: linkTo('MyButton'),
      toList: linkTo('MyList'),
      toKnobs: linkTo('Addon Knobs'),
    },
  }))

storiesOf('MyNavbar', module)
  .addDecorator(Centered)
  .addDecorator(StoryRouter({}, {
    routes: [
      { path: '/', component: Top },
      { path: '/about', component: About },
    ],
  }))
  .add('with Story Router', () => ({
    components: { MyNavbar },
    template: `
      <div>
        <MyNavbar/>
        <router-view/>
      </div>
    `,
  }))


storiesOf('MyButton', module)
  .addDecorator(Centered)
  .add('with method + Action', () => ({
    components: { MyButton },
    template: `
      <div>
        <p>Notice an ACTION LOGGER tab on the bottom of your page</p>
        <MyButton @event-click="log">Action!</MyButton>
      </div>
    `,
    methods: {
      log (e) {
        e.preventDefault()
        action('log1')('clicked!')
      },
    },
  }))
  .add('with Notes',
    withNotes({
      text: `
      <h1>Heading</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore illo ea obcaecati deserunt pariatur provident, magnam assumenda velit ad, perspiciatis neque ratione veritatis ab, itaque eligendi dolor sit fugit qui.</p>
      `,
    })(() => ({
      components: { MyButton },
      template: `
        <div>
          <p>Notice a NOTES tab on the bottom of your page</p>
          <MyButton>Nothing happens</MyButton>
        </div>
      `,
    })))

storiesOf('MyList', module)
  .addDecorator(Centered)
  .add('with MyButton + Vuex', () => ({
    components: {
      MyButton,
      MyList,
    },
    template: `
      <div>
        <MyButton @event-click="changeListColor">Change Color</MyButton>
        <MyButton @event-click="changeListStyleType">Change List Style Type</MyButton>
        <MyList>
          <li>LIST ITEM 1</li>
          <li>LIST ITEM 2</li>
          <li>LIST ITEM 3</li>
        </MyList>
      </div>
    `,
    store: new Vuex.Store({
      state: {
        list: {
          styleType: 'disc',
          color: 'black',
        },
      },
      actions: {
        changeListStyleType (context, type) {
          context.commit('setListStyleType', type)
        },
        changeListColor (context, color) {
          context.commit('setListColor', color)
        },
      },
      mutations: {
        setListStyleType (state, type) {
          state.list.styleType = type
        },
        setListColor (state, color) {
          state.list.color = color
        },
      },
    }),
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
  }))

storiesOf('Addon Knobs', module)
  .addDecorator(Centered)
  .addDecorator(withKnobs)
  .add('in a simple way', () => {
    const label = text('Label', 'Octcat')
    return {
      components: { MyButton },
      template: `
        <div>
          <p>You can change the button label by touching widgets in a KNOBS tab.</p>
          <MyButton>${label}</MyButton>
        </div>
      `,
    }
  })
  .add('with various knobs', () => {
    const label = text('Label', 'Octcat')
    const textColor = color('Color', '#3d70b2')
    const isAwesome = boolean('Is awesome', true)
    const fontSize = number('Size', 24, {
      range: true,
      min: 10,
      max: 100,
      step: 0.5,
    })
    const items = array('Items', ['Kindle voyage', 'Macbook Pro 15', 'Quiet Control 30'])
    return {
      template: `
        <div>
          <h1
            style="color: ${textColor}; font-size: ${fontSize}px"
          >${label} ${isAwesome ? 'is awesome!' : 'is awful.'}</h1>
          <ul>
            ${items.map((item, index) => `<li key="${index}">${item}</li>`).join('')}
          </ul>
        </div>
      `,
    }
  })
