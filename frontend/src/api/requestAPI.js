import axios from "axios";

const getListRequest = () => axios.get('http://localhost:9999/requests/getListRequest')
const rejectRequest = body => axios.post('http://localhost:9999/requests/rejectRequest', body)
const assigneeRequest = body => axios.post('http://localhost:9999/requests/assigneeRequest', body)

const RequestAPI = {
  getListRequest,
  rejectRequest,
  assigneeRequest
}

export default RequestAPI