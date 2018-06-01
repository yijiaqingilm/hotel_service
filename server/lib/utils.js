import ErrorData from '../baseData/ErrorData'
import { validationResult, check } from 'express-validator/check'

const handleErr = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json(new ErrorData(errors.array()[0].msg))
    return
  } else {
    next()
  }
}
const checkPage = check('page', 'page参数格式不正确').isInt()
const setPageAndSize = (page, size) => {
  let preIndex = (page - 1) * size
  let sufIndex = (page - 1) * size + size
  return [preIndex, sufIndex]
}
const generateOrderNo = (suffixNumber = 8) => {
  let prefix = 'NO358977'
  let number = Array.from({length: 10}, (v, k) => k)
  let letter = []
  for (let i = 65; i <= 90; i++) {
    letter.push(String.fromCharCode(i))
  }
  let base = number.concat(letter)
  let suffix = ''
  while (suffixNumber > 0) {
    let rand = Math.floor(Math.random() * base.length)
    suffix += base[rand]
    suffixNumber--
  }
  return prefix + suffix
}
export {
  handleErr,
  checkPage,
  setPageAndSize,
  generateOrderNo
}
