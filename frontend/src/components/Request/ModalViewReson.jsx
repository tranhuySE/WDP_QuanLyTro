import { Button, Modal, Space, Typography } from "antd";

const { Title, Text } = Typography;

const ModalViewReson = ({ open, onCancel }) => {

  const rejectedNote = open?.statusHistory?.find(i => i?.newStatus === "REJECTED")?.note;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="CHI TIẾT"
      width="30vw"
      footer={
        <Space className="d-flex-end">
          <Button onClick={onCancel}>
            Đóng
          </Button>
        </Space>
      }
    ><hr />
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Thông tin yêu cầu</Title>
        <div style={{ marginBottom: 8 }}>
          <Text strong>Tiêu đề: </Text><br />
          <Text>{open?.title || '-'}</Text>
        </div>
        <div>
          <Text strong>Nội dung: </Text><br />
          <Text>{open?.description || '-'}</Text>
        </div>
      </div><hr />

      {rejectedNote && (
        <div>
          <Title level={5}>Lý do từ chối</Title>
          <Text>{rejectedNote}</Text>
        </div>
      )}
    </Modal>
  );
};

export default ModalViewReson;
