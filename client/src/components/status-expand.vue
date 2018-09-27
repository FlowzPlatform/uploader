<template>
    <div>
        <div>
          <Table :columns="tcols" :data="calculateData" stripe border class="tableclass"></Table>
        </div>
        <div style="float:right; padding-top:10px;">
          <Page :page-size="5" :total="tdata.length" @on-change="handleChange"></Page>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    row: Object
  },
  data () {
    return {
      tcols: [{
        title: 'SKU',
        key: 'sku',
        className: 'list-color'
      }, {
        title: 'Error',
        key: '',
        className: 'list-color',
        render: (h, params) => {
          // console.log(params.row)
          let abc = []
          for (let item of params.row.error) {
            abc.push(h('li', item.Reason))
          }
          return h('ul', abc)
        }
      }],
      tdata: [],
      mdata: [],
      page: 1
    }
  },
  computed: {
    calculateData () {
      return this.mdata[this.page - 1]
    }
  },
  methods: {
    handleChange (page) {
      this.page = page
    }
  },
  mounted () {
    // console.log('this.row', this.row)
    if (this.row.asiError !== undefined) {
      this.tdata = this.row.asiError
      this.mdata = _.chunk(this.tdata, 5)
    }
  },
  feathers: {
    'product-sync': {
      created (data) {
      }
    }
  }
}
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    
</style>
<style>
  .list-color {
      color: #a94442;
      padding: 10px;
      background-color: #fff !important;
    }
</style>