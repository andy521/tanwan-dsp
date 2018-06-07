import Axios from "@/api/index"

const setid = {
	state: {
		MessagesData: {
			read_count: {},
			message: []
		}, //系统消息
        SingleMessages: {}, //系统消息详情  
	},
	mutations: {
		GET_MESSAGES(state, data) {
			state.MessagesData = data;
		},
		GET_SINGLEMESSAGES(state, data) {
			state.SingleMessages = data;
		}
	},
	actions: {
		//获取系统消息
		getMessages({
			commit
		}) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'get_messages'
			}).then(res => {
				commit('GET_MESSAGES', res.data)
			}).catch(
				err => {
					console.log('获取系统消息' + err)
				}
			)
		},
		//获取系统消息详情
		getSingleMessages({
			commit
		}, id) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'get_single_message',
				id: id
			}).then(res => {
				commit('GET_SINGLEMESSAGES', res.data)
			}).catch(
				err => {
					console.log('获取系统消息详情' + err)
				}
			)
		},

	}
};

export default setid;