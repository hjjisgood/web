<template>
  <div>
    <div style="margin-bottom:20px;overflow:hidden;">
      <div style="width:200px;">
          <Select v-model="product_id" @on-change="change">
            <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
      </div>
    </div>
    <Table border :columns="columns" :data="dataList"></Table>
    <div style="margin-top:20px;float:right;">
      <Page :total="total" show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
    </div>
  </div>
</template>

<script>
import {
  getHis
} from './api/warehouse'
import {
  getProducts
} from './api/product'
export default {
  name: 'historical-page',
  components: {

  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      product_id: -1,
      productList: [],
      columns: [
        {
          title: '产品名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '型号',
          key: 'model'
        },
        {
          title: '操作人员',
          key: 'username'
        },
        {
          title: '数量',
          key: 'number',
          render: (h, params) => {
            var make = '入库 '
            if (params.row.entry_date == 0) {
              var make = '出库 '
            }
            return h('div', make + params.row.number)
          }
        },
        {
          title: '操作日期',
          key: 'username',
          render: (h, params) => {
            var date = params.row.entry_date
            var make = ' (入库时间)'
            if (params.row.entry_date == 0) {
              date = params.row.out_date
              var make = ' (出库时间)'
            }
            return h('div', date + make)
          }
        }
      ],
      dataList: [

      ]
    }
  },
  mounted () {
    this.getProducts()
    this.product_id = this.$route.query.product_id || -1
    // console.log(this.$route.query)
    if (this.product_id != -1) {
      this.getData()
    }
  },
  methods: {
    changePage (pageIndex) {
      this.pageIndex = pageIndex
      this.getData()
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    getData () {
      var data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        product_id: this.product_id
      }
      getHis(data).then(data => {
        if (data.status == 200) {
          this.dataList = data.data.data
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },
    getProducts () {
      var data = {
        pageIndex: 1,
        pageSize: 99999,
        keywords: ''
      }
      getProducts(data).then(data => {
        if (data.status == 200) {
          this.productList = data.data.data
        } else {
          this.productList = []
        }
      })
    },
    change () {
      this.getData()
    }
  }
}
</script>

<style>
  .pull-left{
    float: left;
  }
  .pull-right{
    float: right;
  }
</style>
