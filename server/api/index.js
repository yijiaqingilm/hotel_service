import { Router } from 'express'

import users from './users'
import sysUser from './sysUsers'
import rooms from './rooms'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(sysUser)
router.use(rooms)

export default router
