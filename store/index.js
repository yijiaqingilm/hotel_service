import Vue from 'vue'
import Vuex from 'vuex'
import clientMiddleware from '../lib/clientMiddleware'
import ApiClient from '../lib/client'
import * as users from './modules/users'
import * as rooms from './modules/rooms'

Vue.use(Vuex)
const store = new Vuex.Store({
  /* actions,*/
  state: {
    userInfo: {name: 'test'}
  },
  mutations: {},
  actions: {},
  modules: {users, rooms}
})
let client = new ApiClient()
let applyClientMiddleware = clientMiddleware(client)(store.commit)
export { applyClientMiddleware }
const createStore = () => store
export default createStore
