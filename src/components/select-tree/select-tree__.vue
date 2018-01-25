
<style>
    .tree-area{padding: 10px;}
    .ts{color: red; font-weight: bold;}
</style>
<template>
    <i-select  multiple :placeholder="value" >
        <div class="tree-area">
            <Input v-model="searchVal" placeholder="搜索游戏">
                <Button slot="append" @click="searchFun" icon="ios-search"></Button>
            </Input>
            <Tree :data="data" multiple @on-select-change="checkChange"></Tree>   
        </div>           
    </i-select>
</template>

<script>
// <select-tree :gameList="game"></select-tree>
import game from './gamelist.js';
export default {
    props: {
        gameList: Array,        
    },
    name: 'selectTree', 
    data(){
        return {
            searchVal:"",
            getGameList:[],
            value : ' ',
            data : [],            
        }
    },
    watch: {  
        //获取父级传过来的游戏
        gameList (data) {            
            //this.data = data;
            //this.data = this.createTree(data)     
        }
    },
    methods : {
        searchFun(){
            let filterGame = [],
                text = new RegExp("" + this.searchVal + "", "gmi");
            let  str = 'aacccaabb'
            console.log(  str.search(text)  ) 
            this.data.forEach(function(val){
                if(val.title.search(text) != -1){
                    filterGame.push(val)
                }
            });
            if(filterGame.length == 0){
                this.$Message.warning('没有找到 <span class="ts">' + this.searchVal + ' </span>相关数据');
            }else{
                this.data = filterGame;
            }         
        },
        checkChange(data){
            let selectVal = [],
                selectName = [];
            data.forEach(function(val){
                let opt ={};
                opt.label = val.game_id;
                opt.value = val.title;
                selectName.push(val.title)
                selectVal.push(opt)
               
            });
            this.value = selectName.join(" ");
            console.log(this.value) 
        },
        createTree(data){
            let gameData = [];
            game.forEach(function(value,key,arr){
                let g={};
                g.title = value.name;
                g.expand = false; 
                g.selected = false;
                g.game_id = value.top;
                if(value.game.length > 0){
                    let gitem = [];                    
                    value.game.forEach(element => {                    
                        gitem.push({'title':element.game_name,'game_id':element.game_id,'game_byname':element.game_byname})
                    });
                    g.children = gitem
                }
                gameData.push(g)           
            });
            return gameData;
        }
    },
    mounted(){
        let games = this.createTree(game)
        this.data = games;
    }

};
</script>
