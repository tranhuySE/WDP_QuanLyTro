import { Tab, Tabs, Row } from 'react-bootstrap';
import ContractList from '../../../components/contract/ContractList';
import { FaFileAlt, FaFileSignature } from 'react-icons/fa';

const ContractPage = () => {
    return (
        <>
            <Row className="d-flex justify-content-start">
                <Tabs id="page-contract" defaultActiveKey="contract-list" justify>
                    <Tab
                        eventKey="contract-list"
                        title={
                            <span className="d-flex align-items-center">
                                <FaFileAlt style={{ marginRight: 4 }} />
                                Danh sách hợp đồng
                            </span>
                        }
                    >
                        <ContractList />
                    </Tab>
                    <Tab
                        eventKey="create-contract"
                        title={
                            <span className="d-flex align-items-center">
                                <FaFileSignature style={{ marginRight: 4 }} />
                                Xử lý ...
                            </span>
                        }
                    >
                        <div>
                            <h4>Form xử lý hợp đồng</h4>
                            <p>Bạn có thể tạo hoặc chỉnh sửa hợp đồng tại đây.</p>
                            {/* Thêm form hoặc component xử lý hợp đồng tại đây */}
                        </div>
                    </Tab>
                </Tabs>
            </Row>
        </>
    );
};

export default ContractPage;
