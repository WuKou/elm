<template>
  <div class="star" :class="starType"><span v-for="(itemClass, index) in itemClasses" class="starItem" :class="itemClass" :key="index"></span></div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  name: 'Stars',
  props: {
    size: Number,
    score: Number
  },
  computed: {
    starType() {
      return 'star-' + this.size
    },
    itemClasses() {
      let result = []
      let score = Math.floor(this.score * 2) / 2 // 把分数转为整数或2.5,3.5小数点后一位为5的数
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score) // 分数的整数部分
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'

.star
  display flex
  align-items center
  justify-content center
  .starItem
    background-repeat no-repeat
  &.star-48
    .starItem
      width 20px
      height 20px
      margin-right 22px
      background-size 20px 20px
      &:last-child
        margin-right 0
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-36
    .starItem
      width: 15px
      height: 15px
      margin-right: 6px
      background-size: 15px 15px
      &:last-child
        margin-right: 0
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .starItem
      width: 10px
      height: 10px
      margin-right: 3px
      background-size: 10px 10px
      &:last-child
        margin-right: 0
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
</style>
