import { useEffect, useState } from 'react';
import { getContract } from '../../api/contractAPI';
import { MaterialReactTable } from 'material-react-table';
import { Container, Spinner, Alert, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { FaFilePdf, FaCheckCircle, FaHourglassHalf, FaInfoCircle, FaEdit } from 'react-icons/fa';

const ContractList = () => {
    const [contract, setContract] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getContract();
                setContract(res.data);
            } catch (error) {
                console.error(error);
                setError('Lỗi tải dữ liệu hợp đồng!');
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const columns = [
        {
            header: 'Mã Hợp Đồng',
            accessorKey: '_id',
            size: 100,
        },
        {
            header: 'Người Thuê',
            accessorFn: (row) => row.tenant?.fullname || 'Chưa có',
            size: 40,
        },
        {
            header: 'Phòng',
            accessorFn: (row) => `Phòng ${row.roomId?.roomNumber}`,
            size: 40,
        },
        {
            header: 'Tiền Cọc',
            accessorKey: 'deposit.amount',
            Cell: ({ cell }) => {
                const value = cell.getValue();
                return `${Number(value).toLocaleString()}đ`;
            },
            size: 50,
        },
        {
            header: 'Trạng Thái Cọc',
            accessorFn: (row) =>
                row.deposit?.status === 'paid' ? (
                    <span className="d-flex align-items-center">
                        <FaCheckCircle color="green" className="mx-1" /> Đã cọc
                    </span>
                ) : (
                    <span className="d-flex align-items-center">
                        <FaHourglassHalf color="orange" className="mx-1" />
                        Chờ xử lý
                    </span>
                ),
            size: 40,
        },
        {
            header: 'Tệp Hợp Đồng',
            accessorFn: (row) =>
                row.file?.length > 0 ? (
                    <a href={row.file[0].url} target="_blank" rel="noopener noreferrer">
                        <FaFilePdf /> {row.file[0].name}
                    </a>
                ) : (
                    'Không có'
                ),
            size: 50,
        },
        {
            header: 'Trạng Thái',
            accessorKey: 'status',
            Cell: ({ cell }) => {
                const status = cell.getValue();
                const getVariant = (status) => {
                    switch (status) {
                        case 'active':
                            return 'success';
                        case 'draft':
                            return 'warning';
                        case 'terminated':
                            return 'danger';
                        default:
                            return 'secondary';
                    }
                };
                return <Badge bg={getVariant(status)}>{status.toUpperCase()}</Badge>;
            },
            size: 40,
        },
        {
            header: 'Thao tác',
            id: 'actions',
            enableColumnActions: false,
            enableSorting: false,
            Cell: ({ row }) => {
                const contractId = row.original._id;

                const handleInfo = () => {
                    console.log('Xem thông tin:', contractId);
                };

                const handleEdit = () => {
                    console.log('Sửa hợp đồng:', contractId);
                };

                const handleDelete = () => {
                    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
                        console.log('Xóa hợp đồng:', contractId);
                    }
                };

                return (
                    <ButtonGroup size="sm">
                        <Button variant="info" onClick={handleInfo}>
                            <FaInfoCircle />
                        </Button>
                        <Button variant="warning" onClick={handleEdit} className="mx-1">
                            <FaEdit />
                        </Button>
                    </ButtonGroup>
                );
            },
            size: 100,
        },
    ];

    return (
        <div className="mt-1">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <MaterialReactTable
                    columns={columns}
                    data={contract}
                    enablePagination
                    enableRowNumbers
                    enableColumnResizing={false}
                    layoutMode="semantic"
                    initialState={{
                        density: 'compact',
                    }}
                    enableDensityToggle={false}
                    muiTableContainerProps={{
                        sx: {
                            maxWidth: '100%',
                            overflowX: 'auto',
                        },
                    }}
                />
            )}
        </div>
    );
};

export default ContractList;
