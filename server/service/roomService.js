import dbAppClient from '../db/index'
import queryMiddleware from '../middleware/queryMiddleware'
import transactionsMiddleware from '../middleware/transactionsMiddleware'
import { setPageAndSize } from '../lib/utils'
import { PAGESIZE, room_attr_status } from '../const/const'
import * as Model from '../db/AuthorModel'
import Sequelize from 'sequelize'
import sequelize from '../db/sequelize'

const Op = Sequelize.Op

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
  roomTypeList (p) {
    let {page, size, name = ''} = p
    let [offset, limit] = setPageAndSize(page, size)
    let where = {}
    if (name) {
      where.name = {[Op.like]: `%${name}%`}
    }
    return Model.RoomType.findAndCountAll({
      where,
      offset,
      limit
    })
  },
  getRoomTypeById (roomTypeId) {
    return Model.RoomType.findById(roomTypeId)
  },
  delRoomTypeByIds (roomTypeIds) {
    return Model.RoomType.destroy({
      where: {
        roomTypeId: {
          [Op.in]: roomTypeIds
        }
      }
    })
  },
  addRoomType (roomType) {
    return Model.RoomType.create(roomType)
  },
  updateRoomType (roomType) {
    let {roomTypeId, name} = roomType
    return Model.RoomType.update({name}, {
      where: {
        roomTypeId
      }
    })
  },
  tagList (p) {
    let {page, size, tagName} = p
    let where = {}
    if (tagName) {
      where.tagName = {[Op.like]: `%${tagName}%`}
    }
    let [offset, limit] = setPageAndSize(page, size)
    return Model.Tag.findAndCountAll({
      where,
      offset,
      limit
    })
  },
  getTagById (tagId) {
    return Model.Tag.findById(tagId)
  },
  delTagByIds (tagIds) {
    return Model.Tag.destroy({
      where: {
        tagId: {
          [Op.in]: tagIds
        }
      }
    })
  },
  addTag (tag) {
    return Model.Tag.create(tag)
  },
  updateTag (tag) {
    let {tagId, tagName, desc} = tag
    return Model.Tag.update({tagName, desc}, {
      where: {
        tagId: tagId
      }
    })
  },
  imgList (p) {
    let {page, size} = p
    let [offset, limit] = setPageAndSize(page, size)
    return Model.Img.findAndCountAll({
      offset,
      limit
    })
  },
  getImgById (imgId) {
    return Model.Img.findById(imgId, {
      attributes: ['title', 'url', 'imgId']
    })
  },
  delImgByIds (imgIds) {
    return Model.Img.destroy({
      where: {
        imgId: {
          [Op.in]: imgIds
        }
      }
    })
  },
  addImg (img) {
    return Model.Img.create(img)
  },
  updateImg (img) {
    let {imgId, title, url} = img
    return Model.Img.update({title, url}, {
      where: {
        imgId
      }
    })
  },
  attrList (p) {
    let {page, size = 10} = p
    let [offset, limit] = setPageAndSize(page, size)
    return Model.RoomAttr.findAndCountAll({
      offset,
      limit,
      where: {
        status: {
          [Op.not]: room_attr_status.delete
        }
      },
      attributes: ['rmattrId', 'size', 'name', 'minbooking', 'maxbooking', 'floorRange', 'status'],
      include: [
        {
          model: Model.Layout,
          attributes: ['name', 'quantity']
        },
        {
          model: Model.Bed,
          attributes: ['name', 'width', 'height', 'quantity']
        },
        {
          model: Model.Face,
          attributes: ['name', 'value', 'icon'],
          through: {
            attributes: [],
          }
        }
      ],
      distinct: true
    })
  },
  getAttrById (attrId) {
    return Model.RoomAttr.findById(attrId, {
      include: [
        {
          model: Model.Layout,
          attributes: ['name', 'quantity']
        },
        {
          model: Model.Bed,
          attributes: ['name', 'width', 'height', 'quantity']
        },
        {
          model: Model.Face,
          attributes: ['name', 'value', 'icon', 'faceId'],
          through: {
            attributes: [],
          }
        }
      ]
    })
  },
  delAttrByIds (attrIds) {
    return poolQueryMiddleware('update roomattr set status=2 where rmattrId in (?)', attrIds.join(','))
  },
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
  addAttr (attr) {
    let {beds, layouts, faces, ...rest} = attr
    return sequelize.transaction(async (t) => {
      let {rmattrId} = await Model.RoomAttr.create(rest, {transaction: t})
      beds = beds.map((bed) => Object.assign({attrId: rmattrId}, bed))
      layouts = layouts.map((layout) => Object.assign({attrId: rmattrId}, layout))
      faces = faces.map((faceId) => ({roomattrId: rmattrId, faceId}))
      return Promise.all([
        Model.Bed.bulkCreate(beds, {transaction: t}),
        Model.Layout.bulkCreate(layouts, {transaction: t}),
        Model.Face2Roomattr.bulkCreate(faces, {transaction: t})
      ])
    })
  },
  updateAttr (attr) {
    let {beds, layouts, faces, ...rest} = attr
    let {rmattrId, ...roomAttr} = rest
    return sequelize.transaction(async (t) => {
      beds = beds.map((bed) => Object.assign({attrId: rmattrId}, bed))
      layouts = layouts.map((layout) => Object.assign({attrId: rmattrId}, layout))
      faces = faces.map((faceId) => ({roomattrId: rmattrId, faceId}))
      await Promise.all([
        Model.Face2Roomattr.destroy({
          transaction: t,
          where: {
            roomattrId: rmattrId
          }
        }),
        Model.Bed.destroy({
          transaction: t,
          where: {
            attrId: rmattrId
          }
        }),
        Model.Layout.destroy({
          transaction: t,
          where: {
            attrId: rmattrId
          }
        })
      ])
      return Promise.all([
        Model.RoomAttr.update(roomAttr, {
          where: {rmattrId},
          transaction: t
        }),
        Model.Bed.bulkCreate(beds, {transaction: t}),
        Model.Layout.bulkCreate(layouts, {transaction: t}),
        Model.Face2Roomattr.bulkCreate(faces, {transaction: t})
      ])
    })
  },

  roomList (p) {
    let {page, size, userName, userIdCard, status, roomattrId} = p
    let [offset, limit] = setPageAndSize(page, size)
    return
  }
}
export default roomService
