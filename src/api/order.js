import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081'

export const createOrderApi=(request)=>{
    return axios.post('/carsys/repairOrder/createOrder', request)
}

export const getOrdersOfVehicleApi = (vehicle)=>{
    return axios.get(`/carsys/repairOrder/getOrdersByVehicleId/${vehicle.vehicle_id}`)
}

export const getAllOrdersByUserApi = (userId)=>{
    return axios.get(`/carsys/repairOrder/getOrdersByUserId/${userId}`)
}

export const getAssignmentsOfRepairPersonApi = (repairPersonId)=>{
    return axios.get(`/carsys/assignment/byRepairPersonId/${repairPersonId}`)
}

export const acceptAssignmentApi = (repairPersonId,assignment_id)=>{
    return axios.post(`/carsys/assignment/acceptAssignment/${repairPersonId}/${assignment_id}`)
}

export const refuseAssignmentApi = (repairPersonId,assignment_id)=>{
    return axios.post(`/carsys/assignment/refuseAssignment/${repairPersonId}/${assignment_id}`)
}