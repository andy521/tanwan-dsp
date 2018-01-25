<style>
	.Treebox {
		max-height: 400px;
	}
</style>
<template>
	<Poptip placement="bottom-start" width="400">
		<Input class="sel" v-model="search" @on-change="changeSearch" icon="arrow-down-b" placeholder="全部"></Input>
		<div class="api" slot="content">
			<div class="Treebox">
				<Tree :data="newlist" show-checkbox @on-check-change="changeTree"></Tree>
			</div>
		</div>

	</Poptip>
</template>

<script>
	export default {
		name: 'searchTree',
		props: ['callback'],
		data() {
			return {
				search: '',
				visible: false,
				newlist: [],
				ids: []
			}
		},
		mounted() {
			this.$store.dispatch('getGameList');
		},
		methods: {
			//搜索关键字
			changeSearch() {
				let list = this.gameList,
					newlist = [];
				list.forEach((item, i) => {
					let children = [],
						len = 0;
					item.children.forEach(item => {
						let newv = {
							title: item.title,
							game_id: item.game_id,
							game_byname: item.game_byname,
							expand: true
						}
						if(item.title.indexOf(this.search.trim()) >= 0) {
							children.push(newv);
							len++;
						}
					});
					let newitem = {
						title: item.title,
						top: item.top,
						expand: true,
						children: children
					}
					if(len > 0) newlist.push(newitem);

				});
				this.newlist = newlist;
			},
			//点击树节点时触发
			changeTree(data) {
				var ids = [],
					name = '';
				data.forEach(item => {
					if(item.game_byname) {
						ids.push(item.game_id);
						name = item.title + ' / ' + name;
					}
				})
				this.ids = ids;
				this.search = name;
				this.callback(ids);
			}
		},
		watch: {
			gameList(newlist) {
				this.newlist = newlist;
			}
		},
		computed: {
			//获取游戏列表
			gameList() {
				let list = this.$store.state.plan.gameList;
				let newlist = [];
				list.forEach((item, i) => {
					let children = [];
					item.game.forEach(item => {
						let newv = {
							title: item.game_name,
							game_id: item.game_id,
							game_byname: item.game_byname,
							expand: true
						}
						children.push(newv)
					});
					let newitem = {
						title: item.name,
						top: item.top,
						expand: true,
						children: children
					}
					newlist.push(newitem)
				});
				this.newlist = newlist;
				return newlist;
			}
		}
	}
</script>

<style>

</style>