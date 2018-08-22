<template>
  <div class="pdmlist">
    <Row type="flex" align="middle">
      <Col span="16">
        <h3>Product List</h3>  
      </Col>
      <Col span="8">
        <AutoComplete :disabled="productListLoading" icon="ios-search" @on-search="handleSearch" @on-select="searchProduct" :clearable="true" style="margin-bottom:10px;" placeholder="Search product name">
          <Option v-for="item in searchOptions" :value="item.product_name" :key="item.product_id">{{ item.product_name }}</Option>
        </AutoComplete>
      </Col>
    </Row>
    <Table :loading="productListLoading" :columns="columns" :data="productList" no-data-text="Products Not Found"></Table>
    <Page v-if="paginate" class="pull-right" style="margin-top:10px;" :total="tdata.length" show-total :page-size="pageSize" :current="currentPage" @on-change="changePage"></Page>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import config from '../config'
export default {
  name: 'pdmlist',
  data () {
    return {
      vid: null,
      columns: [
        {
          title: 'ID',
          key: '_id'
        },
        {
          title: 'Product Name',
          key: 'product_name'
        },
        {
          title: 'SKU',
          key: 'sku'
        },
        {
          title: 'Action',
          key: '',
          render: (h, params) => {
            let self = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'edit'
                },
                on: {
                  click () {
                    self.$router.push('/pdm/' + params.row._id)
                  }
                }
              }, 'Edit')
            ])
          }
        }
      ],
      tdata: [],
      productList: [],
      productListLoading: true,
      searchOptions: [],
      paginate: true,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    async changePage (pageNo) {
      this.productList = await this.makeChunk(pageNo, this.pageSize)
    },
    async makeChunk (pageNo, size) {
      let chunk = []
      for (let i = (pageNo - 1) * size; i < size + (pageNo - 1) * size; i++) {
        if (this.tdata[i] !== undefined) {
          await chunk.push(this.tdata[i])
        }
      }
      return chunk.slice()
    },
    async handleSearch (value) {
      let self = this
      if (value !== '') {
        this.searchOptions = await this.tdata.filter(function (item) {
          if (item.product_name.toLowerCase().includes(value.toLowerCase())) {
            return item
          }
        })
      } else {
        this.searchOptions = []
        this.paginate = true
        this.productList = await this.makeChunk(self.currentPage, self.pageSize)
      }
    },
    async searchProduct (value) {
      if (value !== '') {
        this.productList = await this.tdata.filter(function (item) {
          if (item.product_name.toLowerCase().includes(value.toLowerCase())) {
            return item
          }
        })
        this.paginate = false
      }
    },
    async init () {
      let url = config.pdmUrl + '/pdm'
      // 'http://172.16.230.161:3038/pdm'
      this.tdata = await axios.get(url, {
        params: {
          source: 'sku'
        },
        headers: {
          vid: this.vid
        }
      }).then(async (res) => {
        // console.log('>>>>', res)
        return axios.get(url, {
          params: {
            $limit: res.data.hits.total
          },
          headers: {
            vid: this.vid
          }
        }).then(res => {
          return _.map(res.data.hits.hits, (item) => {
            let iitem = item._source
            iitem._id = item._id
            return iitem
          })
        })
        // console.log('resp: ', res)
      }).catch(err => { // eslint-disable-line
        // console.log('Error while getting products::', err)
        this.$Notice.error({
          title: 'Getting product list',
          desc: 'Please refresh page and try again.'
        })
        this.productListLoading = false
        return []
      })
      this.tdata = _.sortBy(this.tdata, [function (o) { return o.sku }])
      this.productList = await this.makeChunk(this.currentPage, this.pageSize)
      this.productListLoading = false
      // console.log(this.tdata)
    }
  },
  async mounted () {
    let url = config.pdmUrl + '/vshop-list?all=1&supplier=true'
    this.pdata = await axios.get(url).then(res => {
      this.$cookie.set('vid', res.data[0].id)
      this.vid = res.data[0].id
    }).catch(err => { // eslint-disable-line
      this.$Notice.error({
        title: 'Can\'t find vshop id',
        desc: 'Please refresh page and try again.'
      })
      // console.log('Error while getting vid', err)
    })
    this.init()
  }
}
</script>

<style>
.pdmlist {
  padding: 40px;
}

.ivu-auto-complete.ivu-select-dropdown {
  max-height: 250px!important;
}
</style>