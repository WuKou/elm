<template>
    <transition
      name="move"
      @after-leave="afterLeave"
    >
      <div class="food" v-show="visible">
        <cube-scroll ref="scroll">
          <div class="food-content">
            <div class="img-header">
              <img :src="food.image" :alt="food.name">
              <div class="back" @click="hide">
                  <i class="icon-arrow_lift"></i>
              </div>
            </div>
            <div class="content">
              <h1 class="title">{{food.name}}</h1>
              <div class="detail">
                <span class="sell-count">月售{{food.sellCount}}份</span>
                <span class="rating">{{food.rating}}%</span>
              </div>
              <div class="price-wrapper">
                <span class="current-price">￥{{food.price}}</span>
                <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <div class="cart-control-wrapper">
                <cart-control :food="food" @add="addFood"></cart-control>
              </div>
            <!--  第一次点击该按钮时，.buy的display会瞬间为none，则无法获得当前元素的位置，
              将.buy的隐藏做为动画效果，让它不是瞬间为none，这样就可以获得所需位置了 -->
              <transition class="fade">
                <div class="buy" v-show="!food.count" @click="addFirst">
                  加入购物车
                </div>
              </transition>
            </div>
             <split v-show="food.info"></split>
             <div class="info-content" v-show="food.info">
               <h2 class="title">商品介绍</h2>
               <p class="info">{{food.info}}</p>
             </div>
             <split></split>
             <div class="rating">
               <h2 class="title">商品评价</h2>
               <rating-select :selectType="selectType"
                  :onlyContent="onlyContent"
                  :desc="desc"
                  :ratings="ratings"
                  @toggle="onToggle"
                  @select="onSelect"></rating-select>
                <div class="rating-wrapper">
                  <ul>
                    <li class="rating-item border-bottom-1px" v-for="(item, index) in computedRatings" :key="index">
                      <div class="user">
                        <span class="name">{{item.username}}</span>
                        <img class="avatar" :src="item.avatar" width="12" height="12">
                      </div>
                      <div class="date">{{format(item.rateTime)}}</div>
                      <p class="text">
                        <span :class="{'icon-thumb_up':item.rateType===0,'icon-thumb_down':item.rateType===1}"></span>{{item.text}}
                      </p>
                    </li>
                  </ul>
                  <div class="no-rating" v-show="!computedRatings || !computedRatings.length">暂无评价</div>
                </div>
             </div>
          </div>
        </cube-scroll>
      </div>
    </transition>
</template>

<script>
  import CartControl from 'components/cart-control/cart-control'
  import Split from 'components/split/split'
  import RatingSelect from 'components/rating-select/rating-select'
  import ratingMixin from 'common/mixins/rating'
  import popupMixin from 'common/mixins/popup'
  import moment from 'moment'

   const EVENT_SHOW = 'show'
   const EVENT_ADD = 'add'
   const EVENT_LEAVE = 'leave'

  export default {
    name: 'Food',
    mixins: [ratingMixin, popupMixin],
    props: {
      food: {
        type: Object,
        default() {
          return {}
        }
      },
      totalCount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        visible: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    computed: {
      ratings() {
        return this.food.ratings
      }
    },
    created() {
      this.$on(EVENT_SHOW, () => { // 监听EVENT_SHOW，当该事件被触发时，执行回调函数（为什么要在created这个生命周期钩子执行？）
        this.$nextTick(() => {
          this.$refs.scroll.refresh() // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        })
      })
    },
   methods: {
     afterLeave() {
       this.$emit(EVENT_LEAVE)
     },
     addFirst(event) {
        this.$set(this.food, 'count', 1)
        this.$emit(EVENT_ADD, event.target) // 注意，这里是event.target
     },
     addFood(target) {
       this.$emit(EVENT_ADD, target) // 注意，这里是target
     },
     format(time) {
       return moment(time).format('YYYY-MM-DD hh:mm')
     }
   },
   components: {
     CartControl,
     Split,
     RatingSelect
   }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background: $color-white
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .img-header
      position relative
      height 0
      width 100%
      padding-top 100% // padding-top为百分比时，会根据width计算
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size: $fontsize-large-xx
          color $color-white
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin 0 0 8px 0
        font-size $fontsize-medium
        font-weight 700
        color $color-dark-grey
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        .sell-count,.rating
          font-size $fontsize-small-s
          color $color-light-grey
        .sell-count
          margin-right 12px
      .price-wrapper
        line-height 24px
        font-weight 700
        .current-price
          margin-right 8px
          font-size 14px
          color $color-red
        .old-price
          text-decoration line-through
          font-size $fontsize-small-s
          color $color-light-grey
      .cart-control-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        height 24px
        line-height 24px
        padding 6px 12px
        font-size 10px
        border-radius 24px
        background-color $color-blue
        color $color-white
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.3s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info-content
      padding 18px
      .title
        line-height 14px
        margin 0
        padding 0 0 6px 0
        font-size $fontsize-medium
        color $color-dark-grey
      .info
       line-height 24px
       padding 0 8px
       font-size $fontsize-small
       color $color-grey
    .rating
       padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        margin-bottom 0
        font-size $fontsize-medium
        color $color-dark-grey
      .rating-wrapper
        padding 0 18px
        .rating-item
          padding 16px 0
          position relative
          &:last-child
            border-none()
          .user
            position absolute
            right 0
            line-height 12px
            .name
              font-size $fontsize-small-s
              color $color-light-grey
            .avatar
              margin-left 12px
              border-radius 50%
          .date
            margin-bottom 6px
            line-height 12px
            font-size $fontsize-small-s
            color $color-light-grey
          .text
            line-height 16px
            font-size $fontsize-small
            color $color-dark-grey
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size $fontsize-small
            .icon-thumb_up
              color $color-blue
            .icon-thumb_down
              color $color-light-grey
        .no-rating
          padding: 16px 0
          font-size: $fontsize-small
          color: $color-light-grey
</style>
