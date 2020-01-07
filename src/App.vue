<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
  </div>
</template>

<script>
// 不可取名为v-header，不可以有‘-’
import VHeader from 'components/v-header/v-header'
import Tab from 'components/tab/tab'
import Goods from 'components/goods/goods'
import Seller from 'components/seller/seller'
import Ratings from 'components/ratings/ratings'
import { getSeller } from 'api' // 为什么路径这样写就可以？
import qs from 'query-string'

export default {
  data() {
    return {
      seller: {
        id: qs.parse(location.search).id
      }
    }
  },
  computed: {
    tabs() {
      return [
        {
          label: '商品',
          component: Goods,
          // 直接写成data: this.seller 就不行，获取不到数据，为什么？
          data: {
            seller: this.seller
          }
        },
        {
          label: '评价',
          component: Ratings,
          data: this.seller
        },
        {
          label: '商家',
          component: Seller,
          data: this.seller
        }
      ]
    }
  },
  created() {
    this._getSeller()
    // console.log(this.tabs[0].data)
    // console.log(this.tabs[0].data.seller.name) 困惑，为什么这两句都获取不到seller数据？
  },
  methods: {
    // _getSeller也不是完全懂，之后再好好研究
    _getSeller() {
      getSeller({
        id: this.seller.id
      }).then((seller) => {
        this.seller = Object.assign({}, this.seller, seller) // 什么意思？
        // this.seller = seller
      })
    }
  },
  components: {
    VHeader,
    Tab
  }
}
</script>

<style lang="stylus">
.tab-wrapper
  position fixed
  top 136px
  bottom 0
  left 0
  right 0
</style>
