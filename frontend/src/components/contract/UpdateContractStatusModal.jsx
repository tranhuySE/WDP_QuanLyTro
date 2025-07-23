import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';

const statusOptions = [
    { value: 'draft', label: 'Nháp' },
    { value: 'active', label: 'Đang hiệu lực' },
    { value: 'terminated', label: 'Đã chấm dứt' },
];

const validationSchema = Yup.object().shape({
    status: Yup.string().required('Bắt buộc chọn trạng thái'),
    terminationReason: Yup.string().when('status', {
        is: 'terminated',
        then: () => Yup.string().required('Bắt buộc nhập lý do'),
        otherwise: () => Yup.string().notRequired(),
    }),
});

const UpdateContractStatusModal = ({ show, onHide, contract, onSubmit }) => {
    return (
        <Modal show={show} onHide={onHide} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật trạng thái hợp đồng</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={{
                    status: contract?.status || 'draft',
                    terminationReason: contract?.terminationReason || '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('Submitting with values:', values);
                    onSubmit(values);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, handleChange }) => (
                    <FormikForm>
                        <Modal.Body>
                            <Form.Group controlId="status">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    isInvalid={touched.status && !!errors.status}
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.status}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {values.status === 'terminated' && (
                                <Form.Group className="mt-3" controlId="terminationReason">
                                    <Form.Label>Lý do chấm dứt</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="terminationReason"
                                        value={values.terminationReason}
                                        onChange={handleChange}
                                        isInvalid={
                                            touched.terminationReason && !!errors.terminationReason
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.terminationReason}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu thay đổi
                            </Button>
                        </Modal.Footer>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
};

export default UpdateContractStatusModal;
