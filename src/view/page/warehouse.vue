<template>
  <div>
    <div style="margin-bottom:20px;overflow:hidden;">
      <div class="pull-left">
        <Button type="primary" @click="showModel">新产品入库</Button>
      </div>
      <div class="pull-right">
         <Input suffix="ios-search" placeholder="Enter text" style="width: auto" v-model="keywords" @on-keyup.enter="getData"/>
      </div>
    </div>
    <Table border :columns="columns" :data="dataList"></Table>
    <div style="margin-top:20px;float:right;">
      <Page :total="total" show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
    </div>
    <Modal v-model="modal"  title="新增" :mask-closable="false" @on-ok="ok" :loading="loading">
        <div>
          <Form :model="formItem" label-position="right" :label-width="100" :rules="rules" ref="Form">
            <FormItem label="选择产品"  prop="product_id">
                <Select v-model="formItem.product_id">
                  <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="入库数量" prop="number">
                <Input v-model="formItem.number" type="number"></Input>
            </FormItem>
          </Form>
        </div>
    </Modal>

    <Modal v-model="modal1"  :title="modalOutIn" :mask-closable="false" @on-ok="go" :loading="loading">
        <div>
          <Form :model="formItem1" label-position="right" :label-width="100" :rules="rules" ref="Form1">
            <FormItem label="仓库数量">
              <p>
                 {{rowData.number}}
              </p>
            </FormItem>
            <FormItem :label="modalOutIn+'数量'" prop="number">
                <Input v-model="formItem1.number" type="number"></Input>
            </FormItem>
          </Form>
        </div>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment'
import ImgPreview from '@/components/img-preview'
import {
  getProducts
} from './api/product'
import {
  getWarehouse,
  newIn,
  setWarehouse
} from './api/warehouse'
export default {
  name: 'warehouse-page',
  components: {
    ImgPreview
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      keywords: '',
      modal: false,
      modal1: false,
      modalOutIn: '入库',
      rowData: { nubmer: 0 },
      dataList: [],
      productList: [],
      formItem: {
        product_id: -1,
        number: 0
      },
      formItem1: {
        number: 0
      },
      loading: true,
      rules: {
        product_id: [
          { required: true, message: '选择产品不能为空', trigger: 'change', type: 'number' }
        ],
        number:
            [
              { required: true,
                message: '数量不能小于0',
                trigger: 'blur',
                type: 'number',
                validator: (rule, value, callback) => {
                  if (value < 0) {
                    return callback(new Error('数量不能小于0'))
                  } else if (value == '') {
                    return callback(new Error('数量不能为空'))
                  } else {
                    callback()
                  }
                }
              }
            ]

      },
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
          title: '库存',
          key: 'number'
        },
        {
          title: '最后操作时间',
          key: 'last_date'
        },
        {
          title: '最后操作人',
          key: 'username'
        },
        {
          title: '图片',
          key: 'image',
          width: 150,
          render: (h, params) => {
            if (params.row.image == '') {
              return h('div', '')
            } else {
              return h('div', [
                h(ImgPreview, {
                  props: {
                    weight: '30',
                    height: '30',
                    list: [this.imgBaseUrl + params.row.image]
                  }
                })
              ])
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 210,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                style: {
                  marginRight: '10px'
                },
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.inOrOut('in', params.row)
                  }
                }
              }, '入库'),
              h('Button', {
                style: {
                  marginRight: '10px'
                },
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.inOrOut('out', params.row)
                  }
                }
              }, '出库'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/historical/historical_page',
                      query: { product_id: params.row.product_id }
                    })
                  }
                }
              }, '历史详情')

            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.getData()
    this.getProducts()
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
    showModel () {
      this.modal = true
      this.formItem = {
        product_id: '',
        number: ''
      }
    },
    ok () {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.newIn()

          this.modal = false
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    getData () {
      var data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keywords: this.keywords
      }
      getWarehouse(data).then(data => {
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
    newIn () {
      var data = this.formItem
      data.last_date = moment().format('YYYY-MM-DD HH:mm:ss')
      data.last_operator = this.$store.state.user.userId

      newIn(this.formItem).then(data => {
        if (data.data.state == 1) {
          this.$Message.success(data.data.message)
          this.getData()
        } else {
          this.$Message.error(data.data.message)
        }
      })
    },
    inOrOut (type, params) {
      this.formItem1.number = 0
      this.modal1 = true
      this.rowData = params
      if (type == 'in') {
        this.modalOutIn = '入库'
      } else {
        this.modalOutIn = '出库'
      }
    },
    go () {
      this.$refs.Form1.validate((valid) => {
        if (valid) {
          this.setWarehouse()
          this.modal1 = false
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    setWarehouse () {
      // console.log(this.rowData)
      var data = {
        product_id: this.rowData.product_id,
        operator: this.$store.state.user.userId,
        out_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        entry_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        operator_num: this.formItem1.number
      }
      if (this.modalOutIn == '入库') {
        data.number = parseInt(this.rowData.number) + parseInt(this.formItem1.number)
        data.type = 'in'
      } else {
        data.type = 'out'
        // console.log(this.rowData-this.formItem1.number)
        if (this.rowData.number - this.formItem1.number < 0) {
          this.$Message.error('出库数量不能大于仓库数量')
          return false
        } else {
          data.number = this.rowData.number - this.formItem1.number
        }
      }

      setWarehouse(data).then(data => {
        if (data.status == 200) {
          this.$Message.success(data.data.message)
          this.getData()
        } else {
          this.$Message.error('服务器错误')
        }
      })
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
