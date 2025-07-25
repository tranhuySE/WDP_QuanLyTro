import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteModal = ({
    show,
    onHide,
    onConfirm,
    title = 'Xác nhận xóa',
    message = 'Bạn có chắc muốn xóa mục này?',
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;
