import { useEffect, useState } from 'react';
import { createContract, getContract, updateStatusContract } from '../../api/contractAPI';
import { MaterialReactTable } from 'material-react-table';
import { Container, Spinner, Alert, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { FaFilePdf, FaCheckCircle, FaHourglassHalf, FaInfoCircle, FaEdit } from 'react-icons/fa';
import ContractDetailModal from './ContractDetailModal';
import ContractModal from './ContractModal';
import { getAllRooms } from '../../api/roomAPI';
import { getAllUsers } from '../../api/userAPI';
import { getAllHouseService } from '../../api/houseService';
import { toast } from 'react-toastify';
import UpdateContractStatusModal from './UpdateContractStatusModal';
import { Plus } from 'react-bootstrap-icons';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ContractList = () => {
    const [contract, setContract] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedContractAction, setSelectedContractAction] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedContractStatus, setSelectedContractStatus] = useState(null);

    const [roomList, setRoomList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    const id = localStorage.getItem('id');

    const fetchRoom = async () => {
        try {
            const res = await getAllRooms();
            setRoomList(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await getAllUsers();
            setUserList(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const fetchService = async () => {
        try {
            const res = await getAllHouseService();
            setServiceList(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const initialValue = {
        roomId: '',
        tenant: '',
        landlord: '',
        house_address: '',
        startDate: '',
        endDate: '',
        price: '',
        deposit: {
            amount: '',
            paymentDate: '',
            status: 'pending',
        },
        file: [],
        house_service: [],
        terms: '',
        status: 'draft',
        createBy: id || '',
    };

    const getData = async () => {
        try {
            const res = await getContract();
            setContract(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
        fetchRoom();
        fetchUser();
        fetchService();
    }, []);

    const handleEditStatusContract = (row) => {
        setSelectedContractStatus(row);
        setShowStatusModal(true);
    };

    const handleOpenAddModal = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedContractAction(initialValue);
    };

    const handleUpdateStatus = async (values) => {
        try {
            const res = await updateStatusContract(selectedContractStatus._id, values);
            if (res.status === 200) {
                setShowStatusModal(false);
                toast.success('Đã cập nhật hợp đồng');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            getData();
        }
    };

    const handleAddNewContract = async (data) => {
        try {
            const formData = new FormData();
            formData.append('roomId', data.roomId);
            formData.append('tenant', data.tenant);
            formData.append('landlord', data.landlord);
            formData.append('house_address', data.house_address);
            formData.append('startDate', data.startDate);
            formData.append('endDate', data.endDate || '');
            formData.append('price', data.price);
            formData.append('terms', data.terms || '');
            formData.append('deposit.amount', data.deposit.amount);
            formData.append('deposit.paymentDate', data.deposit.paymentDate);
            formData.append('deposit.status', data.deposit.status);
            formData.append('createBy', data.createBy);
            data.house_service.forEach((id) => {
                formData.append('house_service[]', id);
            });
            if (data.file?.length > 0) {
                data.file.forEach((file) => {
                    formData.append('file', file);
                });
            }

            const res = await createContract(formData);
            if (res.status === 201) {
                toast.success('Tạo mới hợp đồng thành công');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Tạo hợp đồng thất bại');
        } finally {
            getData();
        }
    };

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
            accessorKey: 'file', // vẫn cần để MRT hoạt động đúng
            Cell: ({ row }) => {
                const files = row.original.file || [];

                return files.length > 0 ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {files.map((url, index) => (
                            <Zoom key={index}>
                                <img
                                    src={url}
                                    alt={`img-${index}`}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '1px solid #ccc',
                                        cursor: 'zoom-in',
                                    }}
                                />
                            </Zoom>
                        ))}
                    </div>
                ) : (
                    'Không có'
                );
            },
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
            header: 'Thời Hạn HĐ',
            accessorFn: (row) => {
                const today = new Date();
                const endDate = new Date(row.endDate);
                const isExpired = endDate < today;

                return isExpired ? (
                    <Badge bg="danger">Đã hết hạn</Badge>
                ) : (
                    <span>{new Date(row.endDate).toLocaleDateString()}</span>
                );
            },
            size: 60,
        },
        {
            header: 'Thao tác',
            id: 'actions',
            enableColumnActions: false,
            enableSorting: false,
            Cell: ({ row }) => {
                const contractData = row.original;

                const handleInfo = () => {
                    setSelectedContract(contractData);
                    setShowModalDetail(true);
                };

                const handleEdit = () => {
                    handleEditStatusContract(contractData);
                };

                const handleDelete = () => {
                    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
                        console.log('Xóa hợp đồng:', contractData._id);
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
                    renderTopToolbarCustomActions={({ table }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Button variant="primary" onClick={handleOpenAddModal}>
                                <Plus className="me-2" /> Thêm hợp đồng
                            </Button>
                        </div>
                    )}
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

            <ContractDetailModal
                show={showModalDetail}
                handleClose={() => {
                    setShowModalDetail(false);
                    setSelectedContract(null);
                }}
                contract={selectedContract}
            />

            <ContractModal
                show={showModal}
                onHide={() => handleClose()}
                initialValues={selectedContractAction}
                onSubmit={(data) => {
                    console.log('formData:', data);

                    handleAddNewContract(data);
                }}
                roomOptions={roomList}
                userOptions={userList}
                serviceOptions={serviceList}
                currentUser={id}
            />

            <UpdateContractStatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                contract={selectedContractStatus}
                onSubmit={handleUpdateStatus}
            />
        </div>
    );
};

export default ContractList;
