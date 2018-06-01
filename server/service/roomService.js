import dbAppClient from '../db/index'
import queryMiddleware from '../middleware/queryMiddleware'
import transactionsMiddleware from '../middleware/transactionsMiddleware'
import { setPageAndSize, generateOrderNo } from '../lib/utils'
import { PAGESIZE, room_attr_status, room_status, userType, order_status, orderSource } from '../const/const'
import * as Model from '../db/AuthorModel'
import Sequelize from 'sequelize'
import sequelize from '../db/sequelize'
import redisClient, { redisPub } from '../middleware/redisConnect'

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
    let {page, size = 10, tagName} = p
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
  tagListAll () {
    return Model.Tag.findAll()
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
  attrListAll (p) {
    return Model.RoomAttr.findAll({
      where: {
        status: room_attr_status.usable
      }
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
    let {page, size = PAGESIZE, userName, userIdCard, status, roomattrId} = p
    let [offset, limit] = setPageAndSize(page, size)
    let where = {}
    if (userName) {
      where.userName = {[Op.like]: `${userName}%`}
    }
    if (userIdCard) {
      where.userIdCard = {[Op.eq]: userIdCard}
    }
    if (status) {
      where.status = {[Op.eq]: status}
    }
    if (roomattrId) {
      where.roomattrId = {[Op.eq]: roomattrId}
    }
    return Model.Room.findAndCountAll({
      offset, limit,
      where,
      include: [
        {
          model: Model.RoomAttr,
          attributes: ['name', 'rmattrId', 'maxbooking'],
          as: 'roomAttr'
        }
      ],
      distinct: true
    })
  },
  roomListAll (p) {
    let {userName, userIdCard, status, roomattrId} = p
    let where = {}
    if (userName) {
      where.userName = {[Op.like]: `${userName}%`}
    }
    if (userIdCard) {
      where.userIdCard = {[Op.eq]: userIdCard}
    }
    if (status) {
      where.status = {[Op.eq]: status}
    }
    if (roomattrId) {
      where.roomattrId = {[Op.eq]: roomattrId}
    }
    return Model.Room.findAll({
      where,
      include: [
        {
          model: Model.RoomAttr,
          attributes: ['name', 'rmattrId', 'maxbooking'],
          as: 'roomAttr'
        }
      ],
      distinct: true
    })
  },
  getRoomById (roomId) {
    return Model.Room.findById(roomId, {
      include: [
        {
          model: Model.Img,
          attributes: ['title', 'url'],
          through: {
            attributes: []
          }
        },
        {
          model: Model.Tag,
          attributes: ['tagName', 'desc', 'tagId'],
          through: {
            attributes: []
          }
        }
      ]
    })
  },
  addRoom (room) {
    let {tags = [], imgs = [], ...rest} = room
    return sequelize.transaction(async (t) => {
      let {rid} = await Model.Room.create(rest, {transaction: t})
      imgs = imgs.map((imgId) => ({room_id: rid, img_id: imgId}))
      tags = tags.map((tagId) => ({room_id: rid, tag_id: tagId}))
      return Promise.all([
        Model.Room2Img.bulkCreate(imgs, {transaction: t}),
        Model.Room2Tag.bulkCreate(tags, {
          transaction: t,
          fields: ['room_id', 'tag_id']
        })
      ])
    })
  },
  updateRoom (room) {
    let {tags = [], imgs = [], ...rest} = room
    let {rid, ...roomInfo} = rest
    return sequelize.transaction(async (t) => {
      imgs = imgs.map((imgId) => ({room_id: rid, img_id: imgId}))
      tags = tags.map((tagId) => ({room_id: rid, tag_id: tagId}))
      await Promise.all([
        Model.Room2Img.destroy({
          transaction: t,
          where: {
            room_id: rid
          }
        }),
        Model.Room2Tag.destroy({
          transaction: t,
          where: {
            room_id: rid
          }
        })
      ])
      return Promise.all([
        Model.Room.update(roomInfo, {
          where: {
            rid
          }
        }),
        Model.Room2Img.bulkCreate(imgs, {transaction: t}),
        Model.Room2Tag.bulkCreate(tags, {
          transaction: t,
          fields: ['room_id', 'tag_id']
        })
      ])
    })
  },
  delRoomByIds (roomIds) {
    return Model.Room.update({status: room_status.delete}, {
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    })
  },
  /**
   * 房间入住 by 线上下单支付 只需缴纳押金
   * @param roomIds
   * @param user
   * @returns {Promise<*>}
   */
  /* async roomCheckInByOrder (roomIds, user) {
    let {userId, ...userInfo} = user
    // 查询房间最新信息 防止数据异步写入造成bug
    let rooms = await Model.Room.findAll({
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    })
    let use = rooms.every((room) => room.status === room_status.usable)
    if (!use) {
      return Promise.reject({error: '存在不可使用的房间'})
    }
    return Model.Room.update(
      {
        status: room_status.checkIn,
        uId: userId,
        userIdCard: userInfo.cardId,
        userName: userInfo.name,
        userMobile: userInfo.mobile
      },
      {
        where: {
          rid: {
            [Op.in]: roomIds
          }
        }
      })
  },*/
  /**
   * 将下单的房源锁定并创建订单
   * @param roomIds {lockTime, timer, userInfo, deposit, total}
   * @returns {Promise<*>} ( 返回 用户信息，订单信息，房源锁定的时间，定时器locktime：用于自动解锁)
   */
  roomLockedAndCreateOrder: (roomIds, user, days = 1) => new Promise(async (resolve, reject) => {
    // 查询房间最新信息 防止数据异步写入造成bug
    let rooms = await Model.Room.findAll({
      where: {
        rid: {
          [Op.in]: roomIds
        }
      },
      include: [
        {
          model: Model.RoomAttr,
          attributes: ['deposit', 'rmattrId', 'price', 'oprice', 'vipprice'],
          as: 'roomAttr'
        }
      ]
    })
    let use = rooms.every((room) => room.status === room_status.usable)
    if (!use) {
      reject('存在不可使用的房间')
    }
    await Model.Room.update({
      status: room_status.locking,

    }, {
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    }).catch((err) => {
      reject({error: '服务异常:' + err})
    })
    try {
      // 查询用户信息是否存在 若存在返回用户信息不存在创建用户返回用户信息
      let userInfo = await roomService.getUserIfNotExistsByCreate(user)
      // 金额分押金和总额。
      let total = 0
      let deposit = 0
      rooms.forEach((row) => {
        let {roomAttr} = row
        if (userInfo.type === userType.ordinary) {
          deposit += roomAttr.deposit
          total += roomAttr.price * days
        } else {
          total += roomAttr.vipprice * days
        }
      })
      if (userInfo.type !== userType.ordinary && userInfo.balance < total) {
        reject({error: '余额不足'})
        return
      }
      // 创建订单
      let orderNo = null
      let findOrder = null
      do {
        orderNo = generateOrderNo()
        findOrder = await Model.Order.findOne({
          where: {
            orderNo
          }
        })
      } while (findOrder)
      let order = {
        uId: userInfo.userId,
        status: order_status.noPay,
        total,
        deposit,
        orderNo,
        source: orderSource.counter,
        checkInTime: new Date().getTime(),
        days,
        roomIds
      }
      // 定时清除被锁定的房间
      let lockTime = 10 // 锁定15分钟 //测试锁定10s
      redisPub.set(`task:deblocking:${orderNo}`, '', 'EX', lockTime)
      redisPub.set(`order:${orderNo}`, JSON.stringify(order), 'EX', 60 * 60 * 24)
      resolve({lockTime, userInfo, order})
    } catch (e) {
      console.log('err', e)
    }

  }),
  /**
   * 获取用户信息如果不存在就创建新用户
   * @param user
   * @returns {Promise<*>}
   */
  async getUserIfNotExistsByCreate (user) {
    let {cardId, vipCardId} = user
    let where = {}
    if (cardId) {
      where.cardId = cardId
    }
    if (vipCardId) {
      where.vipCardId = vipCardId
    }
    let userInfo = await Model.User.findOne({
      where
    })
    if (userInfo) {
      return userInfo
    } else {
      // 创建普通用户
      userInfo = await Model.User.create({
        cardId
      })
      return userInfo
    }
  },
  /**
   * 房间入住 by 线下人工下单
   * @param roomIds
   * @param order
   *   所需操作。手动锁定房源=》 生成订单 =》等待支付=》(??需安全支付》存在信息劫持问题。)确定支付=》确定入住
   *   确定入住：修改房间状态和订单状态，生成order2room
   * @returns {Promise<void>}
   */
  async roomCheckIn (roomIds, order) {
    return sequelize.transaction(async (t) => {
      let updateRoom = Model.Room.update(
        {
          status: room_status.checkIn,
          orderNo: order.orderNo
        },
        {
          where: {
            rid: {
              [Op.in]: roomIds
            }
          },
          transaction: t
        })
      order.status = order_status.depositPaid
      let createOrder = await Model.Order.create(order)
      let order2roomArr = roomIds.map((room_id) => ({room_id, order_id: createOrder.orderId}))
      let createOrder2room = Model.Order2Room.bulkCreate(order2roomArr, {
        transaction: t
      })
      return Promise.all([updateRoom, createOrder2room])
    })
  },

  async checkInInfo (orderNo) {
    let order = await Model.Order.findOne({
      where: {
        orderNo
      },
      include: [{
        model: Model.User,
        attributes: ['userId', 'type', 'name', 'mobile', 'cardId'],
        as: 'user'
      }]
    })
    return order.user
  },

  /* 退房条件：1 可根据房间号退房可拿到订单号，返回所需费用和退还的押金 */
  /* 所需操作，解除room与订单的绑定，修改房间状态和订单状态*/
  roomCheckOut: (room) => new Promise(async (resolve, reject) => {
    try {
      let {orderNo} = room
      let order = await Model.Order.findOne({
        where: {
          orderNo
        }
      }).catch((err) => {
        reject(err)
      })
      let userPromise = order.getUser()
      let RoomPromise = order.getRoom({
        include: [{
          model: Model.RoomAttr,
          as: 'roomAttr'
        }]
      })
      Promise.all([userPromise, RoomPromise]).then((values) => {
        let [userInfo, rooms] = values
        let days = roomService.computeDay(order.checkInTime, new Date())
        // 计算所需费用和退还的押金
        let total = 0
        let depositTotal = 0
        rooms.forEach((room) => {
          let {roomAttr} = room
          let {price, vipprice, deposit} = roomAttr
          if (userInfo.type === userType.ordinary) {
            total += price * days
            depositTotal += deposit
          } else {
            total += vipprice * days
          }

          // 解除rooms中的orderno
          room.orderNo = null
          room.status = room_status.clearing
        })
        order.status = order_status.expire
        order.checkOutTime = new Date()
        if (userInfo.type !== userType.ordinary) {
          userInfo.balance -= total
          if (userInfo.balance <= 0) {
            reject({error: '余额不足，请充值'})
            return
          }
        } else {
          total -= order.total
        }
        let saveUser = userInfo.save()
        let saveOrder = order.save()
        let unbindOrder2room = order.setRoom([])
        console.log('rooms.map((room) => room.rid)', rooms.map((room) => room.rid))
        let RoomsPromise = Model.Room.update(
          {
            orderNo: null,
            status: room_status.clearing
          },
          {
            where: {
              rid: {
                [Op.in]: rooms.map((room) => room.rid)
              }
            }
          })
        Promise.all([saveOrder, saveUser, RoomsPromise, unbindOrder2room]).then(() => {
          console.log('total', total, '--', depositTotal)
          resolve({total, deposit: depositTotal, order, userInfo})
        }).catch((err) => {
          reject(err)
        })

      }).catch((err) => {
        reject(err)
      })
    } catch (e) {
      reject(e)
    }
  }),
  /**
   * 计算入住天数 ，(超过当天十二点半多算一天)
   * @param startTime
   * @param endTime
   * @returns {number}
   */
  computeDay (startTime, endTime = new Date()) {
    let days = 0
    const maxHours = 12
    const maxMinutes = 30
    days = Math.ceil((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24)
    days === 0 && days++
    // 判断退房和入住是否为同一天
    let isSameDays = startTime.getFullYear() === endTime.getFullYear() && startTime.getMonth() === endTime.getMonth() && startTime.getDate() === endTime.getDate()
    if (!isSameDays && startTime.getDate() !== endTime.getDate() && endTime.getHours() > maxHours || (endTime.getHours() === maxHours && endTime.getMilliseconds() > maxMinutes)) {
      days++
    }
    return days
  },
  roomDisable (roomIds) {
    return Model.Room.update({status: room_status.disable}, {
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    })
  },
  roomEnabled (roomIds) {
    return Model.Room.update({status: room_status.usable}, {
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    })
  },
  roomClear (roomIds) {
    return Model.Room.update({status: room_status.usable}, {
      where: {
        rid: {
          [Op.in]: roomIds
        }
      }
    })
  },
  roomChange (room, nowRoom, user) {
    return Promise.resolve()
  }
}
export default roomService
