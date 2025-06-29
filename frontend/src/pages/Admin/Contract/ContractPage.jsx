import { Tab, Tabs, Row } from 'react-bootstrap';
import ContractList from '../../../components/contract/ContractList';

const ContractPage = () => {
    return (
        <>
            <Row className="d-flex justify-content-start">
                <Tabs id="page-contract" defaultActiveKey="contract-list" justify>
                    <Tab eventKey="contract-list" title="📄 Danh sách hợp đồng">
                        <ContractList />
                    </Tab>
                    <Tab eventKey="create-contract" title="📝 Xử lý hợp đồng">
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
