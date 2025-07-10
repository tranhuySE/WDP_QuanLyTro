import { useEffect, useState, useMemo } from 'react';
import { createInvoice, getInvoices, updateInvoice } from '../../api/invoiceAPI';
import { MaterialReactTable } from 'material-react-table';
import { Container, Row, Col, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { FaPrint, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import InvoiceModal from '../../components/Invoice/InvoiceModal';
import InvoiceDetail from '../../components/Invoice/InvoiceDetail';
import { getAllRooms } from '../../api/roomAPI';
import { toast } from 'react-toastify';

const mockRooms = [
    { _id: 'r1', roomNumber: '101' },
    { _id: 'r2', roomNumber: '202' },
];

const mockUsers = [
    { _id: 'u1', fullname: 'Nguyen Quang Minh' },
    { _id: 'u2', fullname: 'Tran Staff' },
];

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [room, setRoom] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await getInvoices();
                setInvoices(response.data);
                return response.data;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();

        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                setRoom(response.data);
                return response.data;
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const formatCurrency = (value) => value.toLocaleString('vi-VN') + ' ₫';

    const renderStatusBadge = (status) => {
        const variant = status === 'paid' ? 'success' : 'warning';
        return (
            <Badge bg={variant} className="text-capitalize">
                {status}
            </Badge>
        );
    };

    const renderPaymentTypeBadge = (type) => {
        const variant = type === 'Cash' ? 'secondary' : 'info';
        return <Badge bg={variant}>{type}</Badge>;
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'createdAt',
                header: 'Ngày tạo',
                Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
                size: 30,
            },
            {
                accessorKey: 'for_room_id.roomNumber',
                header: 'Phòng',
                size: 10,
                Cell: ({ cell }) => cell.getValue() || 'Chưa xác định',
            },
            {
                accessorKey: 'content',
                header: 'Nội dung',
                size: 150,
                Cell: ({ cell }) => cell.getValue() || 'Chưa xác định',
            },
            {
                accessorKey: 'total_amount',
                header: 'Tổng tiền',
                Cell: ({ cell }) => formatCurrency(cell.getValue()),
                size: 50,
            },
            {
                accessorKey: 'payment_status',
                header: 'Thanh toán',
                Cell: ({ cell }) => renderStatusBadge(cell.getValue()),
                size: 20,
            },
            {
                accessorKey: 'payment_type',
                header: 'Phương thức',
                Cell: ({ cell }) => renderPaymentTypeBadge(cell.getValue()),
                size: 20,
            },
            {
                accessorKey: 'create_by.fullname',
                header: 'Người tạo',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 'Chưa xác định',
            },
            {
                header: 'Hành động',
                Cell: ({ row }) => (
                    <ButtonGroup size="sm">
                        <Button variant="info" onClick={() => handleDetail(row.original)}>
                            <FaEye />
                        </Button>
                        <Button variant="warning" onClick={() => handleEdit(row.original)}>
                            <FaEdit />
                        </Button>
                        <Button variant="secondary" onClick={() => handlePrint(row.original)}>
                            <FaPrint />
                        </Button>
                    </ButtonGroup>
                ),
                enableColumnActions: false,
                enableSorting: false,
                size: 60,
            },
        ],
        [],
    );

    const handleCreate = () => {
        setEditData(null);
        setShowModal(true);
    };

    const handleEdit = (invoice) => {
        setEditData(invoice);
        setShowModal(true);
    };

    const handleDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };
    const handlePrint = (invoice) => alert('In hóa đơn: ' + invoice._id);

    const handleSubmitInvoice = async (formValues, uploadedFiles) => {
        console.log('Submitted form values:', formValues);
        console.log('Uploaded files:', uploadedFiles);
        try {
            const isEdit = !!formValues._id;
            const invoiceData = { ...formValues };

            const oldImages = (formValues.note?.img || [])
                .filter((img) => !img.url.startsWith('blob:'))
                .map((img) => img.url);

            const deletedImages = formValues.deletedImages || [];

            if (isEdit) {
                await updateInvoice(
                    invoiceData._id,
                    invoiceData,
                    uploadedFiles,
                    oldImages,
                    deletedImages,
                );
                toast.success('Cập nhật hóa đơn thành công!');
            } else {
                await createInvoice(invoiceData, uploadedFiles, oldImages, deletedImages);
                toast.success('Tạo hóa đơn mới thành công!');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Lỗi khi xử lý hóa đơn:', error);
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    if (loading)
        return (
            <Container>
                <p>Đang tải dữ liệu...</p>
            </Container>
        );
    if (error)
        return (
            <Container>
                <p>Lỗi: {error}</p>
            </Container>
        );

    return (
        <Container fluid className="mt-1">
            <Row className="mb-1">
                <Col>
                    <h4>Danh sách hóa đơn</h4>
                </Col>
            </Row>

            <MaterialReactTable
                columns={columns}
                data={invoices}
                enableRowNumbers
                enableSorting
                enableColumnFilters
                muiTablePaperProps={{ elevation: 0 }}
                muiTableContainerProps={{
                    sx: { maxHeight: '600px', overflowX: 'auto', overflowY: 'auto' },
                }}
                initialState={{ pagination: { pageSize: 10 } }}
                positionToolbarAlertBanner="bottom"
                renderTopToolbarCustomActions={() => (
                    <Button variant="primary" onClick={handleCreate}>
                        <FaPlus className="me-2" />
                        Tạo mới
                    </Button>
                )}
            />

            <InvoiceModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleSubmitInvoice}
                initialData={
                    editData || {
                        content: '',
                        total_amount: 0,
                        payment_type: 'e-banking',
                        payment_status: 'pending',
                        for_room_id: '',
                        create_by: '',
                        items: [],
                        note: {
                            img: [],
                            text: '',
                        },
                    }
                }
                mode={editData ? 'edit' : 'create'}
                roomOptions={room}
                userOptions={mockUsers}
            />
            {selectedInvoice && (
                <InvoiceDetail
                    show={showDetailModal}
                    onHide={() => setShowDetailModal(false)}
                    invoice={selectedInvoice}
                />
            )}
        </Container>
    );
};

export default InvoicesPage;
