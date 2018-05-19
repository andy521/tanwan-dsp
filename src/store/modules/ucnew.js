import Axios from '@/api/index';

const ucnew = {
  state: {
    planCache: {},
    unitCache: {}
  },
  mutations: {
    SAVE_PLAN_CACHE(state, cache) {
      state.planCache = cache;
    },
    SAVE_UNIT_CACHE(state, cache) {
      state.unitCache = cache;
    }
  }
};

export default ucnew;