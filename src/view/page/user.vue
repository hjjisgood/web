<template>
  <div>
    <div style="margin-bottom:20px;">
      <div>
        <Button type="primary" @click="showModel">新建用户</Button>
      </div>
    </div>
    <Table border :columns="columns" :data="dataList"></Table>
    <div style="margin-top:20px;float:right;">
      <Page :total="total" show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
    </div>
    <Modal v-model="modal"  title="新增" :mask-closable="false" @on-ok="ok" :loading="loading">
        <div>
          <Form :model="formItem" label-position="right" :label-width="100" :rules="rules" ref="Form">
            <FormItem label="姓名"  prop="userName">
                <Input v-model="formItem.userName"></Input>
            </FormItem>
            <FormItem label="密码"  prop="password">
                <Input v-model="formItem.password" type="password"></Input>
            </FormItem>
            <FormItem label="角色">
                <Select v-model="formItem.role">
                  <Option value="普通员工">普通员工</Option>
                  <Option value="超级管理员">超级管理员</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUser,
  createUser,
  delUser
} from './api/user'
export default {
  name: 'user-page',
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      modal: false,
      formItem: {
        userName: '',
        password: '',
        role: '普通员工'
      },
      loading: true,
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password:
            [
              { required: true, message: '密码不能为空', trigger: 'blur' }
            ]

      },
      columns: [
        {
          title: '姓名',
          key: 'username'
        },
        {
          title: '角色',
          key: 'role'
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
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '确定删除吗？',
                      onOk: () => {
                        this.delUser(params.row.id)
                      }
                    })
                  }
                }
              }, '删除用户')
            ])
          }
        }
      ],
      dataList: [

      ]
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    changePage (pageIndex) {
      this.pageIndex = pageIndex
      this.getUser()
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.getUser()
    },
    showModel () {
      this.modal = true
      this.formItem.userName = ''
      this.formItem.password = ''
    },
    ok () {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.createUser()
          this.modal = false
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    getUser () {
      var data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      getUser(data).then(data => {
        if (data.status == 200) {
          this.dataList = data.data.data
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },
    createUser () {
      createUser(this.formItem).then(data => {
        if (data.status == 200) {
          this.$Message.success('新增成功')
          this.getUser()
        } else {
          this.$Message.error('服务器错误')
        }
      })
    },
    delUser (id) {
      delUser({ id: id }).then(data => {
        if (data.status == 200) {
          this.$Message.success('删除成功')
          this.getUser()
        } else {
          this.$Message.error('服务器错误')
        }
      })
    }
  }
}
</script>

<style>

</style>
