import { Router } from 'express'
import BaseData from '../baseData'
import ErrorData from '../baseData/ErrorData'
import mysqlErr from '../const/mysqlErrorCode'
import roomService from '../service/roomService'
import { check } from 'express-validator/check'
import { PAGESIZE } from '../const/const'
import { handleErr, checkPage } from '../lib/utils'
import redisClient, { redisPub } from '../middleware/redisConnect'

const router = Router()
router.post('/sys/room/face/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  Promise.all([roomService.faceTotal(p), roomService.faceList(p)]).then((values) => {
    let [total, data] = values
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/face/info', [
  check('faceId', 'faceId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let faceId = req.body.faceId
  roomService.getFaceById(faceId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的Face信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/face/add', [
  check('name').isLength({min: 1}),
  check('value').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let face = req.body
  roomService.addFace(face).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('face不能重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/face/edit', [
  check('name').isLength({min: 1}),
  check('value').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let face = req.body
  roomService.updateFace(face).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/face/del', [
  check('faceIds', '用户id格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let faceIds = req.body.faceIds
  roomService.delFaceByIds(faceIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/type/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  roomService.roomTypeList(p).then((data) => {
    res.json(new BaseData({total: data.count, data: data.rows}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/type/info', [
  check('roomTypeId', 'roomTypeId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let roomTypeId = req.body.roomTypeId
  roomService.getRoomTypeById(roomTypeId).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('请求的roomType信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/type/add', [
  check('name').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomtype = req.body
  roomService.addRoomType(roomtype).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('roomtype不能重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/type/edit', [
  check('name').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomtype = req.body
  roomService.updateRoomType(roomtype).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/type/del', [
  check('roomTypeIds', '用户id格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomTypeIds = req.body.roomTypeIds
  roomService.delRoomTypeByIds(roomTypeIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/tag/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  let {page} = p
  if (page !== -1) {
    roomService.tagList(p).then((data) => {
      res.json(new BaseData({total: data.count, data: data.rows}))
    }).catch((error) => {
      res.status(500).json(new ErrorData(error))
    })
  } else {
    roomService.tagListAll().then((data) => {
      res.json(new BaseData(data))
    }).catch((error) => {
      res.status(500).json(new ErrorData(error))
    })
  }
})
router.post('/sys/room/tag/info', [
  check('tagId', 'tagId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let tagId = req.body.tagId
  roomService.getTagById(tagId).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('请求的tag信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/add', [
  check('tagName').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let tag = req.body
  roomService.addTag(tag).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('tagName不能重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/edit', [
  check('tagName').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let tag = req.body
  roomService.updateTag(tag).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/del', [
  check('tagIds', 'tagids格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let tagIds = req.body.tagIds
  roomService.delTagByIds(tagIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/attr/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  let page = p.page
  if (page !== -1) {
    roomService.attrList(p).then((data) => {
      res.json(new BaseData({total: data.count, data: data.rows}))
    }).catch((error) => {
      res.status(500).json(new ErrorData(error))
    })
  } else {
    roomService.attrListAll(p).then((data) => {
      res.json(new BaseData(data))
    })
  }

})
router.post('/sys/room/attr/info', [
  check('attrId', 'attrId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let attrId = req.body.attrId
  roomService.getAttrById(attrId).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('请求的attr info信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/add', [
  check('name').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let attr = req.body
  roomService.addAttr(attr).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    switch (error.code) {
      case mysqlErr.ER_DUP_ENTRY:
        res.status(422).json(new ErrorData('name不能重复'))
        break
      default:
        res.status(500).json(new ErrorData(error.code))
    }
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/edit', [
  check('name').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let attr = req.body
  roomService.updateAttr(attr).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/del', [
  check('attrIds', 'attrIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let attrIds = req.body.attrIds
  roomService.delAttrByIds(attrIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/img/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  roomService.imgList(p).then((data) => {
    res.json(new BaseData({total: data.count, data: data.rows}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/img/info', [
  check('imgId', 'imgId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let imgId = req.body.imgId
  roomService.getImgById(imgId).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('img info信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/img/add', [
  check('title', '标题不能为空').isLength({min: 1}),
  check('url', 'url不能为空').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let attr = req.body
  roomService.addImg(attr).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/img/edit', [
  check('title', '标题不能为空').isLength({min: 1}),
  check('url', 'url不能为空').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let img = req.body
  roomService.updateImg(img).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/img/del', [
  check('imgIds', 'imgIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let imgIds = req.body.imgIds
  roomService.delImgByIds(imgIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/list', [checkPage, handleErr], (req, res, next) => {
  let p = req.body
  roomService.roomList(p).then((data) => {
    res.json(new BaseData({total: data.count, data: data.rows}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/list/all', (req, res, next) => {
  let p = req.body
  roomService.roomListAll(p).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/info', [
  check('roomId', 'roomId格式不正确').isInt(),
  handleErr
], (req, res, next) => {
  let roomId = req.body.roomId
  roomService.getRoomById(roomId).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('room info信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/add', [handleErr], (req, res, next) => {
  let room = req.body
  roomService.addRoom(room).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/edit', [handleErr], (req, res, next) => {
  let room = req.body
  roomService.updateRoom(room).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/del', [
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomIds = req.body.roomIds
  roomService.delRoomByIds(roomIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
//   将下单的房源锁定并创建订单
// 应该新增 对user的判断 cardid不能为空
router.post('/sys/room/locked', [
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  check('dates', 'dates 格式不正确').isArray().isLength({min: 1}),
  check('user.cardId', '用户身份证必填').isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let {roomIds, user, dates} = req.body
  let [checkInTime, checkOutTime] = dates
  let days = Math.ceil((checkOutTime - checkInTime) / 1000 / 60 / 60 / 24)
  roomService.roomLockedAndCreateOrder(roomIds, user, days).then((data) => {
    let {lockTime, userInfo, order} = data
    let {orderNo, total, deposit, days} = order
    let {name, type, cardId, vipCardId, mobile, userId} = userInfo
    res.json(new BaseData({
      lockTime,
      order: {
        orderNo,
        total,
        deposit,
        days
      },
      user: {
        name, type, cardId, vipCardId, mobile, userId
      },
      roomIds
    }))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
// 关闭订单
router.post('/sys/room/cancel/order', [
  check('orderId', '订单id必填').isLength({min: 1}),
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let {orderId, roomIds} = req.body
  res.redirect('/sys/room/enabled')
})
router.post('/sys/room/checkIn', [
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  check('orderNo', 'orderNo格式不正确').isLength({min: 16, max: 16}),
  handleErr
], (req, res, next) => {
  let {roomIds, orderNo} = req.body
  let orderKey = `order:${orderNo}`
  let deblockingKey = `task:deblocking:${orderNo}`
  redisClient.get(orderKey, async (err, order) => {
    order = JSON.parse(order)
    if (!err) {
      roomService.roomCheckIn(roomIds, order).then((data) => {
        redisClient.del(deblockingKey)
        redisClient.del(orderKey)
        res.json(new BaseData({orderNo: order.orderNo}))
      }).catch((error) => {
        res.status(500).json(new ErrorData(error))
      })
    } else {
      console.log('获取订单 err', err)
    }
  })
})
// 获取入住用户信息
router.post('/sys/room/checkInInfo', [
  check('orderNo', 'orderNo格式不正确').isLength({min: 16, max: 16}),
  handleErr
], (req, res, next) => {
  let {orderNo} = req.body
  roomService.checkInInfo(orderNo).then((data) => {
    if (data) {
      res.json(new BaseData(data))
    } else {
      res.status(404).json(new ErrorData('请求的用户信息没找到'))
    }
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
// 应该新增对room的判断 orderNO不能为空
router.post('/sys/room/checkOut', [
  check('orderNo', 'orderNo格式不正确').isLength({min: 16, max: 16}),
  handleErr
], (req, res, next) => {
  let room = req.body
  roomService.roomCheckOut(room).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/disable', [
  check('roomIds', 'roomId格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomIds = req.body.roomIds
  roomService.roomDisable(roomIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/enabled', [
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomIds = req.body.roomIds
  roomService.roomEnabled(roomIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/clear', [
  check('roomIds', 'roomIds格式不正确').isArray().isLength({min: 1}),
  handleErr
], (req, res, next) => {
  let roomIds = req.body.roomIds
  roomService.roomClear(roomIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
/* 暂不实现*/
router.post('/sys/room/change', [handleErr], (req, res, next) => {
  let room = null
  let nowRoom = null
  let user = null
  roomService.roomChange(room, nowRoom, user).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
export default router
