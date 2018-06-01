import api from '../../api/api'
import { isEmptyObject, margeMutations } from '../../lib/utils'
import { globalConst as native, mutationNames, pageSize as size } from '../../lib/const'
import Vue from 'vue'
import { applyClientMiddleware } from '../index'

let state = {
  user: {},
  userList: [],
  menuList: [],
  rule: {},
  roleList: [],
  roleListAll: [],
  role: {},
  token: '',
  loginUserInfo: {}
}
let getters = {}
let actions = {
  [native.doSysCheckVip] ({state}, refs) {
    return applyClientMiddleware(api.doSysCheckVip)(refs)
  },
  [native.doSysGetCode] ({state}, refs) {
    return applyClientMiddleware(api.doSysGetCode)(refs)
  },
  [native.doSysLogin] ({state}, refs) {
    return applyClientMiddleware(api.doSysLogin)(refs)
  },
  [native.doSysRuleSeach] ({state}, refs) {
    return applyClientMiddleware(api.doSysRuleSeach)(refs)
  },
  [native.doSysRuleInfo] ({state}, refs) {
    let ruleId = refs.ruleId
    if (!state.rule[ruleId]) {
      return applyClientMiddleware(api.doSysRuleInfo)(refs)
    }

  },
  [native.doSysUserList] ({state}, refs) {
    return applyClientMiddleware(api.doSysUserList)(refs)
  },
  [native.doSysUserInfo] ({state}, refs) {
    let userId = refs.userId
    if (!state.user[userId]) {
      return applyClientMiddleware(api.doSysUserInfo)(refs)
    }
  },
  [native.doSysUserAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysUserAdd)(refs)
  },
  [native.doSysUserEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysUserEdit)(refs)
  },
  [native.doSysUserDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysUserDel)(refs)
  },
  [native.doSysUserSeach] ({state}, refs) {
    return applyClientMiddleware(api.doSysUserSeach)(refs)
  },
  [native.doSysRuleList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRuleList)(refs)
  },
  [native.doSysRuleAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRuleAdd)(refs)
  },
  [native.doSysRuleEdit] ({state}, refs) {
    console.log(refs, 'refs')
    return applyClientMiddleware(api.doSysRuleEdit)(refs)
  },
  [native.doSysRuleGetChildren] ({state}, refs) {
    return applyClientMiddleware(api.doSysRuleGetChildren)(refs)
  },
  [native.doSysRoleList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoleList)(refs)
  },
  [native.doSysRoleAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoleAdd)(refs)
  },
  [native.doSysRoleEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoleEdit)(refs)
  },
  [native.doSysRoleInfo] ({state}, refs) {
    let roleId = refs.roleId
    if (!state.role[roleId]) {
      return applyClientMiddleware(api.doSysRoleInfo)(refs)
    }
  },
  [native.doSysRuleDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysRuleDel)(refs)
  }
}
let mutations = {
  [mutationNames.doSysCheckVip_success] (state, {data}) {
  },
  [mutationNames.doSysLogin_success] (state, {data}) {
    state.loginUserInfo = data.user
    state.token = data.token
  },
  [mutationNames.doSysUserList_request] (state, {refs}) {},
  [mutationNames.doSysUserList_success] (state, {data}) {
    console.log('success', data)
    state.userList = data
    console.log(state, 'what?')
  },
  [mutationNames.doSysUserList_failure] (state, {error}) {},

  [mutationNames.doSysUserInfo_request] (state, {refs}) {},
  [mutationNames.doSysUserInfo_success] (state, {data, refs}) {
    console.log('success', data)
    let userId = refs.userId
    state.user[userId] = data
  },
  [mutationNames.doSysUserInfo_failure] (state, {error}) {},

  [mutationNames.doSysUserAdd_request] (state, {refs}) {},
  [mutationNames.doSysUserAdd_success] (state, {data, refs}) {
    console.log('success', data)
  },
  [mutationNames.doSysUserAdd_failure] (state, {error}) {},

  [mutationNames.doSysUserEdit_request] (state, {refs}) {},
  [mutationNames.doSysUserEdit_success] (state, {data, refs}) {
    console.log('success', data)
    let {userId} = refs
    Vue.delete(state.user, userId)
  },
  [mutationNames.doSysUserEdit_failure] (state, {error}) {},

  [mutationNames.doSysUserDel_request] (state, {refs}) {},
  [mutationNames.doSysUserDel_success] (state, {data, refs}) {
    console.log('success', data)
  },
  [mutationNames.doSysUserDel_failure] (state, {error}) {},

  [mutationNames.doSysUserSeach_request] (state, {refs}) {},
  [mutationNames.doSysUserSeach_success] (state, {data, refs}) {
    console.log('success', data)
    state.userList = data
  },
  [mutationNames.doSysUserSeach_failure] (state, {error}) {},

  [mutationNames.doSysRuleList_request] (state, {refs}) {},
  [mutationNames.doSysRuleList_success] (state, {data}) {
    console.log('success', data)
    state.menuList = data
  },
  [mutationNames.doSysRuleList_failure] (state, {error}) {},

  [mutationNames.doSysRuleAdd_request] (state, {refs}) {},
  [mutationNames.doSysRuleAdd_success] (state, {data}) {
    console.log('success', data)
  },
  [mutationNames.doSysRuleAdd_failure] (state, {error}) {
  },

  [mutationNames.doSysRuleGetChildren_request] (state, {refs}) {},
  [mutationNames.doSysRuleGetChildren_success] (state, {data}) {
    console.log('success', data)
  },
  [mutationNames.doSysRuleGetChildren_failure] (state, {error}) {},

  [mutationNames.doSysRoleList_request] (state, {refs}) {},
  [mutationNames.doSysRoleList_success] (state, {data, refs}) {
    console.log('success', data)
    let {page = -1} = refs
    if (page === -1) {
      state.roleListAll = data
    } else {
      state.roleList = data
    }

  },
  [mutationNames.doSysRoleList_failure] (state, {error}) {},

  [mutationNames.doSysRoleAdd_request] (state, {refs}) {},
  [mutationNames.doSysRoleAdd_success] (state, {data}) {
    console.log('success', data)
  },
  [mutationNames.doSysRoleAdd_failure] (state, {error}) {},

  [mutationNames.doSysRuleDel_request] (state, {refs}) {},
  [mutationNames.doSysRuleDel_success] (state, {data}) {
    console.log('success', data)
  },
  [mutationNames.doSysRuleDel_failure] (state, {error}) {},

  [mutationNames.doSysRuleInfo_request] (state, {refs}) {},
  [mutationNames.doSysRuleInfo_success] (state, {data, refs}) {
    let {ruleId} = refs
    state.rule[ruleId] = data
  },
  [mutationNames.doSysRuleInfo_failure] (state, {error}) {},

  [mutationNames.doSysRuleEdit_request] (state, {refs}) {},
  [mutationNames.doSysRuleEdit_success] (state, {data, refs}) {
    console.log('success', data)
  },
  [mutationNames.doSysRuleEdit_failure] (state, {error}) {},

  [mutationNames.doSysRuleSeach_request] (state, {refs}) {},
  [mutationNames.doSysRuleSeach_success] (state, {data, refs}) {
    state.menuList = data
  },
  [mutationNames.doSysRuleSeach_failure] (state, {error}) {},

  [mutationNames.doSysRoleInfo_request] (state, {refs}) {},
  [mutationNames.doSysRoleInfo_success] (state, {data, refs}) {
    console.log('success', data)
    let {roleId} = refs
    state.role[roleId] = data
  },
  [mutationNames.doSysRoleInfo_failure] (state, {error}) {},

  [mutationNames.doSysRoleEdit_request] (state, {refs}) {},
  [mutationNames.doSysRoleEdit_success] (state, {data, refs}) {
    let {rolesId} = refs
    Vue.delete(state.role, rolesId)
    console.log('success', data)
  },
  [mutationNames.doSysRoleEdit_failure] (state, {error}) {},

}

mutations = Object.assign(margeMutations(actions), mutations)

export {
  state,
  getters,
  actions,
  mutations
}
