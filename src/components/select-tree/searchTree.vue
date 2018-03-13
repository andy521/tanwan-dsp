<style scoped>
	.Treebox {max-height: 400px;}
    .ivu-poptip, .ivu-poptip-rel,.ivu-poptip .ivu-input-wrapper{display: block}
</style>
<template>
	<Poptip placement="bottom-start" width="400">
		<Input class="sel" v-model.trim.lazy="search" @on-change="changeSearch" icon="arrow-down-b"  placeholder="全部产品"></Input>
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
        props: {
            game : Array,
            clearable : Boolean,

        },
		data() {
			return {
				search: '',
				visible: false,
				newlist: [],
                ids: [],
                gameData:[],
			}
        },

        watch: {
            game(val){
                this.gameData = val;
                this.createTree()
            },
            clearable(val){
                console.log(val)
                if(!!val){
                    this.search = '';
                    this.createTree();
                }
            }
		},
		methods: {
            //创建树菜单
            createTree(){
                let newlist = [];
				this.gameData.forEach((item, i) => {
					let children = [];
					item.game.forEach(item => {
						let newv = {
							title: item.game_name,
							game_id: item.game_id,
							game_byname: item.game_byname,
							expand: false
						}
						children.push(newv)
					});
					let newitem = {
						title: item.name,
						top: item.top,
						expand: false,
						children: children
					}
					newlist.push(newitem)
                });
                this.newlist = newlist;
            },
			//搜索关键字
			changeSearch() {
                console.log(this.search)
                let filterGame = [],                    
                    text = new RegExp("" + this.search + "", "gmi");

                this.newlist.forEach( (item,i) =>{
                    if(item.title.search(text) != -1){
                        filterGame.push(item)
                    }
                    //子无元素搜索
                    // item.children.forEach( val => {
                    //     if(val.title.search(text) != -1){
                    //         filterGame.push(val)
                    //     }    
                    // })
                });                
                if(filterGame.length != 0){
                    this.newlist = filterGame;
                }else{
                    this.createTree();
                };
			},
			//点击树节点时触发
			changeTree(data) {
				let ids = [],
					name = '';
				data.forEach(item => {
					if(item.game_byname) {
						ids.push(item.game_id);
						name = item.title + ' / ' + name;
					}
				})
				this.ids = ids;
                this.search = name;
                this.$emit('on-change', ids);
			}
        }
	}
</script>