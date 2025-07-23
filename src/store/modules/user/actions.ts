import { UserService } from '@/services/UserService'
import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import UserState from './UserState'
import * as types from './mutation-types'
import { showToast } from '@/utils'
import i18n from '@/i18n'
import { api, updateToken } from '@/adapter'
import logger from '@/logger'
const actions: ActionTree<UserState, RootState> = {

  /**
 * Login user and return api key
 */

  async login({ commit, dispatch }, { username, password }) {

    const translate = (key: string) => i18n.global.t(key)
    try {
      const resp = await UserService.login(username, password)
      if (resp.status === 200 && resp.data) {
        if (resp.data.api_key) {
          commit(types.USER_TOKEN_CHANGED, { newToken: resp.data.api_key })
          updateToken(resp.data.api_key)
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
  },
  async getNetSuiteDetails({ commit, dispatch }) {
    try {
      const resp = await UserService.getNetSuiteDetails()
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async register({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.registerUser(payload)
      if (resp.status === 200 && resp.data) {
        return resp.data;
      } else {
        return Promise.reject(new Error(resp.data._ERROR_MESSAGE_));
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async netSuiteCredentials({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.uploadNetSuiteCredentials(payload)
      console.log(`Response in action: ${JSON.stringify(resp)}`);
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async deleteNetSuiteCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.deleteNetSuiteCredential(payload)
      console.log(`Response in action: ${JSON.stringify(resp)}`);
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async loopCredentials({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.uploadLoopCredentials(payload)
      console.log(`Response in action: ${JSON.stringify(resp)}`);
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async getLoopDetails({ commit, dispatch }) {
    try {
      const resp = await UserService.getLoopDetails()
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async deleteLoopCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.deleteLoopCredential(payload)
      console.log(`Response in action: ${JSON.stringify(resp)}`);
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
  async verifyNetsuiteCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.verifyNetsuiteCredential(payload)
      console.log(`Response in action: ${JSON.stringify(resp)}`);
      if (resp.status === 200 && resp.data) {
        return resp.data;
      }
    } catch (err) {
      logger.error('Failed to fetch user profile information', err)
    }
  },
}

export default actions;