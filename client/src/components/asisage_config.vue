<template>
  <div class="asisageconfig">
    
    <Row>
      <div style="border: 1px solid #C0C0C0;padding: 20px;">
        <h1>ASI
          <span style="float:right;">
            <Button type="primary" shape="circle" size="small" icon="plus" @click="handleAdd('asi')">Add</Button>
          </span>
        </h1>
        <hr>
        <div style="padding-top:20px;">
          <Table :loading="loading" stripe :columns="asiCols" :data="asiData" class="tableclass"></Table>
        </div>
      </div>
      <div style="border: 1px solid #C0C0C0;padding: 20px;margin-top:40px;">
        <h1>SAGE
          <span style="float:right;">
            <Button type="primary" shape="circle" size="small" icon="plus" @click="handleAdd('sage')">Add</Button>
          </span>
        </h1>
        <hr>
        <div style="padding-top:20px;">
          <Table :loading="loading" stripe :columns="sageCols" :data="sageData"  class="tableclass"></Table>
        </div>
      </div>
    </Row>
  </div>
</template>

<script>
import asconfigurationModel from '@/api/asconfiguration'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'asisageconfig',
  data () {
    return {
      loading: false,
      asiCols: [
        {
          title: 'Name',
          key: 'name',
          align: 'center'
        },
        {
          title: 'ASI Number',
          key: 'number',
          align: 'center'
        },
        {
          title: 'Date',
          key: 'createdAt',
          align: 'center',
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('ll'))
          }
        },
        {
          title: 'User',
          key: 'user',
          align: 'center'
        },
        {
          title: 'Password',
          key: 'password',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isShow ? params.row.password : ''),
              h('span', '   '),
              h('a', {
                on: {
                  'click': () => {
                    this.asiData[params.index].isShow = !this.asiData[params.index].isShow
                  }
                }
              }, params.row.isShow ? 'hide' : 'view')
            ])
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            // let self = this
            return h('div', [
              h('Tooltip', {
                props: {
                  content: 'Edit',
                  placement: 'left'
                }
              }, [
                h('a', {
                  class: {
                    'iconlink': true
                  },
                  on: {
                    click: () => {
                      this.$router.push('/settings/asi/' + params.row.id)
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'compose'
                    },
                    class: {
                      'iconCustom': true,
                      'editb': true
                    }
                  })
                ], '')
              ]),
              h('Tooltip', {
                props: {
                  content: 'Delete',
                  placement: 'right'
                }
              }, [
                h('a', {
                  class: {
                    'iconlink': true
                  },
                  on: {
                    click: () => {
                      let self = this
                      // let userId = Cookies.get('userDetailId')
                      this.$Modal.confirm({
                        title: 'Confirm',
                        content: '<p>Are you sure you want to Delete?</p>',
                        loading: true,
                        onOk: function () {
                          asconfigurationModel.delete(params.row.id).then(res => {
                            self.$Modal.remove()
                            self.asiData.splice(params.index, 1)
                            self.$Notice.success({title: 'Success!', desc: 'Successfully Deleted.', duration: 3})
                          }).catch(err => {
                            console.log('Error', err)
                            self.$Modal.remove()
                            self.$Notice.error({title: 'Error!', desc: 'Not Deleted.', duration: 3})
                          })
                        }
                      })
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'trash-b'
                    },
                    class: {
                      'iconCustom': true,
                      'deleteb': true
                    }
                  })
                ], '')
              ])
            ])
          }
        }
      ],
      asiData: [],
      sageCols: [
        {
          title: 'Name',
          key: 'name',
          align: 'center'
        },
        {
          title: 'SAGE Number',
          key: 'number',
          align: 'center'
        },
        {
          title: 'Date',
          key: 'createdAt',
          align: 'center',
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('ll'))
          }
        },
        {
          title: 'User',
          key: 'user',
          align: 'center'
        },
        {
          title: 'Password',
          key: 'password',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isShow ? params.row.password : ''),
              h('span', '   '),
              h('a', {
                on: {
                  'click': () => {
                    this.sageData[params.index].isShow = !this.sageData[params.index].isShow
                  }
                }
              }, params.row.isShow ? 'hide' : 'view')
            ])
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            // let self = this
            return h('div', [
              h('Tooltip', {
                props: {
                  content: 'Edit',
                  placement: 'left'
                }
              }, [
                h('a', {
                  class: {
                    'iconlink': true
                  },
                  on: {
                    click: () => {
                      this.$router.push('/settings/sage/' + params.row.id)
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'compose'
                    },
                    class: {
                      'iconCustom': true,
                      'editb': true
                    }
                  })
                ], '')
              ]),
              h('Tooltip', {
                props: {
                  content: 'Delete',
                  placement: 'right'
                }
              }, [
                h('a', {
                  class: {
                    'iconlink': true
                  },
                  on: {
                    click: () => {
                      let self = this
                      // let userId = Cookies.get('userDetailId')
                      this.$Modal.confirm({
                        title: 'Confirm',
                        content: '<p>Are you sure you want to Delete?</p>',
                        loading: true,
                        onOk: function () {
                          asconfigurationModel.delete(params.row.id).then(res => {
                            self.$Modal.remove()
                            self.sageData.splice(params.index, 1)
                            self.$Notice.success({title: 'Success!', desc: 'Successfully Deleted.', duration: 3})
                          }).catch(err => {
                            console.log('Error', err)
                            self.$Modal.remove()
                            self.$Notice.error({title: 'Error!', desc: 'Not Deleted.', duration: 3})
                          })
                        }
                      })
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'trash-b'
                    },
                    class: {
                      'iconCustom': true,
                      'deleteb': true
                    }
                  })
                ], '')
              ])
            ])
          }
        }
      ],
      sageData: []
    }
  },
  methods: {
    handleAdd (type) {
      // console.log(type)
      this.$router.push('/settings/' + type)
    }
  },
  mounted () {
    console.log('this.$store.state.user', this.$store.state.user)
    if (this.$store.state.user._id !== undefined) {
      this.loading = true
      asconfigurationModel.get({
        userID: this.$store.state.user._id,
        '$sort[createdAt]': -1
      }).then(res => {
        _.map(res.data.data, (d) => {
          d.isShow = false
        })
        this.asiData = _.filter(res.data.data, {type: 'asi'})
        this.sageData = _.filter(res.data.data, {type: 'sage'})
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log('Error', err)
        this.$Notice.error({title: 'Network Error'})
      })
    }
  }
}
</script>

<style>
  .iconCustom {
    font-size: 27px;
    color: slategray;
    /*margin-right: 5px; */
  }
  .iconlink {
    display: inline-block;
    padding: 2px 7px;
    /*border-radius: 5px; */
  }
  .editb:hover {
    color: #2d8cf0;
  }
  .deleteb:hover {
    color: red;
  }

  .tableclass .ivu-table-body table {width: 100% !important;}
  .tableclass .ivu-table-body table td .ivu-table-cell-expand {width: 100%; text-align: center;}
  .tableclass .ivu-table .ivu-table-tip {overflow-x: hidden;}
</style>
<style scoped>
.asisageconfig {
  padding: 40px;
}
.tableclass{
  text-align: center !important;
  /*overflow: inherit !important;*/
}
.tableclass th{
  text-align: center !important;
}
.ivu-table-body {
  overflow: inherit !important;
}
</style>
