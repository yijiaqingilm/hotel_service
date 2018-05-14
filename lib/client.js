import Vue from 'vue'
import axios from '~/plugins/axios'

const methods = ['get', 'post', 'put', 'del', 'patch']
export default class ApiClient {
  constructor () {
    methods.forEach((method) => {
      this[method] = (url, params = {}, {global = true, isManager = false} = {}) => new Promise((resolve, reject) => {
        if (!url) {
          reject({_error: '错误的请求地址'})
        }
        axios({
          method: method,
          url: url,
          data: params,
          global: global
        }).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    })
  }
}

