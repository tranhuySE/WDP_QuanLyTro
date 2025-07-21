import { Button, Modal, Space } from "antd";

const ModalViewReson = ({ open, onCancel }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Lý do huỷ"
      width="30vw"
      footer={
        <Space className="d-flex-end">
          <Button
            onClick={() => onCancel()}
          >
            Đóng
          </Button>
        </Space>
      }
    >
      <div>{open?.note}</div>
    </Modal>
  );
}

export default ModalViewReson;