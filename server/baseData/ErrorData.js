import BaseData from './index'

class ErrorData extends BaseData {
  constructor (error) {
    super({})
    this.success = false
    this.error = error
  }
}

export default ErrorData
