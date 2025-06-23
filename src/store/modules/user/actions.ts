import { UserService } from '@/services/UserService'
import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import UserState from './UserState'
import * as types from './mutation-types'
import { showToast } from '@/utils'
import i18n from '@/i18n'
import { updateToken } from '@/adapter'
import logger from '@/logger'

const actions: ActionTree<UserState, RootState> = {
  /**
 * Login user and return api key
 */
  async login({ commit, dispatch }, { username, password }) {
    const translate = (key: string) => i18n.global.t(key)
    try {
      const resp = await UserService.login(username, password)
      if(resp.status === 200 && resp.data) {
        if(resp.data.api_key) {
          commit(types.USER_TOKEN_CHANGED, { newToken: resp.data.api_key })
          updateToken(resp.data.api_key)
          await dispatch('getProfile')
          return resp.data;
        }
      } else {
        showToast(translate('username or password is incorrect'));
        logger.error("error", resp.data._ERROR_MESSAGE_);
        return Promise.reject(new Error(resp.data._ERROR_MESSAGE_));
      }
    } catch (err: any) {
      showToast(translate('Something went wrong'));
      logger.error("error", err);
      return Promise.reject(new Error(err))
    }
  },

  /**
   * Logout user
   */
  async logout({ commit }) {
    // TODO add any other tasks if need
    commit(types.USER_END_SESSION)
    this.dispatch('order/clearOrders')
  },
  async getProfile({ commit, dispatch }) {
    try {
      const resp = await UserService.getProfile()
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  }
}

export default actions;