import redis from 'redis'
import roomService from '../service/roomService'
import exeTask from '../task/task'

let redisClient = redis.createClient({
  password: '123456'
})

redisClient.on('error', function (err) {
  console.log('redisClient Error ' + err)
})

var redisSub = redis.createClient({
  password: '123456'
})
var redisPub = redis.createClient({
  password: '123456'
})

redisSub.on('pmessage', function (pattern, channel, expiredKey) {
  exeTask(expiredKey)
})
redisSub.psubscribe('__keyevent@0__:expired')
export { redisSub, redisPub }
export default redisClient
