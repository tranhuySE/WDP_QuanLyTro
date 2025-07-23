import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Trash3Fill, PlusLg } from 'react-bootstrap-icons';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createHouseService, getAllHouseService, updateHouseService } from '../../api/houseService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import HouseServiceModal from './HouseServiceModal';
import { EditAttributes } from '@mui/icons-material';
import { FaEdit, FaInfoCircle, FaTrash } from 'react-icons/fa';

const HouseServiceList = () => {
    const [services, setServices] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [editData, setEditData] = useState(null);

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
                    <Button variant="warning" className="mx-1">
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
        </Container>
    );
};

export default HouseServiceList;
