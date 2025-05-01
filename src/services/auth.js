import axios from 'axios'

// 基路径（根据后端实际地址修改）
axios.defaults.baseURL = 'http://localhost:8080/carsys'

// 注册接口
export const registerApi = (user) => {
  return axios.post('/carsys/user/addNewUser', user)
}

// 登录接口
export const loginApi = (user) => {
  return axios.post('/carsys/user/logIn', user)
}