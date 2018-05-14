import Vue from 'vue'
import { Cache } from './utils'
import ApiClient from './client'
import clientMiddleware from './clientMiddleware'

let ActionManager = {}
let token
let setToken = (_token) => {token = _token}
let getToken = () => token

export { ActionManager, setToken, getToken }
