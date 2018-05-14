import { Router } from 'express'
import BaseData from '../baseData'
import ErrorData from '../baseData/ErrorData'
import userService from '../service/usersService'

const router = Router()

// Mock Users
const users = [
  {name: 'Alexandre'},
  {name: 'Pooya'},
  {name: 'Sébastien'},
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  console.log(req.baseUrl, 'baseUrl')
  res.json(users)
})
router.post('/users', function (req, res, next) {
  console.log(req.baseUrl, 'baseUrl')
  res.json(new BaseData(users))
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id, 10)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

router.post('/users/add', (req, res, next) => {
  const user = req.body
  userService.userList().then((data) => {
    res.status(200).json(new BaseData(data))
  })
})
router.post('/users/info', (req, res, next) => {
  const userId = req.body.userId
  userService.getUserById(userId).then((data) => {
    res.json(new BaseData(data[0]))
  })
})
export default router
