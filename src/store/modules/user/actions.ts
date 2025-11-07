import { UserService } from '@/services/UserService'
import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import UserState from './UserState'
import * as types from './mutation-types'
import { showToast } from '@/utils'
import { hasError, updateToken } from '@/adapter'
import logger from '@/logger'
import i18n, { translate } from '@/i18n'

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
  },
  async getProfile({ commit, dispatch }) {
    try {
      const resp = await UserService.getProfile()
      if (!hasError(resp) && resp.status === 200) {
        commit(types.USER_ORGANIZATION_DETAILS, resp.data.organizationDetailList[0] )
        return resp
      } else {
        throw resp.data
      }
    }
    catch (err) {
      logger.error(err)
      showToast(translate("Failed to fetch user profile."));
    }
  },
  async getNetSuiteDetails({ commit, dispatch }) {
    try {
      const resp = await UserService.getNetSuiteDetails()
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to fetch NetSuite user details."));
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
      logger.error(err)
      showToast(translate("unable to create a user"))
    }
  },
  async netSuiteCredentials({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.uploadNetSuiteCredentials(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to save NetSuite credentials."));
    }
  },
  async netsuiteMapping({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.postNetsuiteMapping(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to add NetSuite RMA mapping List."));
    }
  },
  async syncNetsuiteMapping({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.syncNetsuiteMapping(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast("Unable to sync NetSuite mapping. Please try again.");
    }
  },
  async deleteIntegrationTypeMappings({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.deleteIntegrationTypeMappings(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to delete NetSuite mapping. Please try again."));
    }
  },
  async deleteNetSuiteCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.deleteNetSuiteCredential(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to delete NetSuite credential."));
    }
  },
  async loopCredentials({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.uploadLoopCredentials(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to save Loop credentials."));
    }
  },
  async getLoopDetails({ commit, dispatch }) {
    try {
      const resp = await UserService.getLoopDetails()
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to fetch Loop user details."));
    }
  },
  async deleteLoopCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.deleteLoopCredential(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to delete Loop credential."));
    }
  },
  async verifyNetsuiteCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.verifyNetsuiteCredential(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to verify NetSuite Credential. Please try again either delete the credential and add it again."));
    }
  },
  async verifyloopCredential({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.verifyloopCredential(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to verify Loop Credential. Please try again either delete the credential and add it again."));
    }
  },
  async getVerifyLoopWebhook({ commit, dispatch }) {
    try {
      const resp = await UserService.getVerifyLoopWebhook()
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to verify Loop webhook subscribe. Please try again either delete the credential and add it again."));
    }
  },
  async postAPIKey({ commit, dispatch }, payload) {
    try {
      const resp = await UserService.postAPIKey(payload)
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to get NetSuite apiKey. Please try again."));
    }
  },
  async getNetSuiteRMATypeMapping({ commit, dispatch }) {
    try {
      const resp = await UserService.getNetSuiteRMATypeMapping()
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to fetch NetSuite RMA type mapping."));
    }
  },
  async getNetSuiteRMAMapping({ commit, dispatch }) {
    try {
      const resp = await UserService.getNetSuiteRMAMapping()
      if (!hasError(resp) && resp.status === 200) {
        return resp.data;
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Unable to fetch NetSuite RMA mapping List."));
    }
  },
}

export default actions;