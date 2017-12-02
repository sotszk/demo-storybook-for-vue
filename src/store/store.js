const DEFAULT_LIST_STYLE_TYPE = 'disc'

const DEFAULT_LIST_COLOR = 'blue'

export default {
  state: {
    list: {
      styleType: DEFAULT_LIST_STYLE_TYPE,
      color: DEFAULT_LIST_COLOR,
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
}
