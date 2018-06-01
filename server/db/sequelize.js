import mysql from 'mysql'
import config from '../config/config.json'
import Sequelize from 'sequelize'

const {database, user, password, ...rest} = config.dbApp
const sequelize = new Sequelize(database, user, password, {
  ...rest,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00'
})

sequelize.authenticate().then(() => {
  console.log('应用数据库连接已分配2')
}).catch((err) => {
  console.error('应用数据库错误2', err.code)
})

export default sequelize
