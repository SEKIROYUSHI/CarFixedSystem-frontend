import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081'

export const getVehiclesApi = (userId) =>{
   return axios.get(`/carsys/vehicle/byUserId/${userId}`)
}

export const addVehicleApi =(addVehicleForm)=>{
    return axios.post('/carsys/vehicle/addNewVehicle', addVehicleForm)
}

export const getVehicleByIdApi = (vehicleId) =>{
    return axios.get(`/carsys/vehicle/${vehicleId}`)
}