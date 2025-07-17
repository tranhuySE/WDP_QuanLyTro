import { Button, Form, Input, message, Modal, Space } from "antd"
import RequestAPI from "../../api/requestAPI"

const ModalReject = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const res = await RequestAPI.changeRequestStatus({
        requestId: open?._id,
        status: "REJECTED",
        approval: localStorage.getItem("id"),
        statusHistory: {
          oldStatus: open?.status,
          newStatus: "REJECTED",
          changedBy: localStorage.getItem("id"),
          note: values?.reasonReject,
        }
      })
      onOk()
      message.success("Huỷ yêu cầu thành công")
      onCancel()
    } catch (error) {
      message.error(error.toString())
    }
  }


  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Lý do không duyệt"
      width="40vw"
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
      <Form form={form}>
        <Form.Item
          name='reasonReject'
          rules={[
            { required: true, message: "Thông tin không được để trống" },
          ]}
        >
          <Input placeholder="Nhập vào lý do không duyệt" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalReject