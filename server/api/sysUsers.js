import { Router } from 'express'
import BaseData from '../baseData'
import ErrorData from '../baseData/ErrorData'
import mysqlErr from '../const/mysqlErrorCode'
import userService from '../service/sys_usersService'
import { check } from 'express-validator/check'
import { PAGESIZE } from '../const/const'
import { handleErr, checkPage } from '../lib/utils'
import md5 from 'js-md5'

let checkUser = [
  check('name', '用户名不能为空').isLength({min: 1}),
  check('roles_id', '用户角色不能为空').isInt()
]
let checkPwd = check('password', '密码不能为空').isLength({min: 32})
const router = Router()
router.all('/sys/user/*', (req, res, next) => {
  next()
})
let cacheUserList = (req, res, next) => {
  let {method, url, body, session} = req
  let key = md5([method, url, JSON.stringify(body)].join(':'))
  if (session[key]) {
    res.json(session[key])
  } else {
    req.key = key
    next()
  }

}
router.post('/sys/user/list', [checkPage], (req, res, next) => {
  const {page, size = PAGESIZE} = req.body
  handleErr(req, res)
  Promise.all([userService.usersTotal(), userService.userList(page, size)]).then((values) => {
    let [total, data] = values
    let result = new BaseData({total: total[0].count, data})
    // req.session[req.key] = result
    res.json(result)
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/user/info', [
  check('userId')
], (req, res, next) => {
  handleErr(req, res)
  let userId = req.body.userId
  userService.getUserById(userId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的用户信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/user/add', checkUser.concat(checkPwd), (req, res, next) => {
  handleErr(req, res)
  let user = req.body
  userService.addUser(user).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('用户名不能重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/user/edit', checkUser, (req, res, next) => {
  handleErr(req, res)
  let user = req.body
  userService.updateUser(user).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/user/del', [
  check('userIds', '用户id格式不正确').isArray().isLength({min: 1})
], (req, res, next) => {
  let userIds = req.body
  userService.delUserByIds(userIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/user/search', [checkPage], (req, res, next) => {
  let p = req.body
  Promise.all([userService.usersTotalByKeys(p), userService.searchUserList(p)]).then((values) => {
    let [total, data] = values
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error
    ))
  })
})
let getRuleList = (req, res, next) => {
  userService.ruleList().then((data) => {
    req.data = data
    next()
  })
}
/* 菜单路由*/
router.post('/sys/rule/list', [getRuleList], (req, res, next) => {
  res.json(new BaseData(req.data))
})
router.post('/sys/rule/info', [
  check('ruleId', '菜单Id不能为空').exists().isInt()
], (req, res, next) => {
  handleErr(req, res)
  let ruleId = req.body.ruleId
  userService.getRuleById(ruleId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的菜单信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/rule/add', [
  check('name', '菜单名必填?').exists().isLength({min: 1}),
  check('parentNode', '父节点为数字类型').isInt(),
  check('url', '菜单地址必填').exists().isLength({min: 1})
], (req, res, next) => {
  handleErr(req, res)
  const rule = req.body
  userService.ruleAdd(rule).then((data) => {
    console.log('插入成功', data)
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('菜单名重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/rule/edit', (req, res, next) => {
  const rule = req.body
  userService.ruleEdit(rule).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/rule/getChildren', (req, res, next) => {
  const rulesId = req.body.rulesId
  userService.getChildrenById(rulesId).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/rule/del', [
  check('rulesIds', '菜单id格式不正确').exists().isArray()
], (req, res, next) => {
  handleErr(req, res)
  const rulesIds = req.body.rulesIds
  userService.delRuleByIds(rulesIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/rule/seach', (req, res, next) => {
  const p = req.body
  userService.searchRuleList(p).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})

/* 角色路由*/
router.post('/sys/role/list', [checkPage], (req, res, next) => {
  const {page, size = PAGESIZE} = req.body
  if (page !== -1) {
    Promise.all([userService.roleTotal(), userService.roleList(page, size)]).then((values) => {
      let [total, data] = values
      res.json(new BaseData({total: total[0].count, data}))
    }).catch((error) => {
      res.status(500).json(new ErrorData(error))
    })
  } else {
    userService.roleListAll().then((data) => {
      res.json(new BaseData(data))
    }).catch((error) => {
      res.status(500).json(new ErrorData(error))
    })
  }

})
router.post('/sys/role/add', (req, res, next) => {
  const role = req.body
  userService.roleAdd(role).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/role/info', [
  check('roleId', '角色Id不能为空').exists().isInt()
], (req, res, next) => {
  handleErr(req, res)
  let roleId = req.body.roleId
  userService.getRoleById(roleId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的角色信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/role/edit', [
  check('name', '角色名不能为空').exists().isLength({min: 1})
], (req, res, next) => {
  const role = req.body
  userService.roleEdit(role).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

export default router
