<template>
  <div class="syncstatus">
    <h1>Sync Status</h1>
    <hr>
    <div style="padding-top:10px;">
      <Table :loading="loading" stripe :columns="statusCols" :data="statusData"></Table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import Cookies from 'js-cookie'
import productSyncModel from '@/api/product-sync'
import _ from 'lodash'
import moment from 'moment'
import expandRow from './status-expand.vue'

export default {
  name: 'syncstatus',
  components: { expandRow },
  data () {
    return {
      loading: false,
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
          title: 'Date',
          key: 'createdOn',
          align: 'center',
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
          align: 'center'
        },
        {
          title: 'Progress',
          key: 'no-product-process',
          align: 'center',
          render: (h, params) => {
            let total = params.row.total
            if (params.row.total === undefined) {
              total = 0
            }
            let perc = (params.row['no-product-process'] * 100) / total
            return h('i-circle', {
              props: {
                percent: perc
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
              }, perc + '%')
            ])
          }
        }
      ],
      statusData: [],
      vid: ''
    }
  },
  mounted () {
    let token = Cookies.get('auth_token')
    if (token !== undefined && token !== '') {
      // console.log('this.$store.state.token', token)
      this.loading = true
      axios.get(config.vshopUrl).then(res => {
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
  }
}
</script>

<style scoped>
	.syncstatus {
		padding: 40px;
	}
</style>