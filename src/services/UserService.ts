import { api, client } from '@/adapter';
import store from '@/store';

const login = async (username: string, password: string): Promise<any> => {
  const url =  process.env.VUE_APP_BASE_URL
  const baseURL = url.startsWith('http') ? url.includes('/rest/s1/order-routing') ? url : `${url}/rest/s1/order-routing/` : `https://${url}.hotwax.io/rest/s1/order-routing/`;
  return await client({
    url: "login",
    method: "post",
    baseURL,
    params: {
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
  return
}

const createUser = async (payload: any): Promise <any> => {
  return api({
    url: "services/user/createUser", 
    method: "post",
    data: payload
  });
}

const registerUser = async (payload: any): Promise<any> => {
  return api({
    url: "services/user/registerUser",
    method: "post",
    data: payload
  });
}

export const UserService = {
  checkPermission,
  createUser,
  getProfile,
  login,
  registerUser
}