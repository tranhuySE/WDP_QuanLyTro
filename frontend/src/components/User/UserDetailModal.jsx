import {
    Calendar,
    CheckCircle,
    Home,
    Mail,
    Phone,
    Shield,
    User,
    UserCheck,
    UserX
} from 'lucide-react';
import moment from 'moment';
import {
    Alert,
    Badge,
    Button,
    Image,
    Modal,
    Tab,
    Tabs
} from 'react-bootstrap';

const UserDetailModal = ({
    show,
    onHide,
    user: selectedUser,
    onVerify
}) => {
    if (!selectedUser) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-4">
                    <Image
                        src={selectedUser.avatar}
                        roundedCircle
                        width={100}
                        height={100}
                        className="border"
                    />
                    <h4 className="mt-3">{selectedUser.fullname}</h4>
                    <div className="d-flex justify-content-center gap-2 mb-2">
                        <Badge
                            bg={
                                selectedUser.role === 'admin'
                                    ? 'danger'
                                    : selectedUser.role === 'staff'
                                        ? 'warning'
                                        : 'primary'
                            }
                        >
                            {selectedUser.role === 'admin' ? 'Quản trị' :
                                selectedUser.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                        </Badge>
                        <Badge bg={selectedUser.isVerifiedByAdmin ? 'success' : 'warning'}>
                            {selectedUser.isVerifiedByAdmin ? 'Đã xác minh' : 'Chưa xác minh'}
                        </Badge>
                    </div>
                </div>

                <Tabs defaultActiveKey="info" className="mb-3">
                    <Tab eventKey="info" title="Thông tin chung">
                        <div className="mt-3">
                            <div className="d-flex align-items-center mb-3">
                                <Mail size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">Email</small>
                                    <div>{selectedUser.email}</div>
                                </div>
                            </div>
                            {selectedUser.isVerifiedByAdmin && (
                                <>
                                    <div className="d-flex align-items-center mb-3">
                                        <User size={18} className="me-2 text-muted" />
                                        <div>
                                            <small className="text-muted">Tên đăng nhập</small>
                                            <div>{selectedUser.username}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="d-flex align-items-center mb-3">
                                <Phone size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">Số phòng</small>
                                    <div>{selectedUser.room && selectedUser.room.roomNumber ? selectedUser.room.roomNumber : 'Chưa có'}</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Phone size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">Số điện thoại</small>
                                    <div>{selectedUser.phoneNumber}</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Shield size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">CMND/CCCD</small>
                                    <div>{selectedUser.citizen_id}</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Calendar size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">Ngày sinh</small>
                                    <div>{moment(selectedUser.dateOfBirth).format('DD/MM/YYYY')}</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Home size={18} className="me-2 text-muted" />
                                <div>
                                    <small className="text-muted">Địa chỉ</small>
                                    <div>{selectedUser.address}</div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="emergency" title="Liên hệ khẩn cấp">
                        <div className="mt-3">
                            {selectedUser.contactEmergency ? (
                                <>
                                    <div className="d-flex align-items-center mb-3">
                                        <UserCheck size={18} className="me-2 text-muted" />
                                        <div>
                                            <small className="text-muted">Tên người liên hệ</small>
                                            <div>{selectedUser.contactEmergency.name}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                        <User size={18} className="me-2 text-muted" />
                                        <div>
                                            <small className="text-muted">Mối quan hệ</small>
                                            <div>{selectedUser.contactEmergency.relationship}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                        <Phone size={18} className="me-2 text-muted" />
                                        <div>
                                            <small className="text-muted">Số điện thoại liên hệ</small>
                                            <div>{selectedUser.contactEmergency.phoneNumber}</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <UserX size={32} className="mb-2" />
                                    <p>Không có thông tin liên hệ khẩn cấp</p>
                                </div>
                            )}
                        </div>
                    </Tab>

                    {!selectedUser.isVerifiedByAdmin && (
                        <Tab eventKey="verify" title="Xác minh">
                            <div className="mt-4 text-center">
                                <Alert variant="warning" className="mb-4">
                                    Người dùng này chưa được xác minh và chưa có tài khoản đăng nhập
                                </Alert>
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={() => {
                                        onHide();
                                        onVerify(selectedUser);
                                    }}
                                >
                                    <CheckCircle size={20} className="me-2" />
                                    Xác minh người dùng
                                </Button>
                            </div>
                        </Tab>
                    )}
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailModal;