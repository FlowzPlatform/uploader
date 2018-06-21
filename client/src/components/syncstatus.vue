<template>
  <div class="syncstatus">
    <Row>
      <Col :span="20">
        <h1>Sync Status</h1>
      </Col>
      <Col :span="4">
        <div v-if="vid !== ''" style="float:right;">
          <Button type="primary" icon="android-sync" shape="circle" @click="handleResync">re-sync</Button>
        </div>
      </Col>
    </Row>
    <hr>
    <div v-if="isresync" style="padding:10px;text-align:right">
      <!-- <div style="font-size:12px;">Select ASI configuration</div> -->
      <Select v-model="asiValue" multiple style="width:260px" filterable  placeholder="Select Credential" @on-change="asiHandleChange">
          <Option v-for="item in asiconfig" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <span v-if="isnotValid" style="font-size:12px;color:red;">! credintial must required.</span>
      <Button type="success" shape="circle" @click="handleresyncProceed">Proceed</Button>
    </div>
    <hr v-if="isresync">
    <div style="padding-top:10px;">
      <Table :loading="loading" stripe :columns="statusCols" :data="statusData" class="tableclass"></Table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import Cookies from 'js-cookie'
import productSyncModel from '@/api/product-sync'
import asconfigModel from '@/api/asconfiguration'
import _ from 'lodash'
import moment from 'moment'
import expandRow from './status-expand.vue'

export default {
  name: 'syncstatus',
  components: { expandRow },
  data () {
    return {
      loading: false,
      isresync: false,
      asiconfig: [],
      asiValue: [],
      isnotValid: false,
      statusCols: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'Id',
          key: 'id',
          align: 'center'
        },
        {
          title: 'Sync On',
          key: 'syncOn',
          align: 'center'
        },
        {
          title: 'Credential',
          key: 'asiConfig',
          align: 'center',
          render: (h, params) => {
            let finx = _.findIndex(this.asiconfig, {id: params.row.asiConfig})
            if (finx !== -1) {
              console.log(finx, this.asiconfig[finx].name)
              return h('div', this.asiconfig[finx].name)
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: 'Date',
          key: 'createdOn',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('ll'))
          }
        },
        {
          title: 'Status',
          key: 'asiStatus',
          align: 'center'
        },
        {
          title: 'Total Records',
          key: 'total',
          align: 'center',
          width: 120
        },
        {
          title: 'Progress',
          key: 'no-product-process',
          align: 'center',
          render: (h, params) => {
            let total = params.row.total
            if (params.row.total === undefined) {
              total = 1
            }
            let perc = (params.row['no-product-process'] * 100) / total
            perc = perc.toString().split('.')
            return h('i-circle', {
              props: {
                percent: parseInt(perc[0])
              },
              style: {
                width: '50px',
                height: '50px'
              }
            }, [
              h('span', {
                // class: {
                //   'demo-Circle-inner': true
                // },
                // style: {
                //   fontSize: 6
                // }
              }, perc[0] + '%')
            ])
          }
        }
      ],
      statusData: [],
      vid: ''
    }
  },
  methods: {
    asiHandleChange (value) {
      if (value.length > 0) {
        this.isnotValid = false
      } else {
        this.isnotValid = true
      }
      // console.log('value', value)
    },
    handleResync () {
      // alert()
      this.isresync = !this.isresync
      // productSyncModel.post({
      //   asiStatus: 'initiated',
      //   asiError: [],
      //   syncOn: 'ASI',
      //   vid: this.vid,
      //   'no-product-process': 0
      // }).then(resp => {
      //   self.$Notice.success({title: 're-sync Started', duration: 3})
      // }).catch(err => {
      //   console.log('Error: ', err)
      //   self.$Notice.error({title: 'Network Error', duration: 3})
      // })
    },
    handleresyncProceed () {
      // let self = this
      if (this.asiValue.length > 0) {
        this.isnotValid = false
      } else {
        this.isnotValid = true
      }
      if (!this.isnotValid) {
        this.$Modal.confirm({
          title: 'Confirm',
          content: '<b>Are you sure you want resync the data?</b>',
          loading: true,
          onOk: async() => {
            for (let item of this.asiValue) {
              await productSyncModel.post({
                asiConfig: item,
                asiStatus: 'initiated',
                asiError: [],
                syncOn: 'ASI',
                vid: this.vid,
                'no-product-process': 0
              }).then(resp => {
                this.$Notice.success({title: 're-sync Started'})
              }).catch(err => {
                console.log('Error: ', err)
                this.$Notice.error({title: 'Network Error'})
              })
            }
            this.$Modal.remove()
          },
          onCancel: () => {
            this.isresync = false
            this.isnotValid = false
          }
        })
      }
    }
  },
  async mounted () {
    let token = Cookies.get('auth_token')
    if (token !== undefined && token !== '') {
      // console.log('this.$store.state.token', token)
      this.loading = true
      await asconfigModel.get({
        userID: this.$store.state.user._id,
        type: 'asi'
      }).then(result => {
        console.log('result', result)
        this.asiconfig = result.data.data
      }).catch(e => {
      })
      await axios.get(config.vshopUrl).then(async res => {
        // console.log('Resp', res.data)
        if (res.data.length > 0) {
          this.vid = res.data[0].id
          productSyncModel.get({
            vid: this.vid,
            '$sort[cretedOn]': -1
          }).then(resp => {
            // console.log(resp)
            this.statusData = _.filter(resp.data.data, {syncOn: 'ASI'})
            this.loading = false
          }).catch(errr => {
            this.loading = false
            console.log('Error', errr)
          })
        }
      }).catch(err => {
        this.loading = false
        console.log('Error ::', err)
      })
    }
  },
  feathers: {
    'product-sync': {
      created (data) {
        console.log('Created ............', data)
        if (data.vid === this.vid && data.syncOn === 'ASI') {
          let finx = _.findIndex(this.statusData, {id: data.id})
          if (finx === -1) {
            this.statusData.splice(0, 0, data)
          }
        }
      },
      updated (data) {
        console.log('Updated..............', data)
        if (data.vid === this.vid && data.syncOn === 'ASI') {
          console.log('Match')
          let finx = _.findIndex(this.statusData, {id: data.id})
          if (finx !== -1) {
            this.statusData.splice(finx, 1, data)
          }
        }
      },
      removed (data) {
        console.log('Removed..............', data)
      }
    }
  }
}
</script>

<style>
  .tableclass .ivu-table-body table {width: 100% !important;}
  .tableclass .ivu-table-body table td .ivu-table-cell-expand {width: 100%; text-align: center;}
  .tableclass .ivu-table .ivu-table-tip {overflow-x: hidden;}
</style>
<style scoped>
.syncstatus {
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