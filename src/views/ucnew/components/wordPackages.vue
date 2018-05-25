<style>
.btn-action{
  margin-right: 5px;
  cursor: pointer;
  color: #2b7ed1;
}
</style>
<style scoped>
.packagetree{
  width: 520px;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
}
.word-panel{
  min-width: 180px;
  max-width: 300px;
  max-height: 350px;
  overflow: auto;
}
.ivu-modal-footer {
  display: none
}
</style>
<template>
  <div class="packagetree">
    <Table :columns="packageColumns" :data="wordPackageList" border></Table>
    <Modal v-model="isCheck" title="所有词" :mask-closable="true" width="300">
      <div class="word-panel">
        <p v-for="(word, i) in detailWordlist" :key="i">{{word}}</p>
      </div>
    </Modal>
  </div>
</template>
<script>
import Axios from '@/api/index'
export default {
  name: 'ProvinceTree',
  data() {
    return {
      wordPackageList: [],
      isCheck: false,
      detailWordlist: [],
      packageColumns: [
        {
          title: '包名',
          key: 'packageName',
          minWidth: 80
        },
        {
          title: '默认词',
          key: 'defaultWord',
          minWidth: 80
        },
        {
          title: '覆盖量',
          key: 'converageRate',
          minWidth: 80,
          render: (h, params) => {
            return [
              h('span', `${params.row.converageRate}%`)
            ]
          }
        },
        {
          title: '类型',
          key: 'packageTypeDesc',
          minWidth: 80
        },
        {
          title: '操作',
          key: '',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return [
              h('span', {
                class: 'btn-action',
                on: {
                  click: () => {
                    const word = {
                      packageName: `{${params.row.packageName}}`,
                      defaultWord: params.row.defaultWord,
                      isDisable: true
                    }
                    this.$emit('on-select', word)
                  }
                }
              }, '添加'),
              h('span', {
                class: 'btn-action',
                on: {
                  click: () => {
                    this.detailWordlist = params.row.detailWords
                    this.isCheck = true
                  }
                }
              }, '查看'),
            ]
          }
        },
      ]
    }
  },
  mounted() {
    this.getWordPackage()
  },
  methods: {
    checkAllGroupChange (data) {
      console.log(data, typeof data)
    },
    getWordPackage() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getWordPackage',
        account_id: this.$route.query.account
      })
        .then(res => {
          if (res.ret === 1) {
            this.wordPackageList = res.data.wordPackages
            console.log('获取动态词包接口', this.wordPackageList)
          }
        })
        .catch(err => {
          console.log('获取动态词包接口错误：' + err)
        })
    }
  }
}
</script>
