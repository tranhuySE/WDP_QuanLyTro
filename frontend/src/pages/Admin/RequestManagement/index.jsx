import { Button, message, Space, Table } from "antd";
import { useEffect, useState } from "react";
import RequestAPI from "../../../api/requestAPI";
import { Container } from "react-bootstrap";
import dayjs from "dayjs"
import ModalReject from "./components/ModalReject";
import ModalAssignee from "./components/ModalAssignee";

const RequestManagement = () => {

  const [requests, setRequests] = useState([])
  const [openModalAssignee, setOpenModalAssignee] = useState(false)
  const [openModalReject, setOpenModalReject] = useState(false)

  const getListRequest = async () => {
    try {
      const res = await RequestAPI.getListRequest()
      setRequests(res?.data)
    } catch (error) {
      message.error(error.toString())
    }
  }

  useEffect(() => {
    getListRequest()
  }, [])

  const columns = [
    {
      title: "STT",
      width: 35,
      align: "center",
      dataIndex: 'STT',
      key: 'STT',
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: 'Tiêu đề',
      width: 100,
      align: 'center',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Người tạo',
      width: 80,
      align: 'center',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (val) => (
        <div className="text-center">{val?.userName}</div>
      ),
    },
    {
      title: 'Ngày tạo',
      width: 40,
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => (
        <div className="text-center">{dayjs(val).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: 'Trạng thái xử lý',
      width: 40,
      align: 'center',
      dataIndex: 'approval',
      key: 'approval',
      render: (val) => (
        <div className="text-center">
          {
            !!val?.action ? val?.action : "Chưa xét duyệt"
          }
        </div>
      ),
    },
    {
      title: "Chức năng",
      width: 70,
      key: "function",
      align: "center",
      dataIndex: 'function',
      render: (_, record) => (
        <Space size='small'>
          <Button
            disabled={record?.approval?.action}
            onClick={() => setOpenModalAssignee(record)}
          >
            Assignee
          </Button>
          <Button
            onClick={() => setOpenModalReject(record)}
            disabled={record?.approval?.action}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ]


  return (
    <Container fluid className="user-management-container" style={{ padding: 0 }}>
      <div className="main-card shadow rounded bg-white" style={{ margin: 0, padding: '1rem' }}>
        <div className="header mb-3">
          <h3 className="title">Danh sách yêu cầu</h3>
        </div>
        <Table
          dataSource={requests}
          columns={columns}
          pagination={false}
          bordered
          scroll={!!requests?.length ? { x: "100%" } : {}}
          sticky={{ offsetHeader: -12 }}
        />
      </div>

      {
        !!openModalReject &&
        <ModalReject
          open={openModalReject}
          onCancel={() => setOpenModalReject(false)}
          onOk={getListRequest}
        />
      }

      {
        !!openModalAssignee &&
        <ModalAssignee
          open={openModalAssignee}
          onCancel={() => setOpenModalAssignee(false)}
          onOk={getListRequest}
        />
      }

    </Container>
  );
}

export default RequestManagement;