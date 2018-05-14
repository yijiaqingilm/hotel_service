import { Router } from 'express'
import BaseData from '../baseData'
import ErrorData from '../baseData/ErrorData'
import mysqlErr from '../const/mysqlErrorCode'
import roomService from '../service/roomService'
import { check } from 'express-validator/check'
import { PAGESIZE } from '../const/const'
import { handleErr, checkPage } from '../lib/utils'

const router = Router()
router.post('/sys/room/face/list', [checkPage], (req, res, next) => {
  let p = req.body
  handleErr(req, res)
  Promise.all([roomService.faceTotal(p), roomService.faceList(p)]).then((values) => {
    let [total, data] = values
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/face/info', [
  check('faceId', 'faceId格式不正确').isInt()
], (req, res, next) => {
  handleErr(req, res)
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
], (req, res, next) => {
  handleErr(req, res)
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
], (req, res, next) => {
  handleErr(req, res)
  let face = req.body
  roomService.updateFace(face).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/face/del', [
  check('faceIds', '用户id格式不正确').isArray().isLength({min: 1})
], (req, res, next) => {
  handleErr(req, res)
  let faceIds = req.body.faceIds
  roomService.delFaceByIds(faceIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/type/list', [checkPage], (req, res, next) => {
  let p = req.body
  handleErr(req, res)
  Promise.all([roomService.roomTypeTotal(p), roomService.roomTypeList(p)]).then((values) => {
    let [total, data] = values
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/type/info', [
  check('roomTypeId', 'roomTypeId格式不正确').isInt()
], (req, res, next) => {
  handleErr(req, res)
  let roomTypeId = req.body.roomTypeId
  roomService.getRoomTypeById(roomTypeId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的roomType信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/type/add', [
  check('name').isLength({min: 1}),
], (req, res, next) => {
  handleErr(req, res)
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
], (req, res, next) => {
  handleErr(req, res)
  let roomtype = req.body
  roomService.updateRoomType(roomtype).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/type/del', [
  check('roomtypeIds', '用户id格式不正确').isArray().isLength({min: 1})
], (req, res, next) => {
  handleErr(req, res)
  let roomtypeIds = req.body.roomtypeIds
  roomService.delRoomTypeByIds(roomtypeIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

router.post('/sys/room/tag/list', [checkPage], (req, res, next) => {
  let p = req.body
  handleErr(req, res)
  Promise.all([roomService.tagTotal(p), roomService.tagList(p)]).then((values) => {
    let [total, data] = values
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/info', [
  check('tagId', 'tagId格式不正确').isInt()
], (req, res, next) => {
  handleErr(req, res)
  let tagId = req.body.tagId
  roomService.getTagById(tagId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的tag信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/add', [
  check('tagName').isLength({min: 1}),
], (req, res, next) => {
  handleErr(req, res)
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
], (req, res, next) => {
  handleErr(req, res)
  let tag = req.body
  roomService.updateTag(tag).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/tag/del', [
  check('tagIds', 'tagids格式不正确').isArray().isLength({min: 1})
], (req, res, next) => {
  handleErr(req, res)
  let tagIds = req.body.tagIds
  roomService.delTagByIds(tagIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/list', [checkPage], (req, res, next) => {
  let p = req.body
  handleErr(req, res)
  Promise.all([roomService.attrTotal(p), roomService.attrList(p)]).then((values) => {
    let [total, data] = values
    data && data.forEach((row) => {
      // let attr = result
    })
    res.json(new BaseData({total: total[0].count, data}))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/info', [
  check('attrId', 'attrId格式不正确').isInt()
], (req, res, next) => {
  handleErr(req, res)
  let attrId = req.body.attrId
  roomService.getAttrById(attrId).then((data) => {
    if (data.length > 0) {
      res.json(new BaseData(data[0]))
    } else {
      res.status(404).json(new ErrorData('请求的attr info信息没找到'))
    }

  }).catch((error) => {
    res.json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/add', [
  check('name').isLength({min: 1}),
], (req, res, next) => {
  handleErr(req, res)
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
], (req, res, next) => {
  handleErr(req, res)
  let attr = req.body
  roomService.updateAttr(attr).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})
router.post('/sys/room/attr/del', [
  check('attrIds', 'attrIds格式不正确').isArray().isLength({min: 1})
], (req, res, next) => {
  handleErr(req, res)
  let attrIds = req.body.attrIds
  roomService.delAttrByIds(attrIds).then((data) => {
    res.json(new BaseData(data))
  }).catch((error) => {
    res.status(500).json(new ErrorData(error))
  })
})

export default router
