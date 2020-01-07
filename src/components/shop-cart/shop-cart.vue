<template>
  <div class="shop-cart">
    <div class="content" @click="toggleList">
      <div class="left" :class="{'highlight':totalPrice>0}">
        <div class="logo-wrapper">
          <div class="logo" >
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="bubble-wrapper"  v-show="totalCount>0">
          <bubble :count="totalCount"></bubble>
          </div>
        </div>
        <div class="price">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="right">
        <div class="pay" :class="payClass" @click="toPay">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
        <transition
         @before-enter="beforeDrop"
         @enter="dropping"
         @after-enter="afterDrop"
        >
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from 'components/bubble/bubble'

const BALL_LEN = 10
const innerClsHook = 'inner-hook'

function createBalls() {
  let balls = []
  for (let i = 0; i < BALL_LEN; i++) {
    balls.push({ show: false })
  }
  return balls
}

export default {
  name: 'ShopCart',
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    fold: {
      type: Boolean,
      default: true
    },
    // sticky用来区分shop-cart是不是shop-cart-sticky里的
    sticky: {
       type: Boolean,
       default: false
    }
  },
  data() {
    return {
      balls: createBalls(),
      listFold: this.fold
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc() {
      let desc = ''
      if (this.totalPrice === 0) {
        desc = `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        desc = `还差${diff}起送`
      } else {
        desc = '去结算'
      }
      return desc
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'no-enough'
      } else {
        return 'enough'
      }
    }
  },
  created() {
    this.dropBalls = []
  },
  watch: {
    totalCount() {
      if (!this.listFold && !this.totalCount) {
         this._hideShopCartList()
      }
    },
    fold(newVal) {
      this.listFold = newVal
    }
  },
  methods: {
    drop(el) {
      for (let i = 0; i < BALL_LEN; i++) {
        let ball = this.balls[i]
        // 寻找一颗没有下落的小球
        if (!ball.show) {
          ball.show = true // v-show 的值改变是触发动画的一个条件
          ball.el = el // 让小球加上对 dom 的引用，便于之后能访问到这个 dom
          this.dropBalls.push(ball)
          return // 找到一颗没有下落的小球就返回
        }
      }
    },
    // 把小球的位置从原来的购物车挪到 + 号位置
    beforeDrop(el) { // el 是作用动画的 DOM 对象,代表ball这个dom
      const ball = this.dropBalls[this.dropBalls.length - 1]
      const rect = ball.el.getBoundingClientRect() // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
      const x = rect.left - 32
      const y = -(window.innerHeight - rect.top - 22)
      // 使用两层做偏移是为了达到抛物线效果，使用一层不会有抛物线效果
      // 这一层做y轴方向的偏移
      el.style.display = '' // ?
      el.style.transform = el.style.webkitTransform = `translate3d(0, ${y}px, 0)` // webkitTransform是为了兼容一些比较旧的安卓版本
      const inner = el.getElementsByClassName(innerClsHook)[0]
      // inner-hook 这一层做x轴方向的偏移
      inner.style.display = '' // ?
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
    },
    dropping(el, done) {
      this._reflow = document.body.offsetHeight // 强制浏览器重绘，因为之前先把小球移到了购物车区域，然后再做动画把它设置为原位，如果不强制让浏览器重绘一次，那么浏览器就认为小球没有移动过，就不会有动画效果了。
      el.style.transform = el.style.webkitTransform = `translate3d(0, 0, 0)` // webkitTransform是为了兼容一些比较旧的安卓版本  让小球归为，回到原来的购物车里
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(0, 0, 0)`
      el.addEventListener('transitionend', done) // 如果不执行 done，应该是不能进入 afterEnter 或者是 afterLeave 钩子函数里
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift() // 小球下落动画完成后，把小球从下落小球数组中删去，并拿到被删去的小球
      if (ball) {
        ball.show = false
        el.style.display = 'none' // 如果不主动设置，Vue 的动画钩子会等到结束后才把它设置为 none。
      }
    },
    toggleList() {
      if (this.listFold) {
        if (!this.totalCount) {
          return
        }
        this.listFold = false
        this._showShopCartList()
        this._showShopCartSticky()
      } else {
        this.listFold = true
         this._hideShopCartList()
      }
    },
    toPay(e) {
      if (this.totalPrice < this.minPrice) {
        return
      }
        this.$createDialog({
          type: 'confirm',
          content: `确定去支付吗？`
        }).show()
        e.stopPropagation()
    },
    _showShopCartList() {
      this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
        $props: {
           selectFoods: 'selectFoods', // 一定要写成字符串的形式，这样才是响应式（？）
           totalCount: 'totalCount'
        },
        $events: {
          hide: () => {
            this.listFold = true
          },
          add: (target) => {
            this.shopCartStickyComp.drop(target)
          },
          leave: () => {
            this._hideShopCartSticky()
          }
        }
      })
      this.shopCartListComp.show()
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
           selectFoods: 'selectFoods', // 一定要写成字符串的形式，这样才是响应式（？）
           deliveryPrice: 'deliveryPrice',
           minPrice: 'minPrice',
           fold: 'listFold',
           list: this.shopCartListComp
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartList() {
      // 判断当前的shopCart是不是shopCartSticky里的，如果是的话，调用shopCartSticky的list，否则就调用自己的list
      const comp = this.sticky ? this.$parent.list : this.shopCartListComp
      comp.hide && comp.hide()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    }
  },
  components: {
    Bubble
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
@import '~common/stylus/variable'

.shop-cart
  height 100%
  .content
    display flex
    background: $color-background
    font-size: 0
    color: $color-light-grey
    .left
      flex 1
      &.highlight
        .logo-wrapper
          .logo
            background: rgb(0,160,220)
            .icon-shopping_cart
              color: #fff
        .price
          color: #fff
     .left
      .logo-wrapper
        display inline-block
        vertical-align top
        position relative
        top -10px
        margin 0 11px
        padding 6px
        width 56px
        height 56px
        box-sizing border-box
        border-radius 50%
        background-color $color-background
        .logo
          height 100%
          width 100%
          border-radius 50%
          text-align center
          background: $color-dark-grey
          .icon-shopping_cart
            line-height: 44px
            font-size: $fontsize-large-xxx
            color: $color-light-grey
      .bubble-wrapper
        position absolute
        top 0
        right 0
      .price
        display inline-block
        vertical-align top
        margin-top 10px
        line-height 24px
        padding-right 12px
        border-right 1px solid rgba(255, 255, 255, 0.1)
        font-size $fontsize-large
        font-weight 700
      .desc
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        font-size $fontsize-small-s
    .right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-weight 700
        font-size 12px
        &.enough
          background $color-green
          color $color-white
        &.no-enough
          background $color-dark-grey
          color $color-light-grey
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41) // 水平移动，线性匀速
      .inner
        width 16px
        height 16px
        border-radius 50%
        background $color-blue
        transition: all 0.4s linear // 水平移动，线性匀速
</style>
