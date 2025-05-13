import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081'
// 登录接口
export const loginApi = (user) => {
  return axios.post('/carsys/user/login', user);
};

// 获取用户信息（根据用户名）
export const getUserByUserNameApi = (username) => {
  return axios.get(`/carsys/user/getUserByUserName/${username}`);
};

export const registerApi = (user) =>{
    return axios.post('/carsys/user/addNewUser', user)
}

export const getRepairPersonApi =(userId)=>{
  return axios.get(`/carsys/repairPerson/user/${userId}`)
}