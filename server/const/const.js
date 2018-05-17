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
  expire: 2
}
const room_status = {
  usable: 1,
  disable: 0,
  delete: 2,
  clearing: 3,
  checkIn: 4,
  booking: 5,
}
const PAGESIZE = 10
export {
  STATUS_CODE,
  PAGESIZE,
  room_attr_status,
  orderSource
}
