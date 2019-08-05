<template>
  <div>
    <div style="margin-bottom:20px;overflow:hidden;">
      <div class="pull-left">
        <Button type="primary" @click="showModel">新建产品</Button>
      </div>
      <div class="pull-right">
         <Input suffix="ios-search" placeholder="Enter text" style="width: auto" v-model="keywords" @on-keyup.enter="getData"/>
      </div>
    </div>
    <Table border :columns="columns" :data="dataList"></Table>
    <div style="margin-top:20px;float:right;">
      <Page :total="total" show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
    </div>
    <Modal v-model="modal"  :title="modalType" :mask-closable="false" @on-ok="ok" :loading="loading">
        <div>
          <Form :model="formItem" label-position="right" :label-width="100" :rules="rules" ref="Form">
            <FormItem label="产品名称"  prop="name">
                <Input v-model="formItem.name"></Input>
            </FormItem>
            <FormItem label="类型" prop="type">
                <Input v-model="formItem.type"></Input>
            </FormItem>
            <FormItem label="型号" prop="model">
                <Input v-model="formItem.model"></Input>
            </FormItem>
            <FormItem label="图片">
              <div v-if="imgList.length>0">
                <ImgPreview  width="120" height="120" :list="imgList"></ImgPreview>
              </div>
              <div>
                  <Upload action="" ref="upload"
                      :before-upload="uploadImage"
                      :format=" ['jpg','jpeg','png']"
                      >
                      <Button icon="ios-cloud-upload-outline">上传图片</Button>
                  </Upload>
              </div>
            </FormItem>
          </Form>
        </div>
    </Modal>
  </div>
</template>

<script>
import ImgPreview from '@/components/img-preview'
import {
  getProducts,
  createProduct,
  editProduct,
  upload
} from './api/product'
export default {
  name: 'product-page',
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
      modalType: '新增',
      rowId: -1,
      imgList: [],
      formItem: {
        name: '',
        type: '',
        model: '',
        image: ''

      },
      loading: true,
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        type:
            [
              { required: true, message: '产品类型不能为空', trigger: 'blur' }
            ],
        model:
            [
              { required: true, message: '产品型号不能为空', trigger: 'blur' }
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
          title: '图片',
          key: 'image',
          width: 150,
          render: (h, params) => {
            // console.log(params)
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
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.modalType = '编辑'
                    this.rowId = params.row.id
                    this.formItem = {
                      name: params.row.name,
                      type: params.row.type,
                      model: params.row.model,
                      image: params.row.image
                    }
                    this.imgList = [this.imgBaseUrl + params.row.image]
                    this.modal = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      dataList: [

      ]
    }
  },
  mounted () {
    this.getData()
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
      this.modalType = '新增'
      this.modal = true
      this.imgList = []
      this.formItem = {
        name: '',
        type: '',
        model: '',
        image: ''
      }
    },
    ok () {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (this.modalType == '新增') {
            this.createProduct()
          } else {
            this.editProduct()
          }

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
      getProducts(data).then(data => {
        if (data.status == 200) {
          this.dataList = data.data.data
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },
    createProduct () {
      createProduct(this.formItem).then(data => {
        if (data.status == 200) {
          this.$Message.success('新增成功')
          this.getData()
        } else {
          this.$Message.error('服务器错误')
        }
      })
    },
    editProduct (id) {
      var data = this.formItem
      data.id = this.rowId
      editProduct(data).then(data => {
        if (data.status == 200) {
          this.$Message.success('编辑成功')
          this.getData()
        } else {
          this.$Message.error('服务器错误')
        }
      })
    },
    uploadImage (event) {
      var formData = new FormData()
      formData.append('file', event, event.name)
      upload(formData).then(res => {
        if (res.status == 200) {
          var url = this.imgBaseUrl + res.data.url
          this.formItem.image = res.data.url
          this.imgList = [url]

          // console.log(this.imgList)
        } else {
          this.$Message.error('服务器错误')
        }
      })
      return false
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
