<template>
  <cube-scroll class="ratings" :options="scrollOptions" ref="scroll">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="rating">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="text">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <stars :size="36" :score="seller.serviceScore"></stars>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <stars :size="36" :score="seller.foodScore"></stars>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select
        @select="onSelect"
        @toggle="onToggle"
        :selectType="selectType"
        :onlyContent="onlyContent"
        :ratings="ratings"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item border-bottom-1px" v-for="(item, index) in computedRatings" :key="index">
            <div class="avatar">
              <img :src="item.avatar" class="avatar-img">
            </div>
            <div class="content">
                <div class="name">{{item.username}}</div>
                <div class="score-wrapper">
                  <stars :size="36" :score="item.score" class="stars"></stars>
                  <span class="time" v-if="item.deliveryTime">{{item.deliveryTime}}分钟到达</span>
                </div>
                <div class="text">{{item.text}}</div>
                <div class="recommend-wrapper" v-show="item.recommend && item.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span class="recommend" v-for="(item, index) in item.recommend" :key="index">{{item}}</span>
                </div>
                <div class="date">{{formate(item.rateTime)}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
  import { getRatings } from 'api'
  import Stars from 'components/stars/stars'
  import Split from 'components/split/split'
  import RatingSelect from 'components/rating-select/rating-select'
  import ratingMixin from 'common/mixins/rating'
  import moment from 'moment'

  export default {
    name: 'Ratings',
    mixins: [ratingMixin],
    data() {
     return {
       ratings: [],
       scrollOptions: {
        click: false,
        directionLockThreshold: 0 // 防止横向滑动和竖向滑动之间引起冲突
       }
     }
    },
    props: {
      data: { // 拿到seller的数据
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      seller() {
        return this.data || {}
      }
    },
    methods: {
      fetch() {
        if (!this.fetched) {
          this.fetched = true
          getRatings({
             id: this.seller.id
          }).then(ratings => {
            this.ratings = ratings
          })
        }
      },
      formate(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      }
    },
    components: {
      Stars,
      Split,
      RatingSelect
    },
    watch: {
      selectType () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.ratings
  white-space normal
  height 100%
  .overview
    display flex
    padding 18px 0
    .overview-left
      flex 0 0 137px
      width 137px
      padding 6px 0
      text-align center
      border-right 1px solid $color-col-line
      .rating
        margin-bottom 6px
        line-height 28px
        font-size $fontsize-large-xxx
        color $color-orange
      .title
        margin-bottom 8px
        line-height 12px
        font-size $fontsize-small
        color $color-dark-grey
      .text
        line-height 10px
        font-size $fontsize-small-s
        color $color-light-grey
    .overview-right
      flex 1
      padding 6px 0 6px 24px
      .score-wrapper
        display flex
        align-items center
        margin-bottom 8px
        .title
          line-height 18px
          font-size $fontsize-small
          color $color-dark-grey
        .star
          margin 0 12px
        .score
          line-height 18px
          font-size $fontsize-small
          color $color-orange
        .time
          margin-left 12px
          font-size $fontsize-small
          color $color-light-grey
          line-height 18px
  .rating-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      &.last-child
        border-none()
      .avatar
        flex 0 0 28px
        width 28px
        height 28px
        margin-right 12px
        .avatar-img
          width 100%
          height 100%
          border-radius 50%
      .content
        position relative
        flex 1
        flex-direction column
        .name
          font-size $fontsize-small-s
          color $color-dark-grey
          line-height 12px
          margin-bottom 4px
        .score-wrapper
          margin-bottom 6px
          display flex
          align-items center
          .stars
            margin-right 6px
          .time
            font-size $fontsize-small-s
            color $color-light-grey
            line-height 12px
        .text
          margin-bottom 8px
          font-size $fontsize-small
          color $color-dark-grey
          line-height 18px
        .recommend-wrapper
          display flex
          align-items center
          flex-wrap wrap
          display inline-block
          .icon-thumb_up
            margin-right 6px
            font-size $fontsize-small-s
            color $color-blue
          .recommend
            display inline-block
            padding 0 6px
            margin 0 8px 8px 0
            border 1px solid $color-light-grey
            border-radius 1px
            line-height 16px
            font-size $fontsize-small-s
            color $color-light-grey
        .date
          position absolute
          right 0
          top 0
          font-size $fontsize-small-s
          color $color-light-grey
          line-height 12px
          font-weight 200
</style>
