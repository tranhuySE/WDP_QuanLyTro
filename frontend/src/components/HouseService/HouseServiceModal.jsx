import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Tên dịch vụ là bắt buộc'),
    unit: Yup.string().required('Đơn vị là bắt buộc'),
    price: Yup.number().required('Giá là bắt buộc').min(0, 'Giá không được âm'),
});

const HouseServiceModal = ({ show, onHide, initialData, onSubmit }) => {
    const isEdit = initialData?._id;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}</Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={{
                    name: initialData?.name || '',
                    unit: initialData?.unit || '',
                    price: initialData?.price || 0,
                }}
                validationSchema={serviceSchema}
                onSubmit={(values) => {
                    const data = {
                        ...values,
                        _id: initialData?._id,
                    };
                    onSubmit(data);
                    onHide();
                }}
            >
                {({ handleSubmit }) => (
                    <FormikForm onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group as={Row} className="mb-3" controlId="name">
                                <Form.Label column sm={4}>
                                    Tên dịch vụ
                                </Form.Label>
                                <Col sm={8}>
                                    <Field name="name" as={Form.Control} />
                                    <div className="text-danger">
                                        <ErrorMessage name="name" />
                                    </div>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="unit">
                                <Form.Label column sm={4}>
                                    Đơn vị
                                </Form.Label>
                                <Col sm={8}>
                                    <Field name="unit" as={Form.Control} />
                                    <div className="text-danger">
                                        <ErrorMessage name="unit" />
                                    </div>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="price">
                                <Form.Label column sm={4}>
                                    Đơn giá (VND)
                                </Form.Label>
                                <Col sm={8}>
                                    <Field name="price" type="number" as={Form.Control} />
                                    <div className="text-danger">
                                        <ErrorMessage name="price" />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Huỷ
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEdit ? 'Cập nhật' : 'Thêm'}
                            </Button>
                        </Modal.Footer>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
};

export default HouseServiceModal;
