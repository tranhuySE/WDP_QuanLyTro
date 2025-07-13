import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import dayjs from "dayjs"
import { MaterialReactTable } from "material-react-table";
import RequestAPI from "../../api/requestAPI";
import { Plus } from "lucide-react";
import ModalCreateRequest from "../../components/Request/ModalCreateRequest";


const RequestPage = () => {

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [openModalCreateRequest, setOpenModalCreateRequest] = useState(false)

  const getListRequest = async () => {
    try {
      setLoading(true)
      const res = await RequestAPI.getListRequestByUser()
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
        size: 200,
      },
      {
        accessorKey: "room",
        header: "Số phòng",
        size: 40,
        Cell: ({ cell }) => (
          <div>{cell.getValue()?.roomNumber}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại yêu cầu",
        size: 80
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

  return (
    <Container fluid className="user-management-container" style={{ padding: 0 }}>
      <div className="main-card shadow rounded bg-white" style={{ margin: 0, padding: '1rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            Danh sách yêu cầu
          </h2>
          <Button variant="primary" onClick={() => setOpenModalCreateRequest(true)}>
            <Plus size={18} className="me-1" />
            Tạo yêu cầu
          </Button>
        </div>
        <MaterialReactTable
          columns={columns}
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
        !!openModalCreateRequest &&
        <ModalCreateRequest
          open={openModalCreateRequest}
          onCancel={() => setOpenModalCreateRequest(false)}
          onOk={getListRequest}
        />
      }

    </Container>
  );
}

export default RequestPage;