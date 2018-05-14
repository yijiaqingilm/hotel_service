import ErrorData from '../baseData/ErrorData'
import { validationResult, check } from 'express-validator/check'

const handleErr = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json(new ErrorData(errors.array()[0].msg))
  }
}
const checkPage = check('page', 'page参数格式不正确').isInt()
const setPageAndSize = (page, size) => {
  let preIndex = (page - 1) * size
  let sufIndex = (page - 1) * size + size
  return [preIndex, sufIndex]
}
export {
  handleErr,
  checkPage,
  setPageAndSize
}
