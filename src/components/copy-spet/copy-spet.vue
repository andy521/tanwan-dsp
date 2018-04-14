<template>
    <span></span>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "copySpet",
    data() {
        return {
            id: ""
        };
    },
    mounted() {
        this.check_author_tasck();
    },
    methods: {
        //查询用户是否有执行的任务
        check_author_tasck() {
            var that = this;
            Axios.get("api.php", {
                action: "adData",
                opt: "check_author_tasck"
            })
                .then(res => {
                    if (res.ret == 1 && res.data.id) {
                        this.id = res.data.id;
                    }
                })
                .catch(err => {
                    console.log("查询用户是否有执行的任务" + err);
                });
            setTimeout(function() {
                that.check_author_tasck();
            }, 10000);
        }
    },
    watch: {
        id() {
            if (this.id == "") return;
            //任务进度查询
            Axios.get("api.php", {
                action: "adData",
                opt: "tasck_update",
                id: this.id
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Notice.open({
                            title: res.msg,
                            duration: 0
                        });
                    }
                })
                .catch(err => {
                    console.log("任务进度查询" + err);
                });
        }
    }
};
</script>
