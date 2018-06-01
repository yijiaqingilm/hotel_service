import { redisPub } from '../middleware/redisConnect'
import roomService from '../service/roomService'

const exeTask = function (expiredKey) {
  let [task, taskName, id] = expiredKey.split(':')
  console.log('pmessage', expiredKey)
  if (task === 'task' && taskName === 'deblocking') {
    let orderKey = `order:${id}`
    redisPub.get(orderKey, (err, order) => {
      if (!err) {
        order = JSON.parse(order)
        let roomIds = order.roomIds
        roomService.roomEnabled(roomIds)
      } else {
        console.log('获取order 失败', err)
      }
    })
  }
}
export default exeTask
