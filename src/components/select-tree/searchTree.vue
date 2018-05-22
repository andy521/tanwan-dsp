<style scoped>
.Treebox {
  max-height: 400px;
  overflow: auto;
}
</style>
<template>
    <Poptip placement="bottom-start" trigger="hover">
        <Button type="ghost">选择游戏({{ids.length==0?"不限":ids.length}})</Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Input class="sel" v-model="search" clearable @on-change="changeSearch" placeholder="全部游戏"></Input>
                </div>
                <div class="Treebox">
                    <Tree :data="new_game_list" show-checkbox @on-check-change="changeTree"></Tree>
                </div>
            </Card>
        </div>
    </Poptip>
</template>
<script>
import Axios from "@/api/index"
export default {
    name: "searchTree",
    data() {
        return {
            ids: [],
            search: "",
            game_list: [],
            new_game_list: [],
        }
    },
    mounted() {
        this.getGame();
    },
    methods: {
        //获取全部游戏     
        getGame() {
            Axios.post("api.php", {
                action: "api",
                opt: "getGameLists"
            }).then(res => {
                if (res.ret == "1") {
                    this.createTree(res.data);
                }
            }).catch(err => {
                console.log(err)
            });
        },
        //创建树菜单
        createTree(data) {
            let newlist = [];
            data.forEach((item, i) => {
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
            this.new_game_list = newlist;
            this.game_list = newlist;
        },
        //搜索关键字
        changeSearch() {
            let list = this.game_list,
                newlist = [];
            list.forEach((item, i) => {
                let children = [],
                    len = 0;
                item.children.forEach(item => {
                    let newv = {
                        title: item.title,
                        game_id: item.game_id,
                        game_byname: item.game_byname
                    }
                    if (item.title.indexOf(this.search.trim()) >= 0) {
                        children.push(newv);
                        len++;
                    }
                });
                let newitem = {
                    title: item.title,
                    top: item.top,
                    expand: this.search == "" ? false : true,
                    children: children
                }
                if (len > 0) newlist.push(newitem);

            });
            this.new_game_list = newlist;
        },
        //点击树节点时触发
        changeTree(data) {
            let ids = [];
            data.forEach(item => {
                if (item.game_byname) {
                    ids.push(item.game_id);
                }
            })
            this.ids = ids;
            this.$emit('on-change', ids);
        }
    }
}
</script>