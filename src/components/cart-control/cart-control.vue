<template>
  <div class="cart-control">
    <transition name="move">
      <div class="decrease" v-show="food.count > 0" @click.stop="decrease">
        <!-- click.stop的原因 -->
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="add icon-add_circle" @click.stop="add"></div>
  </div>
</template>

<script>
const EVENT_ADD = 'add'

export default {
  name: 'CartControl',
  props: {
    food: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    add(event) {
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit(EVENT_ADD, event.target) // event.target代表某个Dom元素的引用
    },
    decrease() {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.cart-control
  display flex
  align-items center
  .decrease
    display inline-block
    padding 6px
    opacity 1
    .inner
      display inline-block
      line-height 24px
      font-size $fontsize-large-xxx
      color $color-blue
      transition all 0.4s linear
      transform rotate(0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s linear
    &.move-enter, &.move-leave-active
      opacity: 0
      .inner
        transform rotate(180deg)
  .count
    width 12px
    line-height 24px
    text-align center
    font-size $fontsize-small-s
    color $color-grey
  .add
    display inline-block
    padding 6px
    line-height 24px
    font-size $fontsize-large-xxx
    color $color-blue
</style>
