<template>
 <transition name="fade">
  <div class="header-detail" v-show="visible">
    <div class="detail-wrapper clear-fix">
      <div class="detail-main">
        <h1 class="name">{{seller.name}}</h1>
        <div class="stars-wrapper">
          <stars :size="48" :score="seller.score"></stars>
        </div>
        <div class="title">
          <div class="line"></div>
          <div class="text">优惠信息</div>
          <div class="line"></div>
        </div>
        <ul class="support" v-if="seller.supports">
          <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
            <support-ico class="icon" :size="2" :type="seller.supports[index].type"></support-ico>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
        <div class="title">
          <div class="line"></div>
          <div class="text">商家公告</div>
          <div class="line"></div>
        </div>
        <div class="bulletin">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
    </div>
    <div class="detail-close" @click="closeDetail"><i class="icon-close"></i></div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
  import Stars from 'components/stars/stars' // 为什么路径直接是components？看vue.config配置
  import SupportIco from 'components/support-ico/support-ico'
  export default {
    name: 'HeaderDetail',
    props: {
      seller: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      show() {
        this.visible = true
      },
      closeDetail() {
         this.visible = false
      }
    },
    components: {
      Stars,
      SupportIco
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'
@import '~common/stylus/variable'

.header-detail
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  overflow auto
  opacity 1
  backdrop-filter: blur(10px)
  color $color-white
  background $color-background-s
  &.fade-enter-active,&.fade-leave-active
    transition all 0.5s
  &.fade-enter,&.fade-leave-to
    opacity 0
    background $color-background
  .detail-wrapper
    display inline-block // 为什么要设置这个？
    width 100%
    min-height 100%
    .detail-main
      margin-top 64px
      padding-bottom 64px
      .name
        line-height: 16px
        text-align: center
        font-size: $fontsize-large
        font-weight: 700
      .stars-wrapper
       margin-top: 18px
       padding: 2px 0
       text-align: center
      .title
        display flex
        margin: 28px auto 24px auto
        width 80%
        .line
          position relative
          top -6px
          flex 1 //这个是line宽度自适应的关键
          border-bottom 1px solid rgba(255, 255, 255, 0.2)
        .text
          padding: 0 12px //字体与线之间的距离，由字体来决定
          font-weight: 700
          font-size: $fontsize-medium
      .support
        width 80%
        margin 0 auto
        .support-item
          display flex
          align-items center
          padding: 0 12px
          margin-bottom: 12px
          .text
            margin-left 12px
            line-height: 16px
            font-size: $fontsize-small
      .bulletin
        width: 80%
        margin: 0 auto
        .content
          padding: 0 12px
          line-height: 24px
          font-size: $fontsize-small
  .detail-close
    position relative //
    width 30px
    height 30px
    margin -64px auto 0 auto
    clear both //
    font-size $fontsize-large-xxxx
</style>
