import axiosInstance from "./axiosInstance"

const createRequest = body => axiosInstance.post('http://localhost:9999/requests/createRequest', body)
const getListRequest = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`http://localhost:9999/requests/getListRequest?${queryString}`)
}
const changeRequestStatus = body => axiosInstance.put('http://localhost:9999/requests/changeRequestStatus', body)
const getListRequestByUser = () => axiosInstance.get("http://localhost:9999/requests/getListRequestByUser")

const RequestAPI = {
  createRequest,
  getListRequest,
  changeRequestStatus,
  getListRequestByUser
}

export default RequestAPI