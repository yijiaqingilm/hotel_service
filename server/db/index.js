import mysql from 'mysql'
import config from '../config/config.json'

const dbAppClient = mysql.createPool({
  ...config.dbApp
})
dbAppClient.on('connection', (connection) => {
  console.log('应用数据库连接已分配')
  connection.on('error', (err) => {
    console.error('应用数据库错误', err.code)
  })
  connection.on('end', (err) => {
    console.error('应用数据库连接结束', err)
  })
})

export default dbAppClient