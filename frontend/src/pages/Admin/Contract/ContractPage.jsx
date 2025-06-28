import { Container, Tab, Tabs } from 'react-bootstrap';
import ContractList from '../../../components/contract/ContractList';

const ContractPage = () => {
    return (
        <Container>
            <Tabs id="page-contract">
                <Tab eventKey="contract-list" title="Danh sách hợp đồng">
                    <ContractList />
                </Tab>
                <Tab eventKey="create-contract" title="Xử lý hợp đồng">
                    <h1>heheeh</h1>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default ContractPage;
