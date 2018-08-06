<template>
    <div class="pdmlist">
        <Table :loading="productListLoading" :columns="columns" :data="productList" no-data-text="Products Not Found"></Table>
        <Page class="pull-right" style="margin-top:10px;" :total="tdata.length" show-total :page-size="pageSize" :current="currentPage" @on-change="changePage"></Page>
    </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'pdmlist',
  data () {
    return {
      vid: '1dee7d8d-d06a-475c-a4f5-e548a3709610',
      columns: [
        {
          title: '_id',
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
    async init () {
      let url = 'http://172.16.230.161:3038/pdm'
      this.tdata = await axios.get(url, {
        params: {
          source: 'sku'
        },
        headers: {
          vid: this.vid
        }
      }).then(async (res) => {
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
      }).catch(err => {
        console.log('Error while getting products::', err)
        this.productListLoading = false
        return []
      })
      this.tdata = _.sortBy(this.tdata, [function (o) { return o.sku }])
      this.productList = await this.makeChunk(this.currentPage, this.pageSize)
      this.productListLoading = false
      // console.log(this.tdata)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.pdmlist {
  padding: 40px;
}
</style>