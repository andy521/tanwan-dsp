import Axios from '@/api/index';

const ucnew = {
  state: {
    steps: [0, 0]
  },
  mutations: {
    SAVE_STEP(state, steps) {
      state.steps = steps
    }
  }
};

export default ucnew;