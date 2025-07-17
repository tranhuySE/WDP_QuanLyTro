import { Button, message, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import UserAPI from "../../api/userAPI";
import RequestAPI from "../../api/requestAPI";

const ModalAssignee = ({ open, onCancel, onOk }) => {

  const [staffs, setStaffs] = useState([])
  const [staffSelected, setStaffSelected] = useState()

  const getListStaff = async () => {
    try {
      const res = await UserAPI.getListStaff()
      setStaffs(
        res?.data?.map(i => ({
          value: i?._id,
          label: i?.username,
          data: i
        }))
      )
    } catch (error) {
      message.error(error.toString())
    }
  }

  const handleSubmit = async () => {
    try {
      if (!staffSelected) return message.error("Hãy chọn staff!")
      const res = await RequestAPI.changeRequestStatus({
        requestId: open?._id,
        status: "ASSIGNED",
        assignedTo: staffSelected?.data?._id,
        approval: localStorage.getItem("id"),
        statusHistory: {
          oldStatus: open?.status,
          newStatus: "ASSIGNED",
          changedBy: localStorage.getItem("id")
        }
      })
      onOk()
      message.success("Assignee yêu cầu thành công")
      onCancel()
    } catch (error) {
      message.error(error.toString())
    }
  }

  useEffect(() => {
    getListStaff()
  }, [])


  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Assignee"
      width="30vw"
      footer={
        <Space className="d-flex-end">
          <Button
            onClick={() => onCancel()}
          >
            Đóng
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </Space>
      }
    >
      <Select
        placeholder="Chọn staff"
        allowClear
        showSearch
        onChange={(val, opt) => setStaffSelected(opt)}
        value={staffSelected}
        options={staffs}
        filterOption={false}
        style={{ width: '100%' }}
      />
    </Modal>
  );
}

export default ModalAssignee;