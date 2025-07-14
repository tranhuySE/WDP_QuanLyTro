import { message, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import RequestAPI from "../../../api/requestAPI";
import { Container } from "react-bootstrap";
import dayjs from "dayjs"
import ModalReject from "../../../components/Request/ModalReject";
import ModalAssignee from "../../../components/Request/ModalAssignee";
import { MaterialReactTable } from "material-react-table";


const RequestManagement = () => {

  const [requests, setRequests] = useState([])
  const [openModalAssignee, setOpenModalAssignee] = useState(false)
  const [openModalReject, setOpenModalReject] = useState(false)
  const [loading, setLoading] = useState(false)
  const role = localStorage.getItem('role')

  const REQUEST_STATUS = [
    {
      value: "PENDING",
      isView: true,
      isDisabled: true,
    },
    {
      value: "APPROVED",
      isView: role === 'staff',
      isDisabled: false,
    },
    {
      value: "ASSIGNED",
      isView: role === 'admin',
      isDisabled: false,
    },
    {
      value: "IN_PROGRESS",
      isView: role === 'staff',
      isDisabled: false,
    },
    {
      value: "COMPLETED",
      isView: role === 'staff',
      isDisabled: false,
    },
    {
      value: "REJECTED",
      isView: true,
      isDisabled: false,
    }
  ]

  const getListRequest = async () => {
    try {
      setLoading(true)
      const res = role === 'admin'
        ? await RequestAPI.getListRequest()
        : await RequestAPI.getListRequestByStaff()
      setRequests(res?.data)
    } catch (error) {
      message.error(error.toString())
    } finally {
      setLoading(false)
    }
  }

  const changeRequestStatus = async (status, original) => {
    try {
      const res = await RequestAPI.changeRequestStatus({
        requestId: original?._id,
        status: status,
        approval: localStorage.getItem("id"),
        statusHistory: {
          oldStatus: original?.status,
          newStatus: status,
          changedBy: localStorage.getItem("id"),
        }
      })
      message.success("Cập nhật trạng thái thành công")
    } catch (error) {
      message.error(error.toString())
    }
  }

  const handChangeStatus = (status, original) => {
    switch (status) {
      case "ASSIGNED":
        setOpenModalAssignee(original)
        return
      case "REJECTED":
      case "CANCELLED":
        setOpenModalReject(original)
        return
      default:
        changeRequestStatus(status, original)
        return
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
        size: 50
      },
      {
        accessorKey: "priority",
        header: "Mức độ ưu tiên",
        size: 40
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 40,
        Cell: ({ cell }) => (
          <div>
            {dayjs(cell.getValue()).format("DD/MM/YYYY")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái xử lý",
        size: 40,
        Cell: ({ cell, row }) => (
          <Select
            defaultValue={cell.getValue()}
            onChange={e => handChangeStatus(e, row.original)}
          >
            {
              REQUEST_STATUS.map(i =>
                i.isView &&
                <Select.Option disabled={i.isDisabled} key={i.value} value={i.value}>{i.value}</Select.Option>
              )
            }
          </Select>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid className="user-management-container" style={{ padding: 0 }}>
      <div className="main-card shadow rounded bg-white" style={{ margin: 0, padding: '1rem' }}>
        <div className="header mb-3">
          <h3 className="title">Danh sách yêu cầu</h3>
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