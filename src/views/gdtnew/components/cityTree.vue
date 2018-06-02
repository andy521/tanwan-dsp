<style scoped>
.ds_box {
  padding: 20px 30px;
}

.ds_tag {
  overflow: auto;
  max-height: 200px;
  margin-bottom: 20px;
}

.ds_tag p {
  font-weight: bold;
}

.citytree {
  background: #fff;
  border: solid 1px #eee;
  padding: 15px;
  max-height: 200px;
  overflow: auto;
}
</style>

<template>
	<div>
		<Row>
			<Col span="12">
			<Select v-model="searchcity" filterable remote :remote-method="remoteMethod1" :loading="loading" @on-change="changesearchcity" placeholder="搜索省、市">
				<Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
			</Select>
			</Select>
			</Col>
		</Row>
		<Tree class="margin-top-10 citytree" :data="citylist" show-checkbox @on-check-change="changeTree"></Tree>
	</div>
</template>

<script>
	export default {
		name: 'cityTree',
		props: ['value', 'callback'],
		data() {
			return {
				searchcity: '',
				list: [],
				options: [],
				loading: false,
				citylist: [],
				ids: []
			}
		},
		mounted() {

		},
		watch: {
			ids(ids) {
				this.$emit('input', ids)
			},
			value() {},
			targeting_tags() {},
		},
		methods: {
			//点击树节点时触发
			changeTree(data) {
				var ids = [],
					name = '';
				data.forEach(item => {
					if(!item.children) {
						ids.push(item.label);
					}
				})
				this.ids = ids;
			},
			changesearchcity(val) {
				this.callback(val)
			},
			remoteMethod1(query) {
				if(query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						const list = this.list.map(item => {
							return {
								value: item.value,
								label: item.label
							};
						});
						this.options = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
					}, 200);
				} else {
					this.options = [];
				}
			},
		},
		computed: {
			targeting_tags() {
				let list = this.$store.state.newad.targeting_tags;
				let newlist = [];
				let sellist = [];
				list.forEach((item, i) => {
					let children = [];
					let expand = false;
					item.list.forEach(item => {
						var check = false;
						if(this.value) {
							this.value.forEach(v => {
								if(v == item.id) {
									expand = true
									check = true;
								}
							})
						}
						let newitem = {
							title: item.name,
							label: item.id,
							expand: true,
							checked: check
						}
						children.push(newitem);
						sellist.push({
							label: item.name,
							value: item.id,
						})
					});
					let newitem = {
						title: item.name,
						label: item.id,
						expand: expand,
						children: children
					}
					newlist.push(newitem);

				});
				this.list = sellist;
				this.citylist = newlist;
				return newlist;
			}
		}
	}
</script>