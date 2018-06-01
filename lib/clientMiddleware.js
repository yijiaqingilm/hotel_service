import { REQUEST, SUCCESS, FAILURE, ERROR_UNAUTHORIZED } from './const'

export default function clientMiddleware (client) {
  return (commit) => (action) => (refs) => {
    let {type, ...rest} = refs
    if (!type) {
      alert('请使用对象风格提交dispatch!!!')
      console.log(refs, 'refs')
      return
    }
    const actionName = type
    const [mutation_success, mutation_fail, mutation_request] = [`${actionName}_${SUCCESS.toLowerCase()}`, `${actionName}_${FAILURE.toLowerCase()}`, `${actionName}_${REQUEST.toLowerCase()}`]
    if (typeof action !== 'function') {
      alert('action 必须是一个函数!!!')
      return
    }
    const {promise} = action(refs)
    if (!promise) {
      alert('错误的请求方式!!!')
      return
    }
    commit(mutation_request, rest)
    return new Promise((resolve, reject) => {
      promise(client).then((result) => {
        if (result.success) {
          commit(mutation_success, {
            data: result.data, refs: rest
          })
          resolve({data: result.data})
        } else {
          commit(mutation_fail, {
            error: result.message, refs: rest
          })
          reject(result.message)
        }

      }).catch((error) => {
        let {response} = error
        if (response.timeout) {
          let errorMsg = '网络连接超时，请重试'
          commit(mutation_fail, {error: errorMsg, refs: rest})
          reject(errorMsg)
        } else if (response.status) {
          let errorMsg = '访问未授权，请重新进入'
          switch (response.status) {
            case 401:
              reject(errorMsg, response.status)
              break
            case 422:
              commit(mutation_fail, {error: response.data.error, refs: rest})
              reject(response.data.error, response.status)
              break
            /* 权限不足*/
            case 403:
              commit(mutation_fail, {error: response.data.error, refs: rest})
              reject(response.data.error, response.status)
              break
            case 404:
              commit(mutation_fail, {error: response.data.error, refs: rest})
              reject(response.data.error, response.status)
              break
            default:
              errorMsg = '遭遇系统异常，请重试'
              commit(mutation_fail, {error: errorMsg, refs: rest})
              reject(errorMsg, response.status)
          }
        } else {
          let errorMsg = '遭遇系统异常，请重试'
          commit(mutation_fail, {error: errorMsg, refs: rest})
          reject(errorMsg, 500)
        }
        throw new Error(error)
      })
    })
  }

}
