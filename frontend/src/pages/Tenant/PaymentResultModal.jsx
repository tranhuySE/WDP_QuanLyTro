import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentResultModal = ({ show, onClose, success }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {success ? '🎉 Thanh toán thành công' : '❌ Thanh toán thất bại'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {success ? (
                    <>
                        <h4>Cảm ơn bạn đã thanh toán hóa đơn!</h4>
                        <p>Hóa đơn đã được cập nhật trong hệ thống.</p>
                    </>
                ) : (
                    <>
                        <h4>Giao dịch không thành công.</h4>
                        <p>Vui lòng thử lại hoặc kiểm tra trạng thái thanh toán.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={success ? 'success' : 'danger'} onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentResultModal;
