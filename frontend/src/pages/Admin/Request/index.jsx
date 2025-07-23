import { Col, Input, message, Row, Select, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import RequestAPI from "../../../api/requestAPI";
import { Button, Container } from "react-bootstrap";
import dayjs from "dayjs"
import ModalReject from "../../../components/Request/ModalReject";
import ModalAssignee from "../../../components/Request/ModalAssignee";
import { MaterialReactTable } from "material-react-table";
import { Ban, ClipboardCheck, Eye } from "lucide-react";
import ModalViewReson from "../../../components/Request/ModalViewReson";
import { REQUEST_TYPE } from "../../../components/Request/ModalCreateRequest";


const RequestManagement = () => {

  const [requests, setRequests] = useState([])
  const [openModalAssignee, setOpenModalAssignee] = useState(false)
  const [openModalReject, setOpenModalReject] = useState(false)
  const [openModalViewReson, setOpenModalViewReson] = useState(false)
  const [loading, setLoading] = useState(false)
  const role = localStorage.getItem('role')
  const [filter, setFilter] = useState({
    fullname: '',
    roomNumber: '',
    status: ''
  })

  const REQUEST_STATUS = [
    {
      value: "PENDING",
      label: "Chưa giải quyết",
      isView: true,
      isDisabled: true,
    },
    {
      value: "ASSIGNED",
      label: "Được giao",
      isView: true,
      isDisabled: role === 'staff',
    },
    {
      value: "IN_PROGRESS",
      label: "Đang tiến hành",
      isView: role === 'staff',
      isDisabled: false,
    },
    {
      value: "COMPLETED",
      label: "Hoàn thành",
      isView: role === 'staff',
      isDisabled: false,
    },
    {
      value: "REJECTED",
      label: "Từ chối",
      isView: true,
      isDisabled: false,
    }
  ]

  const getListRequest = async () => {
    try {
      setLoading(true)
      const res = await RequestAPI.getListRequest(filter)
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
      getListRequest()
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
        setOpenModalReject(original)
        return
      default:
        changeRequestStatus(status, original)
        return
    }
  }

  useEffect(() => {
    getListRequest()
  }, [filter])

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
        size: 50,
        Cell: ({ cell }) => (
          <div>
            {
              REQUEST_TYPE.find(i => i.value === cell.getValue()).label
            }
          </div>
        ),
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
          role === 'admin'
            ? <div>
              {
                REQUEST_STATUS.find(i => i.value === cell.getValue())?.label || "Không xác định"
              }
            </div>
            :
            <Select
              defaultValue={cell.getValue()}
              onChange={e => handChangeStatus(e, row.original)}
            >
              {
                REQUEST_STATUS.map(i =>
                  i.isView &&
                  <Select.Option
                    disabled={i.isDisabled}
                    key={i.value}
                    value={i.value}
                  >
                    {i.label}
                  </Select.Option>
                )
              }
            </Select>
        ),
      }

    ],
    []
  );

  const actionColumn = useMemo(
    () => ({
      header: "Thao tác",
      size: 70,
      Cell: ({ row }) => (
        <Space Space size="small">
          <Button
            variant="primary"
            disabled={row.original.status !== 'REJECTED'}
            size="sm"
            onClick={() => {
              setOpenModalViewReson(row?.original)
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="warning"
            size="sm"
            disabled={(role === 'admin' && row.original.status !== 'PENDING') || (role === 'staff' && row.original.status !== 'ASSIGNED')}
            onClick={() => {
              if (role === 'admin') {
                setOpenModalAssignee(row.original)
              } else {
                handChangeStatus("IN_PROGRESS", row.original)
              }
            }}
          >
            <ClipboardCheck size={16} />
          </Button>
          <Button
            variant="danger"
            disabled={row.original.status !== 'PENDING'}
            size="sm"
            onClick={() => setOpenModalReject(row.original)}
          >
            <Ban size={16} />
          </Button>
        </Space >
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
        <Row gutter={[12]} className="mb-3">
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm theo tên người thuê"
              allowClear
              onSearch={e => setFilter(pre => ({ ...pre, fullname: e }))}
            />
          </Col>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm theo số phòng"
              allowClear
              onSearch={e => setFilter(pre => ({ ...pre, roomNumber: e }))}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Tìm kiếm theo trạng thái yêu cầu"
              style={{ width: '100%' }}
              allowClear
              onChange={e => {
                setFilter(pre => ({ ...pre, status: e || '' }))
              }}
            >
              {
                REQUEST_STATUS.map(i =>
                  <Select.Option key={i.value} value={i.value}>{i.label}</Select.Option>
                )
              }
            </Select>
          </Col>
        </Row>
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

      {
        !!openModalViewReson &&
        <ModalViewReson
          open={openModalViewReson}
          onCancel={() => setOpenModalViewReson(false)}
        />
      }

    </Container>
  );
}

export default RequestManagement;