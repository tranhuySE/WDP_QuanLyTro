import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import {
    createHouseService,
    deleteHouseService,
    getAllHouseService,
    updateHouseService,
} from '../../api/houseService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import HouseServiceModal from './HouseServiceModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const HouseServiceList = () => {
    const [services, setServices] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchService = async () => {
        try {
            const res = await getAllHouseService();
            if (res.status === 200) {
                return setServices(res.data);
            }
        } catch (error) {
            return toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchService();
    }, []);

    const handleAdd = () => {
        setEditData(null);
        setModalShow(true);
    };

    const handleEdit = (row) => {
        setEditData(row.original);
        setModalShow(true);
    };

    const handleDeleteHService = async () => {
        try {
            const res = await deleteHouseService(deleteId);
            if (res.status === 200) return toast.success('Đã xóa dịch vụ');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setShowModalConfirm(false);
            fetchService();
        }
    };

    const handleSubmitService = async (newService) => {
        try {
            if (newService._id) {
                const res = await updateHouseService(newService._id, newService);
                if (res.status === 200) {
                    toast.success('Cập nhật dịch vụ thành công');
                }
            } else {
                const res = await createHouseService(newService);
                if (res.status === 201) {
                    toast.success('Thêm dịch vụ mới thành công');
                }
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            fetchService();
        }
    };

    const handleDeleted = (id) => {
        setDeleteId(id);
        setShowModalConfirm(true);
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Tên dịch vụ',
        },
        {
            accessorKey: 'unit',
            header: 'Đơn vị',
        },
        {
            accessorKey: 'price',
            header: 'Đơn giá (VND)',
            Cell: ({ cell }) => cell.getValue().toLocaleString('vi-VN') + ' ₫',
        },
        {
            header: 'Hành động',
            id: 'actions',
            Cell: ({ row }) => (
                <ButtonGroup size="sm">
                    <Button variant="info" onClick={() => handleEdit(row)}>
                        <FaEdit />
                    </Button>
                    <Button
                        variant="danger"
                        className="mx-1"
                        onClick={() => handleDeleted(row.original._id)}
                    >
                        <FaTrash />
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    return (
        <Container fluid className="mt-1">
            <Row className="mb-3">
                <Col>
                    <h4>Danh sách dịch vụ</h4>
                </Col>
                <Col className="text-end">
                    <Button variant="success" onClick={handleAdd}>
                        <PlusLg className="me-2" />
                        Thêm dịch vụ
                    </Button>
                </Col>
            </Row>
            <MaterialReactTable columns={columns} data={services} />
            <HouseServiceModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                initialData={editData}
                onSubmit={handleSubmitService}
            />
            <ConfirmDeleteModal
                show={showModalConfirm}
                onHide={() => setShowModalConfirm(false)}
                onConfirm={handleDeleteHService}
                message="Bạn có chắc muốn xóa sản phẩm này không?"
            />
        </Container>
    );
};

export default HouseServiceList;
