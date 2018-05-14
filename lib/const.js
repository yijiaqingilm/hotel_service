const modalTitle = '友情提示'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'
const REQUEST = 'REQUEST'
const ERROR_UNAUTHORIZED = 'ERROR_UNAUTHORIZED'
const globalConst = {
  doSysUserList: 'doSysUserList',
  doSysUserAdd: 'doSysUserAdd',
  doSysUserEdit: 'doSysUserEdit',
  doSysUserInfo: 'doSysUserInfo',
  doSysUserSeach: 'doSysUserSeach',
  doSysUserDel: 'doSysUserDel',
  doSysRuleList: 'doSysRuleList',
  doSysRuleAdd: 'doSysRuleAdd',
  doSysRuleEdit: 'doSysRuleEdit',
  doSysRuleGetChildren: 'doSysRuleGetChildren',
  doSysRuleDel: 'doSysRuleDel',
  doSysRoleAdd: 'doSysRoleAdd',
  doSysRoleEdit: 'doSysRoleEdit',
  doSysRoleList: 'doSysRoleList',
  doSysRoleInfo: 'doSysRoleInfo',
  doSysRuleInfo: 'doSysRuleInfo',
  doSysRuleSeach: 'doSysRuleSeach',

  doSysRoomFaceList: 'doSysRoomFaceList',
  doSysRoomFaceInfo: 'doSysRoomFaceInfo',
  doSysRoomFaceAdd: 'doSysRoomFaceAdd',
  doSysRoomFaceEdit: 'doSysRoomFaceEdit',
  doSysRoomFaceDel: 'doSysRoomFaceDel',

  doSysRoomTypeList: 'doSysRoomTypeList',
  doSysRoomTypeInfo: 'doSysRoomTypeInfo',
  doSysRoomTypeAdd: 'doSysRoomTypeAdd',
  doSysRoomTypeEdit: 'doSysRoomTypeEdit',
  doSysRoomTypeDel: 'doSysRoomTypeDel',

  doSysRoomTagList: 'doSysRoomTagList',
  doSysRoomTagInfo: 'doSysRoomTagInfo',
  doSysRoomTagAdd: 'doSysRoomTagAdd',
  doSysRoomTagEdit: 'doSysRoomTagEdit',
  doSysRoomTagDel: 'doSysRoomTagDel',

  doSysRoomAttrList: 'doSysRoomAttrList',
  doSysRoomAttrInfo: 'doSysRoomAttrInfo',
  doSysRoomAttrAdd: 'doSysRoomAttrAdd',
  doSysRoomAttrEdit: 'doSysRoomAttrEdit',
  doSysRoomAttrDel: 'doSysRoomAttrDel'
}
let methods = [SUCCESS.toLowerCase(), FAILURE.toLowerCase(), REQUEST.toLowerCase()]
const mutationNames = {}
for (let actionName in globalConst) {
  if (globalConst.hasOwnProperty(actionName)) {
    methods.forEach((method) => {
      if (!mutationNames[`${actionName}_${method}`]) {
        mutationNames[`${actionName}_${method}`] = `${actionName}_${method}`
      }
    })
  }
}

const pageSize = 10
export {
  globalConst,
  modalTitle,
  pageSize,
  SUCCESS,
  FAILURE,
  REQUEST,
  ERROR_UNAUTHORIZED,
  mutationNames
}
