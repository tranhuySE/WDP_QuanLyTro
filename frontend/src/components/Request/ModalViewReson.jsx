import { Button, Descriptions, Modal, Space } from "antd";

const ModalViewReson = ({ open, onCancel }) => {

  const itemsCommon = [
    {
      key: '1',
      label: 'Tiêu đề',
      children: open?.title,
    },
    {
      key: '2',
      label: 'Nội dung',
      children: open?.description,
    },
  ];

  const itemsReject = [
    {
      key: '1',
      label: 'Lý do',
      children: open?.statusHistory?.find(i => i?.newStatus === "REJECTED")?.note,
    },
  ];


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
      <div>
        <Descriptions title="Thông tin yêu cầu" items={itemsCommon} style={{ marginBottom: '16px' }} />;
        {
          !!open?.statusHistory?.find(i => i?.newStatus === "REJECTED") &&
          <Descriptions title="Lý do từ chối" items={itemsReject} />
        }
      </div>
    </Modal>
  );
}

export default ModalViewReson;