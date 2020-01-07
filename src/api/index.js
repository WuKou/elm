import { get } from './helper'

const getSeller = get('api/seller') // 为什么是这个路径
const getGoods = get('api/goods')
const getRatings = get('api/ratings')

export {
  getSeller,
  getGoods,
  getRatings
}
