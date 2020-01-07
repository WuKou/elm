<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav :side="true" :data="goods" :options="scrollOptions" v-if="goods.length">
        <template v-slot:bar="props">
          <cube-scroll-nav-bar direction="vertical" :labels="props.labels" :txts="barTxts" :current="props.current">
            <template v-slot="props">
              <div class="text">
                <support-ico v-if="props.txt.type >= 1" :size="3" :type="props.txt.type"></support-ico>
                <span>{{ props.txt.name }}</span>
                <span class="num" v-if="props.txt.count"><bubble :count="props.txt.count"></bubble></span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel v-for="item in goods" :key="item.name" :label="item.name" :title="item.name">
          <ul>
            <li v-for="food in item.foods" :key="food.name" @click="selectFood(food)" class="food-item border-bottom-1px">
              <div class="icon"><img :src="food.icon" width="57" height="57" /></div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc" v-show="food.description">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cart-control-wrapper"><cart-control :food="food" @add="onAdd"></cart-control></div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <shop-cart
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
      ref="shopCart"></shop-cart>
    </div>
  </div>
</template>

<script>
import SupportIco from 'components/support-ico/support-ico'
import Bubble from 'components/bubble/bubble'
import ShopCart from 'components/shop-cart/shop-cart'
import CartControl from 'components/cart-control/cart-control'
import { getGoods } from 'api'

export default {
  name: 'Goods',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      goods: [],
      scrollOptions: {
        click: false,
        directionLockThreshold: 0
      },
      selectedFood: {}
    }
  },
  computed: {
    seller() {
      return this.data.seller
    },
    selectFoods() {
      let list = []
      this.goods.forEach(good => {
        good.foods.forEach(item => {
          if (item.count) {
            list.push(item)
          }
        })
      })
      return list
    },
    barTxts() {
      let ret = []
      this.goods.forEach(good => {
        const { type, name, foods } = good // 对象的解构赋值写法
        let count = 0
        foods.forEach(food => {
          count += food.count || 0
        })
        ret.push({
          type,
          name,
          count
        })
      })
      return ret
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    }
  },
  methods: {
    fetch() {
      // 如果已经fetch过，就不用再fetch
      if (!this.fetched) {
        this.fetched = true
        getGoods({
          id: this.seller.id
        }).then(goods => {
          this.goods = goods
        })
      }
    },
    selectFood(food) {
      this.selectedFood = food
      this._showFood()
      this._showShopCartSticky()
    },
    _showFood() {
      this.foodComp =
        this.foodComp ||
        this.$createFood({
          $props: {
            food: 'selectedFood', // 不能用this.selectedFood，这样显示的都是同一个food
            totalCount: 'totalCount'
          },
          $events: {
            add: target => {
             this.shopCartStickyComp.drop(target)
            },
            leave: () => {
              this._hideShopCartSticky()
            }
          }
        })
      this.foodComp.show()
    },
    onAdd(target) {
      this.$refs.shopCart.drop(target)
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
          selectFoods: 'selectFoods',
          deliveryPrice: this.seller.deliveryPrice,
          minPrice: this.seller.minPrice,
          fold: true
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    }
  },
  components: {
    SupportIco,
    Bubble,
    ShopCart,
    CartControl
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
@import '~common/stylus/variable'

.goods
  position relative
  text-align left
  height 100%
  .scroll-nav-wrapper
    position absolute
    width 100%
    top 0
    left 0
    bottom 48px
  >>> .cube-scroll-nav-bar
    width 80px
    white-space normal
    overflow hidden
  >>> .cube-scroll-nav-bar-item
    padding 0 10px
    display flex
    align-items center
    height 56px
    line-height 14px
    font-size $fontsize-small
    background $color-background-ssss
    .text
      flex 1
      position relative
    .num
      position absolute
      right -8px
      top -10px
    .support-ico
      display inline-block
      vertical-align top
      margin-right 4px
  >>> .cube-scroll-nav-bar-item_active
    background $color-white
    color $color-dark-grey
  >>> .cube-scroll-nav-panel-title
    padding-left 14px
    height 26px
    line-height 26px
    border-left 2px solid $color-col-line
    font-size $fontsize-small
    color $color-grey
    background $color-background-ssss
  .food-item
    display flex
    margin 18px
    padding-bottom 18px
    position relative
    &:last-child
      border-none()
      margin-bottom 0
    .icon
      flex 0 0 57px
      margin-right 10px
    .content
      flex 1
      .name
        margin 2px 0 8px 0
        height 14px
        line-height 14px
        font-size $fontsize-medium
        color $color-dark-grey
      .desc, .extra
        line-height 10px
        font-size $fontsize-small-s
        color $color-light-grey
      .desc
        line-height 12px
        margin-bottom 8px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        width 47%
      .extra
        .count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size $fontsize-medium
          color $color-red
        .old
          text-decoration line-through
          font-size $fontsize-small-s
          color $color-light-grey
      .cart-control-wrapper
        position absolute
        right 0
        bottom 10px
  .food-wrapper
    position absolute
    top 0
    bottom 48px
    left 0
    right 0
  .shop-cart-wrapper
    position absolute
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
</style>
