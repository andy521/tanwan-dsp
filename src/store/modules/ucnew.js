import Axios from '@/api/index';

const ucnew = {
  state: {
    accountId: "", // 当前用户id
    campaignId: "", // 推广计划id
    adgroupId: "", // 推广单元id
    creativeId: "", // 推广创意id
    videoId: "", // 视频id
  },
  mutations: {
    SAVE_ACCOUNT_ID(state, id) {
      state.accountId = id;
    }
  }
};

export default ucnew;