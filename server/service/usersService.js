import queryMiddleware from '../middleware/queryMiddleware'

const userService = {
  userList () {
    return queryMiddleware('select * from tags')
  },
  getUserById (userId) {
    return queryMiddleware('select * from users where userId=?', [userId])
  }
}
export default userService
