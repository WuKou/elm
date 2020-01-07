<template>
  <div class="tab">
    <cube-tab-bar
    v-model="selectedLabel"
    :useTransition=false
    :showSlider=true
    :data="tabs"
    ref="tabBar"
    class="border-bottom-1px">
    </cube-tab-bar>
    <div class="slider-wrapper">
      <cube-slide
      :loop=false
      :options="options"
      :showDots=false
      :autoPlay=false
      :initialIndex="index"
      ref="slide"
      @scroll="onScroll"
      @change="onChange"
      >
        <cube-slide-item v-for="(item,index) in tabs" :key="index">
          <component ref="component" :is="item.component" :data="item.data"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tab',
    props: {
      tabs: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        options: {
          // listenScroll
          listenScroll: true,
          // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
          // 而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
         // 如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
          probeType: 3,
          // 作用：当我们需要锁定只滚动一个方向的时候，
          // 我们在初始滚动的时候根据横轴和纵轴滚动的绝对值做差，
          // 当差值大于 directionLockThreshold 的时候来决定滚动锁定的方向。
          // 设置成0
          directionLockThreshold: 0
        },
        index: 0
      }
    },
    computed: {
      selectedLabel: {
        get() {
          return this.tabs[this.index].label
        },
        // set这里不是特别懂，之后研究
        set(newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.label === newVal
          })
        }
      }
    },
    // 因为onChange只有slide切换时才被调用，所以需要首次执行时手动调用onChange
    mounted() {
      this.onChange(this.index)
    },
    methods: {
      onChange(current) {
        this.index = current
        const instance = this.$refs.component[current]
        if (instance && instance.fetch) {
          instance.fetch()
        }
      },
      onScroll(pos) {
        let slideWidth = this.$refs.slide.slide.scrollerWidth
        let tabBarWidth = this.$refs.tabBar.$el.clientWidth
        let transform = -pos.x / slideWidth * tabBarWidth
        this.$refs.tabBar.setSliderTransform(transform)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .tab
    display flex
    flex-direction column
    height 100%
    >>> .cube-tab
      padding 10px 0
    .slider-wrapper
      flex 1
      overflow hidden
</style>
