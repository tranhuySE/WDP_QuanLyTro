import { Tab, Tabs, Container } from 'react-bootstrap';
import ContractList from '../../../components/contract/ContractList';
import { FaFileAlt, FaFileSignature } from 'react-icons/fa';

const ContractPage = () => {
    return (
        <>
            <Container fluid>
                <h4 className="text-center">Quản lý hợp đồng</h4>
                <ContractList />
            </Container>
        </>
    );
};

export default ContractPage;
