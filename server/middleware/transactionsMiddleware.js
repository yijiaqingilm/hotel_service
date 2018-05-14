import dbAppClient from '../db/index'
import queryMiddleware from './queryMiddleware'

/**
 * 用于事物的中间件函数
 * @param querys
 * @returns {Promise<any>}
 */
const transactionsMiddleware = (querys = []) => new Promise((resolve, reject) => {
  dbAppClient.getConnection((err, connection) => {
    if (err) {
      reject(err)
      return
    }
    connection.beginTransaction(async (err) => {
      if (err) {
        reject(err)
        return
      }
      let createQuery = []
      querys && querys.forEach((row) => {
        if (Object.prototype.toString.call(row) === '[object Array]') {
          let [sql, values = [], config = {}] = row
          createQuery.push(queryMiddleware(connection)(sql,
            values,
            ...config))
        } else if (Object.prototype.toString.call(row) === '[object Function]') {
          createQuery.push(row(queryMiddleware(connection)))
        } else {
          reject('传入的参数异常')
          return
        }
      })
      Promise.all(createQuery).then((datas) => {
        connection.commit((err) => {
          if (err) {
            connection.rollback(function () {
              reject(err)
            })
            return
          }
          resolve({data: ''})
          connection.release()
        })
      }).catch((error) => connection.rollback(function () {
        reject(error)
      }))
    })
  })
})

export default transactionsMiddleware
