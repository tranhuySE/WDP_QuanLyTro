import axios from "axios";

const getListStaff = () => axios.get("http://localhost:9999/users/getListStaff")

const UserAPI = {
  getListStaff
}

export default UserAPI