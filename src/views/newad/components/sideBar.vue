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
	
	.title a {
		font-size: 14px;
		font-weight: bold;
		color: #333;
	}
	
	.content a {
		font-size: 14px;
		padding-left: 8px;
		line-height: 40px;
		color: #666;
	}
</style>

<template>


		<div class="sidediv">
			<div class="sidebox">
				<Timeline>
					<TimelineItem>
						<p class="title">
							<a href="#">推广计划</a>
						</p>
						<p class="content">
							<a href="#">推广目标</a>
						</p>
						<p class="content">
							<a href="#">计划设置</a>
						</p>
					</TimelineItem>
					<TimelineItem>
						<p class="title">
							<a href="#">广告</a>
						</p>
						<p class="content">
							<a href="#">定向</a>
						</p>
						<p class="content">
							<a href="#">广告版位</a>
						</p>
						<p class="content">
							<a href="#">排期和出价</a>
						</p>
					</TimelineItem>
					<TimelineItem>
						<p class="title">
							<a href="#">广告创意</a>
						</p>
						<p class="content">
							<a href="#">上传创意</a>
						</p>
					</TimelineItem>
				</Timeline>
			</div>
		</div>


</template>

<script>
	export default {
		name: 'sideBar',
		data() {
			return {

			}
		}

	}
</script>

<style>

</style>