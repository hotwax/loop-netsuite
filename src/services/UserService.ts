import { api, client } from '@/adapter';
import store from '@/store';

const login = async (username: string, password: string): Promise<any> => {
  const url = process.env.VUE_APP_BASE_URL
  const baseURL = url.startsWith('http') ? url.includes('/rest/s1/netsuite-loop-connector') ? url : `${url}/rest/s1/netsuite-loop-connector/` : `https://${url}.hotwax.io/rest/s1/netsuite-loop-connector/`;
  return await client({
    url: "login",
    method: "post",
    baseURL,
    data: {
      username,
      password
    },
    headers: {
      "Content-Type": "application/json"
    }
  }) as any
}

const checkPermission = async (payload: any): Promise<any> => {
  let baseURL = store.getters['user/getInstanceUrl'];
  baseURL = baseURL && baseURL.startsWith('http') ? baseURL : `https://${baseURL}.hotwax.io/api/`;
  return client({
    url: "checkPermission",
    method: "post",
    baseURL: baseURL,
    ...payload
  });
}

const getProfile = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/profile",
    method: "get",
  });
}

const getNetSuiteDetails = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/netsuiteDetails",
    method: "get",
  });
}

const registerUser = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/register",
    method: "post",
    data: payload
  });
}

const uploadNetSuiteCredentials = async (payload: any): Promise<any> => {
  const formData = new FormData();
  formData.append('sshKey', payload.sshKey, payload.sshKey.name);
  formData.append('remoteId', payload.remoteId);
  formData.append('sharedSecret', payload.sharedSecret);
  formData.append('sendSharedSecret', payload.sendSharedSecret);
  formData.append('accountType', payload.accountType);
  return api({
    url: "/netsuite-loop-connector/organizations/netsuiteDetails",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

const deleteNetSuiteCredential = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/netsuiteDetails",
    method: "delete",
    data: {
      systemMessageRemoteId: payload.systemMessageRemoteId,
      accountType: payload.accountType
    }
  });
}

const uploadLoopCredentials = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/loopDetails",
    method: "post",
    data: payload
  });
}

const getLoopDetails = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/loopDetails",
    method: "get",
  });
}

const deleteLoopCredential = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/loopDetails",
    method: "delete",
    data: {
      systemMessageRemoteId: payload.systemMessageRemoteId,
      accountType: payload.accountType
    }
  });
}

const verifyNetsuiteCredential = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/verifyNetSuiteConnection",
    method: "post",
    data: {
      systemMessageRemoteId: payload
    }
  });
}

const verifyloopCredential = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/subscribeLoopWebhook",
    method: "post",
    data: {
      systemMessageRemoteId: payload.systemMessageRemoteId,
      accountType: payload.accountType
    }
  });
}

const deleteLoopWebHook = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/subscribeLoopWebhook",
    method: "delete",
    data: {
      systemMessageRemoteId: payload.systemMessageRemoteId,
    }
  });
}

const getVerifyLoopWebhook = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/subscribeLoopWebhook",
    method: "get",
  });
}

const postAPIKey = async (payload: any): Promise<any> => {
  return api({
    url: `/netsuite-loop-connector/organizations/apiKey`,
    method: "post",
    data: {
      systemMessageRemoteId: payload.systemMessageRemoteId
    }
  });
}

const getAPIKey = async (): Promise<any> => {
  return api({
    url: `/netsuite-loop-connector/organizations/apiKey`,
    method: "get",
  });
}
const getNetSuiteRMATypeMapping = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/returnIntegrationTypeMapping",
    method: "get",
  });
}

const getNetSuiteRMAMapping = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/integrationTypeMappings",
    method: "get",
  });
}

const postNetsuiteMapping = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/integrationTypeMappings",
    method: "POST",
    data: payload
  });
}

const syncNetsuiteMapping = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/syncIntegrationTypeMapping",
    method: "POST",
    data: { integrationMappingId: payload }
  });
}

const syncAllNetsuiteMapping = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/syncAllIntegrationTypeMapping",
    method: "POST",
    data: { accountId: payload }
  });
}

const deleteIntegrationTypeMappings = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/integrationTypeMappings",
    method: "delete",
    data: {
      integrationMappingId: payload.integrationMappingId
    }
  });
}

const updateIntegrationTypeMapping = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/updateIntegrationTypeMapping",
    method: "post",
    data: {
      integrationMappingId: payload.integrationMappingId,
      mappingValue: payload.mappingValue
    }
  });
}

const updateUserProfile = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/updateProfile",
    method: "post",
    data: payload
  });
}

const updatePassword = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/organizations/changePassword",
    method: "post",
    data: payload
  });
}

const getLoopReturnStatusCount = async (): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/return/returnCount",
    method: "get",
  });
}

const getLoopReturnStatusList = async (params: {
  status?: string;
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/return/returnDetails",
    method: "get",
    params, 
  });
};

const getLoopReturnStatusDetails = async (payload: any): Promise<any> => {
  return api({
    url: "/netsuite-loop-connector/return/returnStatusDetails",
    method: "get",
    params: { loopReturnId: payload }
  });
}

export const UserService = {
  checkPermission,
  deleteLoopCredential,
  deleteLoopWebHook,
  deleteNetSuiteCredential,
  deleteIntegrationTypeMappings,
  getAPIKey,
  getLoopDetails,
  getNetSuiteDetails,
  getNetSuiteRMAMapping,
  getNetSuiteRMATypeMapping,
  getProfile,
  getVerifyLoopWebhook,
  getLoopReturnStatusCount,
  getLoopReturnStatusList,
  getLoopReturnStatusDetails,
  login,
  postAPIKey,
  postNetsuiteMapping,
  registerUser,
  syncNetsuiteMapping,
  syncAllNetsuiteMapping,
  uploadLoopCredentials,
  uploadNetSuiteCredentials,
  updateIntegrationTypeMapping,
  updatePassword,
  updateUserProfile,
  verifyloopCredential,
  verifyNetsuiteCredential
}