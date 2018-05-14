import api from '../../api/api'
import { isEmptyObject } from '../../lib/utils'
import { globalConst as native, mutationNames, pageSize as size } from '../../lib/const'
import Vue from 'vue'
import { applyClientMiddleware } from '../index'

let state = {
  faceList: [],
  face: {},
  roomTypeList: [],
  roomType: {},
  tagList: [],
  tag: {},
  attrList: [],
  attr: {}
}
let getters = {}
let actions = {
  [native.doSysRoomFaceList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomFaceList)(refs)
  },
  [native.doSysRoomFaceInfo] ({state}, refs) {
    let {faceId} = refs
    if (!state[faceId]) {
      return applyClientMiddleware(api.doSysRoomFaceInfo)(refs)
    }
  },
  [native.doSysRoomFaceEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomFaceEdit)(refs)
  },
  [native.doSysRoomFaceDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomFaceDel)(refs)
  },
  [native.doSysRoomFaceAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomFaceAdd)(refs)
  },

  [native.doSysRoomTypeList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTypeList)(refs)
  },
  [native.doSysRoomTypeInfo] ({state}, refs) {
    let {roomTypeId} = refs
    if (!state.roomType[roomTypeId]) {
      return applyClientMiddleware(api.doSysRoomTypeInfo)(refs)
    }
  },
  [native.doSysRoomTypeEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTypeEdit)(refs)
  },
  [native.doSysRoomTypeDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTypeDel)(refs)
  },
  [native.doSysRoomTypeAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTypeAdd)(refs)
  },

  [native.doSysRoomTagList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTagList)(refs)
  },
  [native.doSysRoomTagInfo] ({state}, refs) {
    let {tagId} = refs
    if (!state.tag[tagId]) {
      return applyClientMiddleware(api.doSysRoomTagInfo)(refs)
    }
  },
  [native.doSysRoomTagEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTagEdit)(refs)
  },
  [native.doSysRoomTagDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTagDel)(refs)
  },
  [native.doSysRoomTagAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomTagAdd)(refs)
  },

  [native.doSysRoomAttrList] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomAttrList)(refs)
  },
  [native.doSysRoomAttrInfo] ({state}, refs) {
    let {attrId} = refs
    if (!state.attr[attrId]) {
      return applyClientMiddleware(api.doSysRoomAttrInfo)(refs)
    }
  },
  [native.doSysRoomAttrEdit] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomAttrEdit)(refs)
  },
  [native.doSysRoomAttrDel] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomAttrDel)(refs)
  },
  [native.doSysRoomAttrAdd] ({state}, refs) {
    return applyClientMiddleware(api.doSysRoomAttrAdd)(refs)
  }
}
let mutations = {
  [mutationNames.doSysRoomFaceList_request] (state, {refs}) {},
  [mutationNames.doSysRoomFaceList_success] (state, {data}) {
    state.faceList = data
  },
  [mutationNames.doSysRoomFaceList_failure] (state, {error}) {},

  [mutationNames.doSysRoomFaceInfo_request] (state, {refs}) {},
  [mutationNames.doSysRoomFaceInfo_success] (state, {data, refs}) {
    let {faceId} = refs
    Vue.set(state.face, faceId, data)
  },
  [mutationNames.doSysRoomFaceInfo_failure] (state, {error}) {},

  [mutationNames.doSysRoomFaceEdit_request] (state, {refs}) {},
  [mutationNames.doSysRoomFaceEdit_success] (state, {data}) {
  },
  [mutationNames.doSysRoomFaceEdit_failure] (state, {error}) {},

  [mutationNames.doSysRoomFaceDel_request] (state, {refs}) {},
  [mutationNames.doSysRoomFaceDel_success] (state, {data}) {
  },
  [mutationNames.doSysRoomFaceDel_failure] (state, {error}) {},

  [mutationNames.doSysRoomFaceAdd_request] (state, {refs}) {},
  [mutationNames.doSysRoomFaceAdd_success] (state, {data}) {
  },
  [mutationNames.doSysRoomFaceAdd_failure] (state, {error}) {},
  /* --roomtype-- */
  [mutationNames.doSysRoomTypeList_request] (state, {refs}) {},
  [mutationNames.doSysRoomTypeList_success] (state, {data}) {
    state.roomTypeList = data
  },
  [mutationNames.doSysRoomTypeList_failure] (state, {error}) {},

  [mutationNames.doSysRoomTypeInfo_request] (state, {refs}) {},
  [mutationNames.doSysRoomTypeInfo_success] (state, {data, refs}) {
    let {roomTypeId} = refs
    Vue.set(state.roomType, roomTypeId, data)
  },
  [mutationNames.doSysRoomTypeInfo_failure] (state, {error}) {},

  [mutationNames.doSysRoomTypeEdit_request] (state, {refs}) {},
  [mutationNames.doSysRoomTypeEdit_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTypeEdit_failure] (state, {error}) {},

  [mutationNames.doSysRoomTypeDel_request] (state, {refs}) {},
  [mutationNames.doSysRoomTypeDel_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTypeDel_failure] (state, {error}) {},

  [mutationNames.doSysRoomTypeAdd_request] (state, {refs}) {},
  [mutationNames.doSysRoomTypeAdd_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTypeAdd_failure] (state, {error}) {},
  /* --tag-*/
  [mutationNames.doSysRoomTagList_request] (state, {refs}) {},
  [mutationNames.doSysRoomTagList_success] (state, {data}) {
    state.tagList = data
  },
  [mutationNames.doSysRoomTagList_failure] (state, {error}) {},

  [mutationNames.doSysRoomTagInfo_request] (state, {refs}) {},
  [mutationNames.doSysRoomTagInfo_success] (state, {data, refs}) {
    let {tagId} = refs
    Vue.set(state.tag, tagId, data)
  },
  [mutationNames.doSysRoomTagInfo_failure] (state, {error}) {},

  [mutationNames.doSysRoomTagEdit_request] (state, {refs}) {},
  [mutationNames.doSysRoomTagEdit_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTagEdit_failure] (state, {error}) {},

  [mutationNames.doSysRoomTagDel_request] (state, {refs}) {},
  [mutationNames.doSysRoomTagDel_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTagDel_failure] (state, {error}) {},

  [mutationNames.doSysRoomTagAdd_request] (state, {refs}) {},
  [mutationNames.doSysRoomTagAdd_success] (state, {data}) {
  },
  [mutationNames.doSysRoomTagAdd_failure] (state, {error}) {},
  /* --roomAttr--*/
  [mutationNames.doSysRoomAttrList_request] (state, {refs}) {},
  [mutationNames.doSysRoomAttrList_success] (state, {data}) {
    state.attrList = data
  },
  [mutationNames.doSysRoomAttrList_failure] (state, {error}) {},

  [mutationNames.doSysRoomAttrInfo_request] (state, {refs}) {},
  [mutationNames.doSysRoomAttrInfo_success] (state, {data, refs}) {
    let {attrId} = refs
    Vue.set(state.attr, attrId, data)
  },
  [mutationNames.doSysRoomAttrInfo_failure] (state, {error}) {},

  [mutationNames.doSysRoomAttrEdit_request] (state, {refs}) {},
  [mutationNames.doSysRoomAttrEdit_success] (state, {data}) {
  },
  [mutationNames.doSysRoomAttrEdit_failure] (state, {error}) {},

  [mutationNames.doSysRoomAttrDel_request] (state, {refs}) {},
  [mutationNames.doSysRoomAttrDel_success] (state, {data}) {
  },
  [mutationNames.doSysRoomAttrDel_failure] (state, {error}) {},

  [mutationNames.doSysRoomAttrAdd_request] (state, {refs}) {},
  [mutationNames.doSysRoomAttrAdd_success] (state, {data}) {
  },
  [mutationNames.doSysRoomAttrAdd_failure] (state, {error}) {},
}

export {
  state,
  getters,
  actions,
  mutations
}
