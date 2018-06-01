import jwt from 'jsonwebtoken'
// 先采用secret 方式加密
let secret = 'secret for yi'
let client_secret = 'secret'
let options = {
  expiresIn: '1 day',
  algorithm: 'HS256'
}
const beares = 'Beares'
const data_name = 'data'

class Authentication {
  createToken (data) {
    var payload = {
      [data_name]: data
    }
    return jwt.sign(payload, secret, options)
  }

  static getReqToken (req) {
    let _token = ''
    if (req.headers.authorization) {
      let [bearerVal, token] = req.headers.authorization.split(' ')
      if (bearerVal === beares) {
        _token = token
      }
    }
    return _token
  }

  verify (req) {
    let token = Authentication.getReqToken(req)
    if (!token) {
      return false
    }
    let payload = null
    try {
      payload = jwt.verify(token, secret, {algorithm: 'RS256'})
    } catch (e) {
      console.log('error', e)
      return false
    }
    return payload
  }

  getIdentity (req) {
    let payload = this.verify(req)
    return payload && payload[data_name]
  }

  static parseUser (token, secret = client_secret) {
    return jwt.verify(token, secret, {algorithm: 'RS256'})
  }
}

export default Authentication
