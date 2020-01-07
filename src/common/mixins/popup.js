const EVENT_SHOW = 'show'
const EVENT_HIDE = 'hide'

export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true
      this.$emit(EVENT_SHOW) // 为什么要向外触发?
    },
    hide () {
      this.visible = false
      this.$emit(EVENT_HIDE) // 为什么要向外触发?当不是通过购物车底栏去隐藏或显示shop-cart-list时,shop-cart的toggleList方法不会执行,则listFold的值不会跟着改变,所以要再去改变listFold的值
    }
  }
}
