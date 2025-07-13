import axiosInstance from "./axiosInstance"

const createRequest = body => axiosInstance.post('http://localhost:9999/requests/createRequest', body)
const getListRequest = () => axiosInstance.get('http://localhost:9999/requests/getListRequest')
const changeRequestStatus = body => axiosInstance.put('http://localhost:9999/requests/changeRequestStatus', body)
const getListRequestByStaff = () => axiosInstance.get("http://localhost:9999/requests/getListRequestByStaff")
const getListRequestByUser = () => axiosInstance.get("http://localhost:9999/requests/getListRequestByUser")

const RequestAPI = {
  createRequest,
  getListRequest,
  changeRequestStatus,
  getListRequestByStaff,
  getListRequestByUser
}

export default RequestAPI