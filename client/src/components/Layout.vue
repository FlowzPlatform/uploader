<template>
  <div>
    <Row >
      <f-header></f-header>
              <div class="f-layout-content">
                <div class="f-layout-content-main">
                  <router-view></router-view>
                </div>
              </div>
              <f-footer></f-footer>
    </Row>
  </div>
</template>

<script>
// eslint-disable
import Header from './Header'
import Footer from './Footer'
export default {
  name: 'app',
  components: {
    'f-header': Header,
    'f-footer': Footer
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
<style>
</style>
