import { Router } from 'express'
import BaseData from '../baseData'
import ErrorData from '../baseData/ErrorData'
import mysqlErr from '../const/mysqlErrorCode'
import userService from '../service/sys_usersService'
import { check } from 'express-validator/check'
import { PAGESIZE } from '../const/const'
import { handleErr, checkPage } from '../lib/utils'
import md5 from 'js-md5'
import Authentication from '../middleware/authentication'

let auth = new Authentication()
// 白名单
let whiteList = [
  '/sys/auth',
  '/sys/login',
  '/sys/getCode'
]
let checkUser = [
  check('name', '用户名不能为空').isLength({min: 1}),
  check('roles_id', '用户角色不能为空').isInt()
]
const router = Router()
router.all('/sys/*', (req, res, next) => {
  console.log('path', req.path)
  if (whiteList.indexOf(req.path) !== -1) {
    next()
    return
  }
  // 注释授权认证。
  /* if (!auth.verify(req)) {
    res.status(401).json(new ErrorData('访问未授权，请重新进入'))
  } else {
    req.data = auth.getIdentity(req)
    next()
  }*/

  // 验证请求是否有权限
  next()
  /* let pathName = req.path.split('/').slice(2).join('/')
  console.log('req.session.ruleList', req.session.ruleList)
  if (req.session && req.session.ruleList && req.session.ruleList.length && req.session.ruleList.indexOf(pathName) !== -1) {
    console.log('你拥有访问权限')
    next()
  } else {
    res.status(403).json(new ErrorData('没有访问权限！！！'))
    return
  }*/
})
router.post('/sys/getCode', (req, res, next) => {
  let testCode = '123456'
  req.session.code = testCode
  res.json(new BaseData(testCode))
})
router.post('/sys/login', (req, res, next) => {
  let userInfo = Authentication.parseUser(req.body.info)
  if (req.session.code === userInfo.code) {
    let user = {
      name: userInfo.name,
      password: md5(userInfo.pwd),
    }
    userService.getUser(user).then((data) => {
      if (data) {
        console.log('登录成功')
        userService.getRuleByRole({roles_id: data.roles_id}).then((rules) => {
          req.session.ruleList = rules.map((rule) => rule.apiUrl)
          rules = rules.map((rule) => {
            delete rule.apiUrl
            return rule
          })
          res.json(new BaseData({
            token: auth.createToken(data),
            user: data,
            ruleList: rules
          }))
        }).catch((e) => {
          res.status(500).json(new ErrorData(e))
        })
      } else {
        console.log('登录失败')
        res.status(304).json(new BaseData('用户名或密码错误'))
      }
    })
  } else {
    console.log('code 校验失败')
  }

})

router.get('/sys/auth', (req, res, next) => {
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

router.post('/sys/user/list', [checkPage, handleErr], (req, res, next) => {
  const {page, size = PAGESIZE} = req.body
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
  check('userId'), handleErr
], (req, res, next) => {
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
// 存在问题
router.post('/sys/user/add', (req, res, next) => {
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
router.post('/sys/user/edit', [...checkUser, handleErr], (req, res, next) => {
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

router.post('/sys/user/search', [checkPage, handleErr], (req, res, next) => {
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
  userService.ruleListAll().then((data) => {
    req.data = data
    next()
  })
}
/* 菜单路由*/
router.post('/sys/menu/list', [getRuleList], (req, res, next) => {
  res.json(new BaseData(req.data))
})
router.post('/sys/menu/info', [
  check('ruleId', '菜单Id不能为空').exists().isInt(),
  handleErr
], (req, res, next) => {
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
router.post('/sys/menu/add', [
  check('name', '菜单名必填?').exists().isLength({min: 1}),
  check('parentNode', '父节点为数字类型').isInt(),
  check('url', '菜单地址必填').exists().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  const rule = req.body
  userService.ruleAdd(rule).then((data) => {
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
router.post('/sys/menu/edit', (req, res, next) => {
  const rule = req.body
  userService.ruleEdit(rule).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/menu/getChildren', (req, res, next) => {
  const rulesId = req.body.rulesId
  userService.getChildrenById(rulesId).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/menu/del', [
  check('rulesIds', '菜单id格式不正确').exists().isArray(),
  handleErr
], (req, res, next) => {
  const rulesIds = req.body.rulesIds
  userService.delRuleByIds(rulesIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/menu/seach', (req, res, next) => {
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
  check('roleId', '角色Id不能为空').exists().isInt(),
  handleErr
], (req, res, next) => {
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
// 查询vip用户是否存在
router.post('/sys/user/checkVip', [
  check('model', '查询模型不能为空').isInt(),
  check('info', '查询内容不能为空').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  const {model, info} = req.body
  userService.getVipUserInfoByModel(model, info).then((user) => {
    res.json(new BaseData(user))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
export default router
