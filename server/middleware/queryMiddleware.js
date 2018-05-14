const queryMiddleware = (conn) => (sql, values = [], config = {}) => new Promise((resolve, reject) => {
  let query = conn.query({
    sql,
    values,
    ...config
  }, (error, result, fields) => {
    console.log('query', query.sql)
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
})
export default queryMiddleware
