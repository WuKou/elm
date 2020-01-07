<template>
<div class="rating-select">
  <div class="rating-type border-bottom-1px">
    <span class="block positive" :class="{ active:selectType === 2 }" @click="select(2)">
    {{desc.all}}<span class="count">{{ratings.length}}</span>
    </span>
    <span class="block positive" :class="{ active:selectType === 0 }" @click="select(0)">
    {{desc.positive}}<span class="count">{{positives.length}}</span>
    </span>
    <span class="block negative" :class="{ active:selectType === 1 }" @click="select(1)">
    {{desc.negative}}<span class="count">{{negatives.length}}</span>
    </span>
  </div>
  <div class="switch" :class="{ on:onlyContent }">
    <span  class="icon-check_circle"  @click="toggleContent"></span>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  const EVENT_TOGGLE = 'toggle'
  const EVENT_SELECT = 'select'

  export default {
    name: 'RatingSelect',
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE // 不用写成this.POSITIVE
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      toggleContent() {
        this.$emit(EVENT_TOGGLE)
      },
      select(selectType) {
        this.$emit(EVENT_SELECT, selectType)
      }
    }
  }
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
 .rating-select
  .rating-type
    padding 18px 0
    margin 0 18px
    .block
      display inline-block
      padding 8px 12px
      margin-right 8px
      border-radius 1px
      font-size: $fontsize-small
      color: $color-grey
      &.active
        color $color-white
        &.count
          margin-left 2px
      &.positive
        background-color $color-light-blue
        &.active
          background-color  $color-blue
      &.negative
        background-color $color-light-grey-s
        &.active
          background: $color-grey
  .switch
    display flex
    align-items center
    padding 12px 18px
    line-height 24px
    border-bottom 1px solid $color-row-line
    color $color-light-grey
    &.on
      .icon-check_circle
        color $color-green
    .icon-check_circle
      margin-right 4px
      font-size: $fontsize-large-xxx
    .text
      font-size $fontsize-small
</style>
