<template>
    <div class="pdmlist">
        <Table :columns="columns" :data="tdata"></Table>
    </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'pdmlist',
  data () {
    return {
      vid: 'b00ef491-d25e-4f50-9327-299bc78e5789',
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
      tdata: []
    }
  },
  methods: {
    async init () {
      let url = 'https://api.flowzcluster.tk/pdmnew/pdm'
      this.tdata = await axios.get(url, {
        headers: {
          vid: this.vid
        }
      }).then(res => {
        return _.map(res.data.hits.hits, (item) => {
          let iitem = item._source
          iitem._id = item._id
          return iitem
        })
        // console.log('resp: ', res)
      }).catch(err => {
        console.log('err', err)
        return []
      })
      console.log(this.tdata)
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