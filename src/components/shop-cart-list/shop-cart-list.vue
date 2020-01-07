<template>
  <transition name="fade">
    <cube-popup position="bottom" type="shop-cart-list" v-show="visible" @mask-click="hideMask">
      <transition class="move" @after-leave="afterLeave">
        <!-- transition动画需要触发条件，比如v-show值的改变 -->
        <div class="shop-cart-list" v-show="visible">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="clear" @click="clear">清空</span>
            </div>
            <ul>
              <cube-scroll class="list-content" ref="listContent">
              <li class="item border-bottom-1px" v-for="(item, index) in selectFoods" :key="index">
                <span>{{ item.name }}</span>
                <div class="price">
                  <span>￥{{ item.price * item.count }}</span>
                </div>
                <!-- 是@add 而不是@click -->
                <div class="cart-control-wrapper"><cart-control :food="item" @add="add"></cart-control></div>
              </li>
              </cube-scroll>
            </ul>
        </div>
      </transition>
    </cube-popup>
  </transition>
</template>

<script>
import CartControl from 'components/cart-control/cart-control'
import popupMixin from 'common/mixins/popup' // 不用加上 .js这个后缀也可以

const EVENT_ADD = 'add'
const EVENT_LEAVE = 'leave'

export default {
  name: 'ShopCartList',
  mixins: [popupMixin],
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    show() {
      this.visible = true
      this.$nextTick(() => { // 最初无法滚动的原因：shopCartList组件show的时候会触发这个show（），visible变为true，但从visible变为true到整个dom渲染完成是需要一定tick的，而cube-scroll在visible为false时就已经初始化了，所以它的高度计算是不对的，所以不能滚动
        this.$refs.listContent.refresh()
      })
    },
    clear() {
     this.dialogComp = this.$createDialog({
      type: 'confirm',
      content: '清空购物车？',
      $events: {
        confirm: () => {
          this.selectFoods.forEach(item => {
            item.count = 0
          })
          this.hide()
        }
       }
      })
      this.dialogComp.show()
    },
    hideMask() {
      this.hide()
    },
    add(el) {
      this.$emit(EVENT_ADD, el)
    },
    afterLeave() {
      this.$emit(EVENT_LEAVE)
    }
  },
  components: {
    CartControl
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.cube-shop-cart-list
  bottom 48px
  &.fade-enter, &.fade-leave-active
    opacity 0
  &.fade-enter-active, &.fade-leave-active
    transition all 0.4s ease-in-out
  .shop-cart-list
    &.move-enter, &.move-enter-active
      transform translate3d(0, 100%, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s ease-in-out
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background $color-background-ssss
      .title
        float left
        font-size $fontsize-medium
        color $color-dark-grey
      .clear
        float right
        font-size $fontsize-small
        color $color-blue
    .list-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background $color-white
      .item
        position relative
        padding 12px 0
        box-sizing border-box
        .name
          line-height 24px
          font-size $fontsize-medium
          color $color-dark-grey
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-weight 700
          font-size $fontsize-medium
          color $color-red
        .cart-control-wrapper
          position absolute
          right 0
          bottom 6px
</style>
