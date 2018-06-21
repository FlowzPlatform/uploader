<template>
    <div>
        <Row class="expand-row">
            <div class="schema-form ivu-table-wrapper">
              <div class="ivu-table ivu-table-border">
                  <div class="ivu-table-body">
                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                          <colgroup>
                              <col width="25">
                                  <col width="75">
                          </colgroup>
                          <thead>
                              <tr>
                                  <th class="">
                                      <div class="ivu-table-cell">
                                          <span>SKU</span>
                                      </div>
                                  </th>
                                  <th class="">
                                      <div class="ivu-table-cell">
                                          <span>Error</span>
                                      </div>
                                  </th>
                              </tr>
                          </thead>
                          <tbody class="ivu-table-tbody">
                              <tr v-if="row.asiError.length > 0" class="ivu-table-row" v-for="(item, index) in row.asiError">
                                  <td class="">
                                      <div class="ivu-table-cell">
                                        <span class="list-color">{{item.sku}}</span>
                                      </div>
                                  </td>
                                  <td class="">
                                      <div class="ivu-table-cell">
                                        <ul class="" v-for="err in item.error">
                                          <li class="list-color">{{err.Reason}}</li>
                                        </ul>
                                      </div>
                                  </td>
                              </tr>
                              <tr v-else>
                                <td style="text-align:center;" colspan="2">No Data</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
            </div>
        </Row>
    </div>
</template>

<script>
    export default {
      props: {
        row: Object
      },
      data () {
        return {
        }
      },
      mounted () {
        console.log('this.row', this.row)
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
    .list-color {
      color: #a94442;
    }
</style>