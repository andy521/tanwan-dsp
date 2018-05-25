const bd = {
  state: {
    planCache: {},
    unitCache: {}
  },
  mutations: {
    SAVE_BD_PLAN_CACHE(state, cache) {
      state.planCache = cache
    },
    SAVE_BD_UNIT_CACHE(state, cache) {
      state.unitCache = cache
    }
  }
}
export default bd
