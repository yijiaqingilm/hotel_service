const STATUS_CODE = {
  SUCCESS: 200,
  404: 404,
  SERVER_ERROR: 500
}
const room_attr_status = {
  // 可用 空闲状态
  usable: 1,
  // 禁用
  disable: 0,
  // 删除
  delete: 2,
}
const orderSource = {
  wx: 0,
  // 补单
  replenishment: 1,
  // 人工开
  counter: 2
}
const order_status = {
  pay: 1,
  noPay: 0,
  expire: 2,
  // 押金未支付
  depositUnPaid: 3,
  // 押金已支付
  depositPaid: 4
}
const room_status = {
  usable: 1,
  disable: 0,
  delete: 2,
  clearing: 3,
  checkIn: 4,
  booking: 5,
  // 房间锁定状态 等待入住
  locking: 6
}
const userType = {
  ordinary: 0,
  vip: 1,
  vip2: 2
}
const idModel = {
  cardId: '0',
  vipCard: '1',
  vipMobile: '2'
}
const PAGESIZE = 10
export {
  STATUS_CODE,
  PAGESIZE,
  room_attr_status,
  orderSource,
  room_status,
  userType,
  order_status,
  idModel
}
