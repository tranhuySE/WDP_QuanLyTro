import { Outlet } from "react-router-dom";

const TenantLayout = () => {
    return (
        <div>
            {/* Bạn có thể thêm header, sidebar hoặc các thành phần khác ở đây */}
            <h1>Tenant Dashboard</h1>
            {/* Nội dung chính sẽ được render ở đây */}
            <Outlet />
        </div>
    );
}

export default TenantLayout;