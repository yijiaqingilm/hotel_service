import dbAppClient from '../db/index'
import queryMiddleware from '../middleware/queryMiddleware'
import transactionsMiddleware from '../middleware/transactionsMiddleware'
import { setPageAndSize } from '../lib/utils'
import { PAGESIZE } from '../const/const'

/**
 * 根据attr传入的参数返回 sql和sql所需的参数
 * @param p
 * @isPaging 是否分页
 * @returns {{sql: string, params: Array}}
 */
let getAttrQuerySQLAndParams = (p, isPaging = false) => {
  let {name, booking, status = 1, page, size = 10} = p
  let sql = ''
  let params = []
  if (name) {
    sql += ' and attr.name like ? '
    params.push(`%${name}%`)
  }
  if (booking) {
    sql += ' and attr.minbooking<=? and attr.maxbooking>=? '
    params.push(booking, booking)
  }
  if (status) {
    sql += ' and attr.status=? '
    params.push(status)
  }
  if (isPaging && page && size) {
    sql += ' limit ?,?'
    params.push(...setPageAndSize(page, size))
  }
  return {
    sql,
    params
  }
}
let poolQueryMiddleware = queryMiddleware(dbAppClient)
const roomService = {
  faceTotal (p) {
    let {name = ''} = p
    return poolQueryMiddleware('select COUNT(*) as count from face  where name like ?', [`%${name}%`])
  },
  faceList (p) {
    let {page, size = PAGESIZE, name = ''} = p
    let sql = 'select * from face '
    let params = []
    if (name) {
      sql += ' where name like ?'
      params.push(`%${name}%`)
    }
    if (page !== -1) {
      sql += ' limit ?, ?'
      params.push(...setPageAndSize(page, size))
    }
    return poolQueryMiddleware(sql, params)
  },
  getFaceById (faceId) {
    return poolQueryMiddleware('select * from face where faceId=?', [faceId])
  },
  delFaceByIds (faceIds) {
    console.log('faceIds', faceIds)
    return poolQueryMiddleware('delete from face where faceId in (?)', faceIds.join(','))
  },
  addFace (face) {
    return poolQueryMiddleware('insert into face set ?', face)
  },
  updateFace (face) {
    let {faceId, name, value, icon} = face
    return poolQueryMiddleware('update face set name=?,value=?,icon=? where faceId=?', [name, value, icon, faceId])
  },
  addFaces (faces) {
    faces = faces.map((row) => [row.name, row.value, row.icon])
    return poolQueryMiddleware('insert into face(name,value,icon) values ?', [faces])
  },
  roomTypeTotal (p) {
    let {name = ''} = p
    return poolQueryMiddleware('select COUNT(*) as count from roomtype  where name like ?', [`%${name}%`])
  },
  roomTypeList (p) {
    let {page, size, name} = p
    let sql = 'select * from roomtype '
    let params = []
    if (name) {
      sql += ' where name like ?'
      params.push(`%${name}%`)
    }
    sql += ' limit ?, ?'
    params.push(...setPageAndSize(page, size))
    return poolQueryMiddleware(sql, params)
  },
  getRoomTypeById (roomTypeId) {
    return poolQueryMiddleware('select * from roomtype where roomTypeId=?', [roomTypeId])
  },
  delRoomTypeByIds (roomTypeIds) {
    return poolQueryMiddleware('delete from roomtype where roomTypeId in (?)', roomTypeIds.join(','))
  },
  addRoomType (roomType) {
    return poolQueryMiddleware('insert into roomtype set ?', roomType)
  },
  updateRoomType (roomType) {
    let {roomTypeId, name} = roomType
    return poolQueryMiddleware('update roomtype set name=? where roomTypeId=?', [name, roomTypeId])
  },

  tagTotal (p) {
    let {tagName} = p
    return poolQueryMiddleware('select COUNT(*) as count from tags  where tagName like ?', [`%${tagName}%`])
  },
  tagList (p) {
    let {page, size, tagName} = p
    let sql = 'select * from tags '
    let params = []
    if (tagName) {
      sql += ' where tagName like ?'
      params.push(`%${tagName}%`)
    }
    sql += ' limit ?, ?'
    params.push(...setPageAndSize(page, size))
    return poolQueryMiddleware(sql, params)
  },
  getTagById (tagId) {
    return poolQueryMiddleware('select * from tags where tagId=?', [tagId])
  },
  delTagByIds (tagIds) {
    return poolQueryMiddleware('delete from tags where tagId in (?)', tagIds.join(','))
  },
  addTag (tag) {
    return poolQueryMiddleware('insert into tags set ?', tag)
  },
  updateTag (tag) {
    let {tagId, tagName, desc} = tag
    return poolQueryMiddleware('update tags set tagName=?,tags.desc=? where tagId=?', [tagName, desc, tagId])
  },

  imgTotal () {
    return poolQueryMiddleware('select COUNT(*) as count from img ')
  },
  imgList (p) {
    let {page, size} = p
    return poolQueryMiddleware('select * from tags limit ?, ?', setPageAndSize(page, size))
  },
  getImgById (imgId) {
    return poolQueryMiddleware('select * from img where imgId=?', [imgId])
  },
  delImgByIds (imgIds) {
    return poolQueryMiddleware('delete from img where imgId in (?)', imgIds.join(','))
  },
  addImg (img) {
    return poolQueryMiddleware('insert into img set ?', img)
  },
  updateImg (img) {
    let {imgId, title, url} = img
    return poolQueryMiddleware('update img set title=?,url=? where imgId=?', [title, url, imgId])
  },

  attrTotal (p) {
    let sqlInit = 'select COUNT(*) as count from roomattr as attr where 1=1 '
    let {params, sql} = getAttrQuerySQLAndParams(p)
    return poolQueryMiddleware(sqlInit + sql, params)
  },
  async attrList (p) {
    let sqlInit = 'select * from roomattr attr where 1=1 '
    let {params, sql} = getAttrQuerySQLAndParams(p, true)
    let result = {}
    await poolQueryMiddleware(sqlInit + sql, params).then((data) => {
      result = data.data
      result.forEach((row) => {
        Promise.all([
          poolQueryMiddleware('select * from layout where attrId=?', [row.rmattrId]),
          poolQueryMiddleware('select * from bed where attrId=?', [row.rmattrId]),
        ]).then((values) => {
          let [layout, bed] = values
          row.layout = layout
          row.bed = bed
        })
      })
    })
  },
  getAttrById (attrId) {
    return poolQueryMiddleware('select attr.* from roomattr as attr where rmattrId=?', [attrId])
  },
  delAttrByIds (attrIds) {
    return poolQueryMiddleware('update roomattr set status=2 where rmattrId in (?)', attrIds.join(','))
  },

  /**
   * 根据attrid 插入多条bed数据
   * @param attrId
   * @param bedArr
   * @returns {function(*): Promise<any>}
   */
  addBedByAttrId: (attrId, bedArr) => (conn) => new Promise((resolve, reject) => {
    if (bedArr.length > 0) {
      let bed = []
      bedArr.forEach((row) => {
        let {name, width, height, quantity} = row
        bed.push([name, width, height, quantity, attrId])
      })
      conn('insert into bed(name,width,height,quantity,attrId) values ?', [bed]).then((data) => {
        resolve({data: ''})
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve({data: ''})
    }
  }),
  /**
   * 根据attrid 插入多条layout数据
   * @param attrId
   * @param layoutArr
   * @returns {function(*): Promise<any>}
   */
  addLayoutByAttrId: (attrId, layoutArr) => (conn) => new Promise((resolve, reject) => {
    if (layoutArr.length > 0) {
      let layout = []
      layoutArr.forEach((row) => {
        let {name, quantity} = row
        layout.push([name, quantity, attrId])
      })
      conn('insert into layout(name,quantity,attrId) values ?', [layout]).then((data) => {
        resolve({data: ''})
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve({data: ''})
    }
  }),
  /**
   * 根据attrid 插入多条face_roomattr数据
   * @param attrId
   * @param faceIds
   * @returns {function(*): Promise<any>}
   */
  addRoomattr2face: (attrId, faceIds) => (conn) => new Promise((resolve, reject) => {
    if (faceIds.length > 0) {
      let roomattr_face_arr = []
      faceIds.forEach((face_id) => {
        roomattr_face_arr.push([attrId, face_id])
      })
      conn('insert into face_roomattr(roomattrId,faceId) values ?', [roomattr_face_arr]).then((data) => {
        resolve({data: ''})
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve({data: ''})
    }
  }),
  /**
   * // 所需参数：houseSize,name,minbooking,maxbooking,floorRange
   * // 所需对象：beds 一对多：
   *         [{name,width,height,quantity,attrId}]
   * // 所需对象：layouts 一对多
   *          [{name,quantity,attrId}]
   * // 所需对象：faces 多对多 ==>face_roomattr
   *         [{faceId,roomattrId}]
   * @param attr
   * @returns {Promise<any>}
   */
  async addAttr (attr) {
    let {beds, layouts, faces, ...rest} = attr
    let attrId = -1
    await poolQueryMiddleware('insert into roomattr set ?', rest).then((data) => {
      attrId = data.insertId
    })
    let querys = [
      this.addBedByAttrId(attrId, beds),
      this.addLayoutByAttrId(attrId, layouts),
      this.addRoomattr2face(attrId, faces)
    ]
    return transactionsMiddleware(querys)
  },
  // 暂不实现
  updateAttr (attr) {
    return null
  },

}
export default roomService
