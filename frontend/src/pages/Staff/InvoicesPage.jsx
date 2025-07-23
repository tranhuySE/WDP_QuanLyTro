import { useEffect, useState, useMemo } from 'react';
import { createInvoice, getInvoices, updateInvoice } from '../../api/invoiceAPI';
import { MaterialReactTable } from 'material-react-table';
import { Container, Row, Col, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { FaPrint, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import InvoiceModal from '../../components/Invoice/InvoiceModal';
import InvoiceDetail from '../../components/Invoice/InvoiceDetail';
import { getOccupiedRooms } from '../../api/roomAPI';
import { toast } from 'react-toastify';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [room, setRoom] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

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

    const fetchRooms = async () => {
        try {
            const response = await getOccupiedRooms();
            setRoom(response.data.data);
            console.log(response.data);

            return response.data;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchRooms();
    }, []);

    const formatCurrency = (value) => value.toLocaleString('vi-VN') + ' ₫';

    const renderStatusBadge = (status) => {
        const variant = status === 'paid' ? 'success' : status === 'overdue' ? 'danger' : 'warning';
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

    const handleSubmitInvoice = async (values) => {
        try {
            const formData = new FormData();

            formData.append('create_by', values.create_by);
            formData.append('for_room_id', values.for_room_id);
            formData.append('content', values.content);
            formData.append('payment_type', values.payment_type);
            formData.append('invoice_type', values.invoice_type);
            formData.append('payment_status', values.payment_status);
            formData.append('total_amount', values.total_amount);
            formData.append('notify_status', values.notify_status || '');
            formData.append('items', JSON.stringify(values.items));
            formData.append('note', JSON.stringify({ text: values.note?.text || '' }));
            const oldImages = values.note?.img?.filter((img) => typeof img === 'string') || [];
            formData.append('oldImages', JSON.stringify(oldImages));
            const deleteImages =
                editData?.note?.img?.filter(
                    (img) => typeof img === 'string' && !values.note?.img?.includes(img),
                ) || [];
            formData.append('deleteImages', JSON.stringify(deleteImages));
            const newImages = values.note?.img?.filter((img) => img instanceof File) || [];
            newImages.forEach((file) => {
                formData.append('img', file);
            });

            console.log('📦 FormData content:');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            if (values._id) {
                const response = await updateInvoice(values._id, formData);
                if (response.status === 200) return toast.success('Cập nhật hóa đơn thành công!');
            } else {
                const response = await createInvoice(formData);
                if (response.status === 201) return toast.success('Tạo hóa đơn thành công!');
            }
        } catch (err) {
            console.error('❌ Lỗi gửi form:', err);
            toast.error(err.response?.data?.message || 'Gửi dữ liệu thất bại');
        } finally {
            fetchInvoices();
            setShowModal(false);
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
                    editData
                        ? {
                              ...editData,
                              for_room_id: editData?.for_room_id?._id || '',
                              create_by: editData?.create_by?._id || '',
                          }
                        : {
                              content: '',
                              total_amount: 0,
                              invoice_type: '',
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
