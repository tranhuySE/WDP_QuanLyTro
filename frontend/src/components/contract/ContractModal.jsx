import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import {
    PersonFill,
    HouseDoorFill,
    CalendarEvent,
    CurrencyDollar,
    ClipboardCheck,
    GeoAltFill,
    JournalText,
    PatchCheckFill,
} from 'react-bootstrap-icons';
import { FaTrash } from 'react-icons/fa';
import Select from 'react-select';

const ContractModal = ({
    show,
    onHide,
    onSubmit,
    roomOptions,
    userOptions,
    serviceOptions,
    currentUser,
}) => {
    const [files, setFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const landlord = userOptions.filter((u) => u.role === 'admin');
    const tenant = userOptions.filter((u) => u.isVerifiedByAdmin && u.role === 'user');
    const rooms = roomOptions.filter((r) => r.tenant.length === 0);
    const tenantOptions = tenant.map((u) => ({
        value: u._id,
        label: u.fullname,
    }));

    useEffect(() => {
        setPreviewImages([]);
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFiles((prev) => [...prev, ...selectedFiles]);
        setPreviewImages((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(previewImages[index]);
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validationSchema = Yup.object().shape({
        roomId: Yup.string().required('Bắt buộc chọn phòng'),
        tenant: Yup.array()
            .min(1, 'Phải chọn ít nhất một người thuê')
            .test('max-occupants', 'Vượt quá số người cho phép trong phòng', function (value) {
                const { roomId } = this.parent;
                const room = rooms.find((r) => r._id === roomId);
                if (!room) return true;
                return value.length <= room.maxOccupants;
            }),
        landlord: Yup.string().required('Bắt buộc chọn chủ nhà'),
        house_address: Yup.string().required('Bắt buộc nhập địa chỉ'),
        startDate: Yup.date()
            .required('Bắt buộc chọn ngày bắt đầu')
            .typeError('Ngày không hợp lệ')
            .test('is-today', 'Ngày bắt đầu phải là hôm nay', function (value) {
                if (!value) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const selectedDate = new Date(value);
                selectedDate.setHours(0, 0, 0, 0);

                return selectedDate.getTime() === today.getTime();
            }),
        endDate: Yup.date()
            .nullable()
            .typeError('Ngày không hợp lệ')
            .required('Vui lòng chọn ngày kết thúc')
            .test('min-1-month', 'Ngày kết thúc phải sau ít nhất 1 tháng', function (value) {
                const { startDate } = this.parent;
                if (!startDate || !value) return true;
                const oneMonthLater = new Date(startDate);
                oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
                return value >= oneMonthLater;
            }),
        price: Yup.number()
            .required('Bắt buộc nhập giá thuê')
            .typeError('Phải là số')
            .min(1, 'Số tiền phải lớn hơn 0')
            .test(
                'price-between-half-and-full',
                'Giá thuê phải từ 50% đến 100% giá phòng',
                function (value) {
                    const { roomId } = this.parent;
                    const room = rooms.find((r) => r._id === roomId);
                    if (!room || !value) return true;

                    const min = room.price * 0.5;
                    const max = room.price;

                    return value >= min && value <= max;
                },
            ),
        deposit: Yup.object().shape({
            amount: Yup.number()
                .required('Bắt buộc nhập số tiền đặt cọc')
                .typeError('Phải là số')
                .min(1, 'Số tiền phải lớn hơn 0'),
            paymentDate: Yup.date()
                .required('Bắt buộc nhập ngày cọc')
                .typeError('Ngày không hợp lệ')
                .test(
                    'is-before-start-date',
                    'Ngày đặt cọc phải trước ngày bắt đầu hợp đồng',
                    function (value) {
                        const startDate = this.parent.startDate || this.from[1].value.startDate;
                        if (!value || !startDate) return true;
                        const paymentDate = new Date(value);
                        const contractStartDate = new Date(startDate);
                        return paymentDate < contractStartDate;
                    },
                ),
            status: Yup.string().required('Bắt buộc chọn trạng thái cọc'),
        }),
        house_service: Yup.array().of(Yup.string()).min(3, 'Phải chọn ít nhất 3 dịch vụ'),
        terms: Yup.string().required('Bắt buộc nhập điều khoản'),
    });

    const today = new Date().toISOString().split('T')[0];

    const initialValues = {
        roomId: '',
        tenant: [],
        landlord: '',
        house_address: '',
        startDate: today,
        endDate: '',
        price: '',
        deposit: {
            amount: '',
            paymentDate: today,
            status: '',
        },
        house_service: [],
        file: [],
        terms: '',
        createBy: currentUser,
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <ClipboardCheck className="me-2" /> Thêm hợp đồng thuê nhà
                </Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.file = files;
                    onSubmit(values);
                    setSubmitting(false);
                    onHide();
                }}
            >
                {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    errors,
                    touched,
                }) => (
                    <FormikForm onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className="g-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <HouseDoorFill className="me-2" />
                                            Phòng
                                        </Form.Label>
                                        <Form.Select
                                            name="roomId"
                                            value={values.roomId}
                                            onChange={(e) => {
                                                setFieldValue('roomId', e.target.value);
                                            }}
                                            isInvalid={!!errors.roomId && touched.roomId}
                                        >
                                            <option value="">-- Chọn phòng --</option>
                                            {rooms.map((r) => (
                                                <option key={r._id} value={r._id}>
                                                    {r.roomNumber} - max : {r.maxOccupants} người ở
                                                    - {r.price.toLocaleString()}đ
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.roomId}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <PersonFill className="me-2" />
                                            Người thuê
                                        </Form.Label>
                                        <Select
                                            options={tenantOptions}
                                            isMulti
                                            name="tenant"
                                            value={tenantOptions.filter((option) =>
                                                values.tenant.includes(option.value),
                                            )}
                                            onChange={(selected) => {
                                                const selectedIds = selected.map(
                                                    (option) => option.value,
                                                );
                                                setFieldValue('tenant', selectedIds);
                                            }}
                                            className={
                                                touched.tenant && errors.tenant ? 'is-invalid' : ''
                                            }
                                        />
                                        {touched.tenant && errors.tenant && (
                                            <div className="invalid-feedback d-block">
                                                {errors.tenant}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <PersonFill className="me-2" />
                                            Chủ nhà
                                        </Form.Label>
                                        <Form.Select
                                            name="landlord"
                                            value={values.landlord}
                                            onChange={handleChange}
                                            isInvalid={!!errors.landlord && touched.landlord}
                                        >
                                            <option value="">-- Chọn chủ nhà --</option>
                                            {landlord.map((u) => (
                                                <option key={u._id} value={u._id}>
                                                    {u.fullname}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.landlord}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <GeoAltFill className="me-2" />
                                            Địa chỉ nhà
                                        </Form.Label>
                                        <Form.Control
                                            name="house_address"
                                            value={values.house_address}
                                            className="p-3"
                                            onChange={handleChange}
                                            isInvalid={
                                                !!errors.house_address && touched.house_address
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.house_address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <CalendarEvent className="me-2" />
                                            Ngày bắt đầu
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="startDate"
                                            value={values.startDate}
                                            onChange={handleChange}
                                            isInvalid={!!errors.startDate && touched.startDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.startDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <CalendarEvent className="me-2" />
                                            Ngày kết thúc
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="endDate"
                                            value={values.endDate}
                                            onChange={handleChange}
                                            isInvalid={!!errors.endDate && touched.endDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.endDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            <CurrencyDollar className="me-2" />
                                            Giá thuê
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            className="p-3"
                                            value={values.price}
                                            onChange={handleChange}
                                            isInvalid={!!errors.price && touched.price}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Tiền đặt cọc</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="deposit.amount"
                                            className="p-3"
                                            value={values.deposit.amount}
                                            onChange={handleChange}
                                            isInvalid={
                                                !!errors.deposit?.amount && touched.deposit?.amount
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.deposit?.amount}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ngày cọc</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="deposit.paymentDate"
                                            value={values.deposit.paymentDate}
                                            onChange={handleChange}
                                            isInvalid={
                                                !!errors.deposit?.paymentDate &&
                                                touched.deposit?.paymentDate
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.deposit?.paymentDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Trạng thái cọc</Form.Label>
                                        <Form.Select
                                            name="deposit.status"
                                            value={values.deposit.status}
                                            onChange={handleChange}
                                            isInvalid={
                                                !!errors.deposit?.status && touched.deposit?.status
                                            }
                                        >
                                            <option value="">---Chọn---</option>
                                            <option value="paid">Đã thanh toán</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.deposit?.status}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>
                                            <PatchCheckFill className="me-2" />
                                            Dịch vụ
                                        </Form.Label>
                                        <div className="d-flex flex-column">
                                            {serviceOptions.map((s) => (
                                                <Form.Check
                                                    inline
                                                    key={s._id}
                                                    label={`${s.name} - ${s.price.toLocaleString(
                                                        'vi-VN',
                                                    )}đ / ${s.unit}`}
                                                    name="house_service"
                                                    value={s._id}
                                                    type="checkbox"
                                                    checked={values.house_service.includes(s._id)}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (e.target.checked) {
                                                            setFieldValue('house_service', [
                                                                ...values.house_service,
                                                                val,
                                                            ]);
                                                        } else {
                                                            setFieldValue(
                                                                'house_service',
                                                                values.house_service.filter(
                                                                    (v) => v !== val,
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {touched.house_service && errors.house_service && (
                                            <div className="text-danger mt-1">
                                                {errors.house_service}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group className="mb-1">
                                        <Form.Label>File ảnh đính kèm</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="file"
                                            size="lg"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                        <div className="mt-1 d-flex flex-wrap gap-2">
                                            {previewImages.map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img
                                                        src={img}
                                                        width={80}
                                                        height={80}
                                                        style={{
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                        }}
                                                        onClick={() => handleRemoveImage(idx)}
                                                    >
                                                        <FaTrash size={12} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>
                                            <JournalText className="me-2" />
                                            Điều khoản
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="terms"
                                            className="p-3"
                                            value={values.terms}
                                            onChange={handleChange}
                                            rows={3}
                                            isInvalid={!!errors.terms && touched.terms}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.terms}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu hợp đồng
                            </Button>
                        </Modal.Footer>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
};

export default ContractModal;
