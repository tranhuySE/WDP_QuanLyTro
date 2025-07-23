import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const formatCurrency = (value) => {
    if (isNaN(value)) return '';
    return value.toLocaleString('vi-VN');
};

const invoiceSchema = Yup.object().shape({
    content: Yup.string().required('Nội dung bắt buộc'),
    payment_type: Yup.string().required(),
    payment_status: Yup.string().required(),
    create_by: Yup.string(),
    for_room_id: Yup.string().required('Chọn phòng'),
    items: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Tên bắt buộc'),
            unit: Yup.string().required('Đơn vị bắt buộc'),
            quantity: Yup.number()
                .typeError('Số lượng phải là số')
                .moreThan(0, 'Số lượng phải lớn hơn 0')
                .required('Số lượng bắt buộc'),
            price_unit: Yup.number()
                .typeError('Đơn giá phải là số')
                .moreThan(0, 'Đơn giá phải lớn hơn 0')
                .required('Đơn giá bắt buộc'),
            subTotal: Yup.number().min(0),
        }),
    ),
});

const InvoiceModal = ({
    show,
    onHide,
    onSubmit,
    initialData,
    mode = 'create',
    roomOptions = [],
}) => {
    const isEdit = mode === 'edit';
    const [previewImages, setPreviewImages] = useState(initialData?.note?.img || []);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (initialData.note.img) {
            setPreviewImages(initialData.note.img);
            setFiles(initialData.note.img);
        } else {
            setPreviewImages([]);
            setFiles([]);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFiles((prev) => [...prev, ...selectedFiles]);
        setPreviewImages((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        const removed = previewImages[index];

        setPreviewImages((prev) => prev.filter((_, i) => i !== index));

        if (typeof removed === 'string') {
            setFiles((prev) =>
                prev.filter((file, i) => !(typeof file === 'string' && i === index)),
            );
        } else {
            let fileIndex = files.findIndex((f, i) => i === index && f instanceof File);
            if (fileIndex !== -1) {
                setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
            }
        }
    };

    const user_Id = localStorage.getItem('id');
    const userFullname = localStorage.getItem('fullname');

    const TotalCalculator = ({ values, setFieldValue }) => {
        useEffect(() => {
            const total = values.items.reduce((sum, item) => sum + (item.subTotal || 0), 0);
            setFieldValue('total_amount', total);
        }, [values.items, setFieldValue]);
        return null;
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn mới'}</Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={initialData}
                validationSchema={invoiceSchema}
                enableReinitialize
                onSubmit={(values) => {
                    values.create_by = user_Id;
                    const imagesToSend = [];
                    previewImages.forEach((preview, i) => {
                        const file = files[i];
                        if (typeof file === 'string') {
                            imagesToSend.push(file);
                        } else if (file instanceof File) {
                            imagesToSend.push(file);
                        }
                    });

                    values.img = imagesToSend;
                    onSubmit(values);
                    onHide();
                }}
            >
                {(formikProps) => {
                    const { isSubmitting, setFieldValue, values } = formikProps;

                    return (
                        <FormikForm>
                            <TotalCalculator values={values} setFieldValue={setFieldValue} />

                            <Modal.Body>
                                <h5>Người tạo : {userFullname}</h5>
                                <Row className="mb-1">
                                    <Col>
                                        <Form.Label>Phòng</Form.Label>
                                        <Field
                                            as="select"
                                            name="for_room_id"
                                            className="form-select"
                                        >
                                            <option value="">-- Chọn --</option>
                                            {roomOptions.map((r) => (
                                                <option key={r._id} value={r._id}>
                                                    {r.roomNumber}
                                                </option>
                                            ))}
                                        </Field>
                                        <Form.Text className="text-danger">
                                            <ErrorMessage name="for_room_id" />
                                        </Form.Text>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-1">
                                    <Form.Label>Nội dung</Form.Label>
                                    <Field as={Form.Control} name="content" className="p-2" />
                                    <Form.Text className="text-danger">
                                        <ErrorMessage name="content" />
                                    </Form.Text>
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Label>Phương thức</Form.Label>
                                        <Field
                                            as="select"
                                            name="payment_type"
                                            className="form-select"
                                        >
                                            <option value="e-banking">E-Banking</option>
                                            <option value="Cash">Tiền mặt</option>
                                        </Field>
                                    </Col>
                                    <Col>
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Field
                                            as="select"
                                            name="payment_status"
                                            className="form-select"
                                        >
                                            <option value="pending">Chưa thanh toán</option>
                                            <option value="paid">Đã thanh toán</option>
                                        </Field>
                                    </Col>
                                </Row>

                                <hr />

                                <Form.Group className="mb-1">
                                    <Form.Label>Ghi chú</Form.Label>
                                    <Field as={Form.Control} name="note.text" className="p-2" />
                                </Form.Group>

                                <Form.Group className="mb-1">
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="note.img"
                                        size="lg"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageChange(e)}
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

                                <hr />

                                <FieldArray name="items">
                                    {({ push, remove }) => (
                                        <>
                                            <h6>Chi tiết hóa đơn</h6>
                                            {values.items.map((item, index) => (
                                                <Row
                                                    key={index}
                                                    className="border border-1 border-dark-subtle rounded p-1 mb-2 align-items-center"
                                                >
                                                    <Col md={2}>
                                                        Tên
                                                        <Field
                                                            name={`items[${index}].name`}
                                                            className="form-control p-1"
                                                        />
                                                        <Form.Text>
                                                            <ErrorMessage
                                                                name={`items[${index}].name`}
                                                            />
                                                        </Form.Text>
                                                    </Col>
                                                    <Col md={2}>
                                                        Đơn vị
                                                        <Field
                                                            name={`items[${index}].unit`}
                                                            className="form-control p-1"
                                                        />
                                                        <Form.Text>
                                                            <ErrorMessage
                                                                name={`items[${index}].unit`}
                                                            />
                                                        </Form.Text>
                                                    </Col>
                                                    <Col md={2}>
                                                        Đơn giá
                                                        <Field
                                                            name={`items[${index}].price_unit`}
                                                            type="number"
                                                            className="form-control p-1"
                                                            onChange={(e) => {
                                                                const price = parseFloat(
                                                                    e.target.value || 0,
                                                                );
                                                                const qty = parseFloat(
                                                                    values.items[index].quantity ||
                                                                        0,
                                                                );
                                                                setFieldValue(
                                                                    `items[${index}].price_unit`,
                                                                    price,
                                                                );
                                                                setFieldValue(
                                                                    `items[${index}].subTotal`,
                                                                    price * qty,
                                                                );
                                                            }}
                                                        />
                                                        <Form.Text>
                                                            <ErrorMessage
                                                                name={`items[${index}].price_unit`}
                                                            />
                                                        </Form.Text>
                                                    </Col>
                                                    <Col md={2}>
                                                        Số lượng
                                                        <Field
                                                            name={`items[${index}].quantity`}
                                                            type="number"
                                                            className="form-control p-1"
                                                            onChange={(e) => {
                                                                const qty = parseFloat(
                                                                    e.target.value || 0,
                                                                );
                                                                const price = parseFloat(
                                                                    values.items[index]
                                                                        .price_unit || 0,
                                                                );
                                                                setFieldValue(
                                                                    `items[${index}].quantity`,
                                                                    qty,
                                                                );
                                                                setFieldValue(
                                                                    `items[${index}].subTotal`,
                                                                    price * qty,
                                                                );
                                                            }}
                                                        />
                                                        <Form.Text>
                                                            <ErrorMessage
                                                                name={`items[${index}].quantity`}
                                                            />
                                                        </Form.Text>
                                                    </Col>
                                                    <Col md={2}>
                                                        Thành tiền
                                                        <Form.Control
                                                            value={formatCurrency(
                                                                values.items[index].subTotal || 0,
                                                            )}
                                                            readOnly
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={2}
                                                        className="d-flex justify-content-center border border-2 p-3 border-danger rounded"
                                                    >
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    push({
                                                        name: '',
                                                        unit: '',
                                                        price_unit: 0,
                                                        quantity: 1,
                                                        subTotal: 0,
                                                    })
                                                }
                                            >
                                                <FaPlus /> Thêm dòng
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>

                                <hr />
                                <h5 className="text-end">
                                    Tổng cộng: {formatCurrency(values.total_amount)} ₫
                                </h5>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        onHide();
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting || !formikProps.isValid}
                                >
                                    {isEdit ? 'Cập nhật' : 'Tạo mới'}
                                </Button>
                            </Modal.Footer>
                        </FormikForm>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default InvoiceModal;
