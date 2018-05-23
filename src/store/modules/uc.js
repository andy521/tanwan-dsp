const uc = {
  state: {
    planCache: {},
    unitCache: {}
  },
  mutations: {
    SAVE_UC_PLAN_CACHE(state, cache) {
      state.planCache = cache
    },
    SAVE_UC_UNIT_CACHE(state, cache) {
      state.unitCache = cache
    }
  }
}

export default uc
