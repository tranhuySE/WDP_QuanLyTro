import { message, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import RequestAPI from "../../../api/requestAPI";
import { Button, Container } from "react-bootstrap";
import dayjs from "dayjs"
import ModalReject from "../../../components/Request/ModalReject";
import ModalAssignee from "../../../components/Request/ModalAssignee";
import { MaterialReactTable } from "material-react-table";
import { Ban, ClipboardCheck } from "lucide-react";

const RequestManagement = () => {

  const [requests, setRequests] = useState([])
  const [openModalAssignee, setOpenModalAssignee] = useState(false)
  const [openModalReject, setOpenModalReject] = useState(false)
  const [loading, setLoading] = useState(false)

  const getListRequest = async () => {
    try {
      setLoading(true)
      const res = await RequestAPI.getListRequest()
      setRequests(res?.data)
    } catch (error) {
      message.error(error.toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListRequest()
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Tiêu đề",
        size: 150,
      },
      {
        accessorKey: "createdBy",
        header: "Người tạo",
        size: 100,
        Cell: ({ cell }) => (
          <div>{cell.getValue()?.fullname}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại yêu cầu",
        size: 80
      },
      {
        accessorKey: "priority",
        header: "Mức độ ưu tiên",
        size: 50
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 50,
        Cell: ({ cell }) => (
          <div>
            {dayjs(cell.getValue()).format("DD/MM/YYYY")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái xử lý",
        size: 50,
      },
    ],
    []
  );

  // Cột thao tác (Action column)
  const actionColumn = useMemo(
    () => ({
      header: "Thao tác",
      size: 70,
      Cell: ({ row }) => (
        <Space Space size="small" >
          <Button
            variant="warning"
            size="sm"
            onClick={() => setOpenModalAssignee(row.original)}
          >
            <ClipboardCheck size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setOpenModalReject(row.original)}
          >
            <Ban size={16} />
          </Button>
        </Space>
      ),
    }),
    []
  );

  return (
    <Container fluid className="user-management-container" style={{ padding: 0 }}>
      <div className="main-card shadow rounded bg-white" style={{ margin: 0, padding: '1rem' }}>
        <div className="header mb-3">
          <h3 className="title">Danh sách yêu cầu</h3>
        </div>
        <MaterialReactTable
          columns={[...columns, actionColumn]}
          data={requests}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={true}
          enableSorting={true}
          enableBottomToolbar={true}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: true }}
          state={{ isLoading: loading }}
          localization={{
            noRecordsToDisplay: 'Không có dữ liệu',
            of: 'của',
            rowsPerPage: 'Số hàng mỗi trang'
          }}
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