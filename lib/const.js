const modalTitle = '友情提示'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'
const REQUEST = 'REQUEST'
const ERROR_UNAUTHORIZED = 'ERROR_UNAUTHORIZED'
const globalConst = {
  doSysCheckInInfo: 'doSysCheckInInfo',
  doSysCheckVip: 'doSysCheckVip',
  doSysGetCode: 'doSysGetCode',
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
  doSysRoomAttrDel: 'doSysRoomAttrDel',

  doSysRoomImgList: 'doSysRoomImgList',
  doSysRoomImgInfo: 'doSysRoomImgInfo',
  doSysRoomImgAdd: 'doSysRoomImgAdd',
  doSysRoomImgEdit: 'doSysRoomImgEdit',
  doSysRoomImgDel: 'doSysRoomImgDel',

  doSysLogin: 'doSysLogin',

  doSysRoomList: 'doSysRoomList',
  doSysRoomListAll: 'doSysRoomListAll',
  doSysRoomInfo: 'doSysRoomInfo',
  doSysRoomEdit: 'doSysRoomEdit',
  doSysRoomAdd: 'doSysRoomAdd',
  doSysRoomDel: 'doSysRoomDel',
  doSysRoomLocked: 'doSysRoomLocked',
  doSysRoomCheckIn: 'doSysRoomCheckIn',
  doSysRoomCheckOut: 'doSysRoomCheckOut',
  doSysRoomDisable: 'doSysRoomDisable',
  doSysRoomEnabled: 'doSysRoomEnabled',
  doSysRoomClear: 'doSysRoomClear',
  doSysRoomChange: 'doSysRoomChange'

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
const room_attr_status = {
  // 可用
  usable: 1,
  // 禁用
  disable: 0,
  // 删除
  delete: 2,
}
const room_attr_status_info = {
  [room_attr_status.usable]: {name: '可用'},
  [room_attr_status.disable]: {name: '已经禁用'},
  [room_attr_status.delete]: {name: '删除'},
}
const pageSize = 10
const room_status = {
  usable: 1,
  disable: 0,
  delete: 2,
  clearing: 3,
  // 已经入住
  checkIn: 4,
  // 已经预约
  booking: 5,
  // 房间锁定状态 等待入住
  locking: 6,
  // 打算将要入住
  checkingIn: 7
}
const roomStatusInfo = {
  [room_status.usable]: {name: '可用'},
  [room_status.disable]: {name: '不可使用'},
  [room_status.delete]: {name: '已删除'},
  [room_status.clearing]: {name: '清理中'},
  [room_status.checkIn]: {name: '已入住'},
  [room_status.booking]: {name: '已预约'},
  [room_status.locking]: {name: '已锁定'}
}

const idModel = {
  cardId: '0',
  vipCard: '1',
  vipMobile: '2'
}
const idModelInfo = {
  [idModel.cardId]: '身份证',
  [idModel.vipCard]: 'vip卡号',
  [idModel.vipMobile]: 'vip绑定的手机号'
}
export {
  globalConst,
  modalTitle,
  pageSize,
  SUCCESS,
  FAILURE,
  REQUEST,
  ERROR_UNAUTHORIZED,
  mutationNames,
  room_attr_status,
  room_attr_status_info,
  room_status,
  roomStatusInfo,
  idModel,
  idModelInfo
}
