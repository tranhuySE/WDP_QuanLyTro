import { Button, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getMyRoomInfo } from '../../api/roomAPI';
import RequestAPI from '../../api/requestAPI';

export const REQUEST_TYPE = [
    {
        value: 'MAINTENANCE',
        label: 'Bảo trì',
    },
    {
        value: 'CLEANING',
        label: 'Vệ sinh',
    },
    {
        value: 'COMPLAINT',
        label: 'Phàn nàn',
    },
    {
        value: 'TASK_ASSIGNMENT',
        label: 'Nhiệm vụ',
    },
    {
        value: 'ROOM_ISSUE',
        label: 'Vấn đề về phòng',
    },
    {
        value: 'PAYMENT_ISSUE',
        label: 'Vấn đề thanh toán',
    },
    {
        value: 'OTHER',
        label: 'Khác',
    },
];

const ModalCreateRequest = ({ open, onCancel, onOk }) => {
    const [form] = Form.useForm();
    const [rooms, setRooms] = useState([]);
    const id = localStorage.getItem('id');

    const getRooms = async () => {
        try {
            const res = await getMyRoomInfo(id);
            setRooms(res.data);
        } catch (error) {
            message.error(error.toString());
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const body = {
                ...values,
                createdBy: localStorage.getItem('id'),
                statusHistory: [
                    {
                        newStatus: 'PENDING',
                        changedBy: localStorage.getItem('id'),
                    },
                ],
            };
            const res = await RequestAPI.createRequest(body);
            onOk();
            message.success('Tạo yêu cầu thành công');
            onCancel();
        } catch (error) {
            message.error(error.toString());
        }
    };

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title="Yêu cầu"
            width="60vw"
            footer={
                <Space className="d-flex-end">
                    <Button onClick={() => onCancel()}>Đóng</Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Gửi
                    </Button>
                </Space>
            }
        >
            <Form form={form}>
                <Row gutter={[12]}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            rules={[{ required: true, message: 'Thông tin không được để trống' }]}
                        >
                            <Input placeholder="Nhập vào nội dung yêu cầu" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="description">
                            <Input.TextArea
                                style={{ height: '70px' }}
                                placeholder="Mô tả chi tiết yêu cầu"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="type">
                            <Select placeholder="Loại yêu cầu">
                                {REQUEST_TYPE.map((i) => (
                                    <Select.Option key={i.value} value={i.value}>
                                        {i.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="room"
                            rules={[{ required: true, message: 'Thông tin không được để trống' }]}
                        >
                            <Select placeholder="Số phòng">
                                <Select.Option value={rooms._id}>{rooms.roomNumber}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalCreateRequest;
