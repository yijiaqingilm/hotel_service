import dbAppClient from '../db/index'
import * as Model from '../db/AuthorModel'
import queryMiddleware from '../middleware/queryMiddleware'
import transactionsMiddleware from '../middleware/transactionsMiddleware'
import { setPageAndSize } from '../lib/utils'
import { SysRule } from '../db/AuthorModel'
import { SysRole2Rule } from '../db/AuthorModel'
import sequelize from '../db/sequelize'
import { idModel } from '../const/const'

let poolQueryMiddleware = queryMiddleware(dbAppClient)
let Op = sequelize.Op
const sys_userService = {
  usersTotal () {
    return poolQueryMiddleware('select COUNT(*) as count from sys_users')
  },
  userList (page, size) {
    return poolQueryMiddleware('select user.*,roles.name as roleName from sys_users as user LEFT JOIN sys_roles as roles ON `user`.roles_id=roles.rolesId limit ?, ?', setPageAndSize(page, size))
  },
  getUserById (userId) {
    return poolQueryMiddleware('select user.*,roles.name as roleName from sys_users as user LEFT JOIN sys_roles as roles ON `user`.roles_id=roles.rolesId where `user`.userId=?', [userId])
  },
  getUser (where) {
    return Model.SysUser.findOne({
      where,
      include: [
        {
          model: Model.SysRole, attributes: ['name', 'rolesId']
        },
      ],
      attributes: ['userId', 'name', 'nickName', 'roles_id']
    })
  },
  /**
   * 查询vip用户
   * @param model
   * @param info
   */
  getVipUserInfoByModel (model = idModel.vipCard, info) {
    let where = {
      type: {
        [Op.not]: 0
      }
    }
    switch (model) {
      case idModel.vipMobile:
        where.mobile = info
        break
      case idModel.vipCard:
        where.vipCardId = info
        break
      case idModel.cardId:
        where.cardId = info
    }
    return Model.User.findOne({
      where,
      attributes: ['userId', 'type', 'name', 'balance', 'mobile', 'cardId', 'vipCardId']
    })
  },
  delUserByIds (userIds) {
    return poolQueryMiddleware('delete from sys_users where userId in (?)', userIds.join(','))
  },
  /**
   * user:name,password,nickName,roles_id
   * @param user
   * @returns {*}
   */
  addUser (user) {
    return poolQueryMiddleware('insert into sys_users set ?', user)
  },
  updateUserNameById (userId, name) {
    return poolQueryMiddleware('udpate sys_users set name=?  where userId=?', [name, userId])
  },
  updateUserPwdById (userId, pwd) {
    return poolQueryMiddleware('update sys_users set password=? where userId=?', [pwd, userId])
  },
  updateUserRoleById (userId, roleId) {
    return poolQueryMiddleware('update sys_users set roles_id=? where userId=?', [roleId, userId])
  },
  updateUser (user) {
    let {userId, name, nickName, roles_id} = user
    return poolQueryMiddleware('update sys_users set roles_id=?,name=?,nickName=? where userId=?', [roles_id, name, nickName, userId])
  },
  searchUserList (p) {
    let {name, roleId, page, size} = p
    let params = [`%${name}%`]
    let sql = 'select * from sys_users where name like ? '
    if (roleId) {
      sql += 'and roles_id =?'
      params.push(roleId)
    }
    sql += ' limit ?, ?'
    params.push(...setPageAndSize(page, size))
    return poolQueryMiddleware(sql, params)
  },
  usersTotalByKeys (p) {
    let {name, roleId} = p
    let params = [`%${name}%`]
    let sql = 'select count(*) as count from sys_users where name like ? '
    if (roleId) {
      sql += 'and roles_id =?'
      params.push(roleId)
    }
    return poolQueryMiddleware(sql, params)
  },
  // 存在问题先注释
  /* ruleList (p) {
    let {page, size = 10, name, parentNodeName} = p
    let [offset, limit] = setPageAndSize(page, size)
    return SysRule.findAndCountAll({
      offset,
      limit
    })
  },*/
  ruleListAll () {
    return SysRule.findAll()
  },
  getRuleByRole (where) {
    return sequelize.query('select rule.apiUrl, rule.rulesId,rule.name,rule.parentNode,rule.url from sys_roles_rules as s_r_r left join sys_rules as rule on rule.rulesId=s_r_r.rules_id where s_r_r.roles_id=:roles_id',
      {
        replacements: where, type: sequelize.QueryTypes.SELECT
      })
  },
  getRuleById (ruleId) {
    return poolQueryMiddleware('select * from sys_rules where rulesId=?', ruleId)
  },
  ruleAdd (rule) {
    return poolQueryMiddleware('insert into sys_rules set ? ', rule)
  },
  ruleEdit (rule) {
    let {name, url, parentNode, apiUrl, rulesId} = rule
    return poolQueryMiddleware('update sys_rules set name=?,url=?,parentNode=?,apiUrl=? where rulesId=? ', [name, url, parentNode, apiUrl, rulesId])
  },
  getChildrenById (ruleId) {
    return poolQueryMiddleware('select * from sys_rules where parentNode=? limit 1', [ruleId])
  },
  delRuleByIds (ruleIds) {
    let querys = [
      ['delete from sys_rules where rulesId in (?)', ruleIds.join(',')],
      ['delete from sys_rules where parentNode in (?)', ruleIds.join(',')]
    ]
    return transactionsMiddleware(querys)
  },
  searchRuleList (p) {
    let {name, parentNodeName} = p
    let params = [`%${name}%`]
    let sql = 'select * from sys_rules where name like ? '
    if (parentNodeName.length > 0) {
      sql += 'and parentNode in (select rulesId from sys_rules where name like ?)'
      params.push(`%${parentNodeName}%`)
    }
    return poolQueryMiddleware(sql, params)
  },

  roleList (page, size) {
    console.log('test')
    Model.SysRole.findAll().then((data) => {
      console.log('data', data)
    }).catch((err) => {
      console.log('err', err)
    })
    return poolQueryMiddleware(`SELECT roles.*,GROUP_CONCAT(rules.rulesId) as ruleIds,GROUP_CONCAT(rules.name)as ruleNames  from sys_roles as roles
      LEFT JOIN sys_roles_rules as s_r_r on roles.rolesId=s_r_r.roles_id 
      LEFT JOIN sys_rules as rules on s_r_r.rules_id=rules.rulesId GROUP BY roles.rolesId limit ?,?`, setPageAndSize(page, size))
  },
  roleListAll () {
    return poolQueryMiddleware('select * from sys_roles')
  },
  roleTotal () {
    return poolQueryMiddleware('select COUNT(*) as count from sys_roles')
  },
  roleAdd (role) {
    return new Promise(async (resolve, reject) => {
      let {menuIds, ...rest} = role
      let rolesId = -1
      await poolQueryMiddleware('insert into sys_roles set ?', rest).then((data) => {
        rolesId = data.insertId
      }).catch((error) => {
        reject(error)
      })
      this.roles2RulesAdd(rolesId, menuIds)(poolQueryMiddleware).then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 根据角色id 插入多行菜单信息
   * @param roleId
   * @param rulesIds
   * @returns {Promise<any>}
   */
  roles2RulesAdd: (roleId, rulesIds) => (conn) => new Promise((resolve, reject) => {
    console.log('conn', conn)
    if (rulesIds.length > 0) {
      let roles_rules_arr = []
      rulesIds.forEach((rules_id) => {
        roles_rules_arr.push([roleId, rules_id])
      })
      conn('insert into sys_roles_rules(roles_id,rules_id) values ?', [roles_rules_arr]).then((data) => {
        resolve({data: ''})
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve({data: ''})
    }
  }),
  getRoleById (roleId) {
    return poolQueryMiddleware(`SELECT roles.*,GROUP_CONCAT(rules.rulesId) as ruleIds,GROUP_CONCAT(rules.name)as ruleNames  from sys_roles as roles
      LEFT JOIN sys_roles_rules as s_r_r on roles.rolesId=s_r_r.roles_id 
      LEFT JOIN sys_rules as rules on s_r_r.rules_id=rules.rulesId GROUP BY roles.rolesId HAVING roles.rolesId=? limit 1`, [roleId])
  },
  roleEdit (role) {
    let {menuIds, rolesId, name} = role
    let querys = [
      ['update sys_roles set name=? where rolesId=?', [name, rolesId]],
      ['delete from sys_roles_rules where roles_id=?', [rolesId]],
      this.roles2RulesAdd(rolesId, menuIds)
    ]
    return transactionsMiddleware(querys)
  }
}
export default sys_userService
