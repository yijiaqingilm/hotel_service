import { globalConst as native } from 'lib/const'

class ApiConfig {
  constructor (name, url, config, method = 'post') {
    this.name = name
    this.url = url
    this.method = method
    if (config && typeof config === 'object') {
      this.config = config
      this.method = method
    } else if (config && typeof config === 'string') {
      this.method = config
    } else {
      this.config = {}
    }

  }
}

let apiConfig = [
  new ApiConfig(native.doSysUserList, '/api/sys/user/list'),
  new ApiConfig(native.doSysUserAdd, '/api/sys/user/add'),
  new ApiConfig(native.doSysUserDel, '/api/sys/user/del'),
  new ApiConfig(native.doSysUserEdit, '/api/sys/user/edit'),
  new ApiConfig(native.doSysUserInfo, '/api/sys/user/info'),
  new ApiConfig(native.doSysUserSeach, '/api/sys/user/search'),
  new ApiConfig(native.doSysRuleList, '/api/sys/rule/list'),
  new ApiConfig(native.doSysRuleInfo, '/api/sys/rule/info'),
  new ApiConfig(native.doSysRuleAdd, '/api/sys/rule/add'),
  new ApiConfig(native.doSysRuleEdit, '/api/sys/rule/edit'),
  new ApiConfig(native.doSysRuleDel, '/api/sys/rule/del'),
  new ApiConfig(native.doSysRuleSeach, '/api/sys/rule/seach'),
  new ApiConfig(native.doSysRuleGetChildren, '/api/sys/rule/getChildren'),
  new ApiConfig(native.doSysRoleAdd, '/api/sys/role/add'),
  new ApiConfig(native.doSysRoleList, '/api/sys/role/list'),
  new ApiConfig(native.doSysRoleInfo, '/api/sys/role/info'),
  new ApiConfig(native.doSysRoleEdit, '/api/sys/role/edit'),

  new ApiConfig(native.doSysRoomFaceList, '/api/sys/room/face/list'),
  new ApiConfig(native.doSysRoomFaceAdd, '/api/sys/room/face/add'),
  new ApiConfig(native.doSysRoomFaceDel, '/api/sys/room/face/del'),
  new ApiConfig(native.doSysRoomFaceEdit, '/api/sys/room/face/edit'),
  new ApiConfig(native.doSysRoomFaceInfo, '/api/sys/room/face/info'),

  new ApiConfig(native.doSysRoomTypeList, '/api/sys/room/type/list'),
  new ApiConfig(native.doSysRoomTypeAdd, '/api/sys/room/type/add'),
  new ApiConfig(native.doSysRoomTypeDel, '/api/sys/room/type/del'),
  new ApiConfig(native.doSysRoomTypeEdit, '/api/sys/room/type/edit'),
  new ApiConfig(native.doSysRoomTypeInfo, '/api/sys/room/type/info'),

  new ApiConfig(native.doSysRoomTagList, '/api/sys/room/tag/list'),
  new ApiConfig(native.doSysRoomTagAdd, '/api/sys/room/tag/add'),
  new ApiConfig(native.doSysRoomTagDel, '/api/sys/room/tag/del'),
  new ApiConfig(native.doSysRoomTagEdit, '/api/sys/room/tag/edit'),
  new ApiConfig(native.doSysRoomTagInfo, '/api/sys/room/tag/info'),

  new ApiConfig(native.doSysRoomAttrList, '/api/sys/room/attr/list'),
  new ApiConfig(native.doSysRoomAttrAdd, '/api/sys/room/attr/add'),
  new ApiConfig(native.doSysRoomAttrDel, '/api/sys/room/attr/del'),
  new ApiConfig(native.doSysRoomAttrEdit, '/api/sys/room/attr/edit'),
  new ApiConfig(native.doSysRoomAttrInfo, '/api/sys/room/attr/info')
]
export default apiConfig