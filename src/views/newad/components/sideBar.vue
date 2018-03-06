<style lang="less">
	.sidediv {
		position: fixed;
		top: 0;
		left: 0;
		width: 200px;
		height: 100%;
		overflow: auto;
		background: #fff;
		border-right: solid 1px #eee;
	}
	
	.sidebox {
		padding: 20px;
	}
	
	.item {
		line-height: 50px;
		color: #333;
	}
	
	.title {
		font-size: 14px;
		font-weight: bold;
	}
	
	.content {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		font-size: 14px;
		padding-left: 8px;
		line-height: 40px;
	}
	
	.content.on {
		color: #2d8cf0;
	}
	
	.content span {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}
	
	.content i {
		width: 20px;
	}
	
	.item-wait {
		color: #999;
	}
</style>

<template>
	<div class="sidediv">
		<div class="sidebox">
			<div class="item" v-for="(item,index) in current">
				<div v-if="index > step[0]">
					<div class="title item-wait">{{item.name}}</div>
					<div class="item-wait" v-for="(subitem,subindex) in item.list">
						<div class="content">
							<span>{{subitem.name}}</span>
						</div>
					</div>
				</div>
				<div v-else-if="index == step[0]">
					<div class="title">{{item.name}}</div>
					<div v-for="(subitem,subindex) in item.list">
						<div class="content" v-if="subindex< step[1]" @click="navigation(index,subindex)">
							<span>{{subitem.name}}</span>
							<i class="more"><Icon type="android-done"></Icon></i>
						</div>
						<div class="content on" v-else-if="subindex== step[1]">
							<span>{{subitem.name}}</span>
							<i class="more"><Icon type="more"></Icon></i>
						</div>
						<div class="content item-wait" v-else>
							<span>{{subitem.name}}</span>
						</div>
					</div>
				</div>
				<div v-else>
					<div class="title">{{item.name}}</div>
					<div v-for="(subitem,subindex) in item.list">
						<div class="content" @click="navigation(index,subindex)">
							<span>{{subitem.name}}</span>
							<i class="more"><Icon type="android-done"></Icon></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'sideBar',
		props: ['value'],
		data() {
			return {
				step: [0, 0],
				current: [{
					'name': '推广计划',
					'list': [{
						'name': '推广计划'
					}]
				}, {
					'name': '广告',
					'list': [{
						'name': '定向'
					}, {
						'name': '广告版位'
					}, {
						'name': '排期和出价'
					}]
				}, {
					'name': '广告创意',
					'list': [{
						'name': '上传创意'
					}]
				}]
			}
		},
		watch: {
			value() {
				this.step = this.value;
			}
		},
		methods: {
			navigation(index,subindex) {
				let step=[index,subindex];
				this.$emit('input', step);
			}
		}
	}
</script>