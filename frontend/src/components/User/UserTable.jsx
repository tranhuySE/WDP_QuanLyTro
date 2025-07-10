import { CheckCircle, Edit, Eye, Trash2 } from 'lucide-react';
import { MaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import { Badge, Button } from 'react-bootstrap';

const UserTable = ({ users, loading, onViewDetail, onEdit, onDelete, onVerify }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'email',
                header: 'Email',
                size: 200
            },
            {
                accessorKey: 'fullname',
                header: 'Họ tên',
                size: 150
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Số điện thoại',
                size: 120
            },
            {
                accessorKey: 'role',
                header: 'Vai trò',
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        bg={
                            cell.getValue() === 'admin'
                                ? 'danger'
                                : cell.getValue() === 'staff'
                                    ? 'warning'
                                    : 'primary'
                        }
                    >
                        {cell.getValue() === 'admin' ? 'Quản trị' :
                            cell.getValue() === 'staff' ? 'Nhân viên' : 'Người dùng'}
                    </Badge>
                )
            },
            {
                accessorKey: 'status',
                header: 'Hoạt động',
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        bg={
                            cell.getValue() === 'active'
                                ? 'success'
                                : cell.getValue() === 'inactive'
                                    ? 'danger'
                                    : 'primary'
                        }
                    >
                        {cell.getValue() === 'active' ? 'Hoạt động' :
                            cell.getValue() === 'inactive' ? 'Không hoạt động' : 'Bị khóa'}
                    </Badge>
                )
            },
            {
                accessorKey: 'isVerifiedByAdmin',
                header: 'Xác minh',
                size: 100,
                Cell: ({ cell, row }) => (
                    <div>
                        <Badge bg={cell.getValue() ? 'success' : 'warning'}>
                            {cell.getValue() ? 'Đã xác minh' : 'Chưa xác minh'}
                        </Badge>
                        {!cell.getValue() && (
                            <Button
                                variant="outline-success"
                                size="sm"
                                className="ms-2"
                                onClick={() => onVerify(row.original)}
                            >
                                <CheckCircle size={14} />
                            </Button>
                        )}
                    </div>
                )
            }
        ],
        []
    );

    const actionColumn = useMemo(
        () => ({
            header: 'Thao tác',
            size: 150,
            Cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => onViewDetail(row.original)}
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => onEdit(row.original)}
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row.original._id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }),
        []
    );

    return (
        <MaterialReactTable
            columns={[...columns, actionColumn]}
            data={users}
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
    );
};

export default UserTable;