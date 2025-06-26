import {
    FaBed,
    FaBell,
    FaChartPie,
    FaCog,
    FaCogs,
    FaConciergeBell,
    FaFileInvoiceDollar,
    FaHome,
    FaPen,
    FaUser,
    FaUserEdit,
    FaUserLock,
    FaUsersCog,
} from 'react-icons/fa';
import { ROUTES } from '../constants/routes.js';
import Analyst from '../pages/Admin/Dasboard/Analyst.jsx';
import HomePage from '../pages/Admin/HomePage';
import RequestManagement from '../pages/Admin/RequestManagement/index.jsx';
import ManageRoomPage from '../pages/Admin/Users/ManageRoom.jsx';
import UserManagement from '../pages/Admin/Users/UserManagement.jsx';
import ChangePasswordPage from '../pages/Auth/ChangePasswordPage';
import EditProfilePage from '../pages/Common/EditProfilePage';
import ManageRoomPage from "../pages/Admin/Rooms/ManageRoomPage.jsx"; 

export const side_nav = [
    {
        path: ROUTES.ADMIN_HOMEPAGE,
        element: <HomePage />,
        name: 'Trang chủ',
        icon: <FaHome size={25} />,
        children: [],
    },
    {
        path: ROUTES.DASHBOARD,
        element: <Analyst />,
        name: 'Phân tích dữ liệu',
        icon: <FaChartPie />,
    },
    {
        element: '',
        name: 'Quản lý hệ thống',
        icon: <FaUsersCog size={25} />,
        children: [
            {
                path: ROUTES.MANAGE_ROOMS,
                element: <ManageRoomPage />,
                name: 'Quản lý phòng',
                icon: <FaBed />,
            },
            {
                path: ROUTES.ACCOUNTS_LIST,
                element: <UserManagement />,
                name: 'Quản lý tài khoản',
                icon: <FaUser />,
            },
            {
                path: '',
                element: '',
                name: 'Quản lý hóa đơn',
                icon: <FaFileInvoiceDollar />,
            },
            {
                path: '',
                element: '',
                name: 'Quản lý hợp đồng',
                icon: <FaUser />,
            },
            {
                path: '',
                element: '',
                name: 'Quản lý dịch vụ',
                icon: <FaConciergeBell />,
            },
        ],
    },
    {
        path: ROUTES.TENANT_REQUESTS,
        element: <RequestManagement />,
        name: 'Yêu cầu hỗ trợ',
        icon: <FaPen />,
    },
    {
        element: '',
        name: 'Thông tin cá nhân',
        icon: <FaUsersCog size={25} />,
        children: [
            {
                // path: ROUTES.EDIT_PROFILE,
                element: <EditProfilePage />,
                name: 'Chỉnh sửa thông tin',
                icon: <FaUserEdit size={20} />,
            },
            {
                // path: ROUTES.CHANGE_PASSWORD,
                element: <ChangePasswordPage />,
                name: 'Đổi mật khẩu',
                icon: <FaUserLock size={20} />,
            },
        ],
    },
    {
        element: '',
        name: 'Cài đặt',
        icon: <FaCogs size={25} />,
        children: [
            {
                path: '',
                name: 'Cài đặt chung',
                icon: <FaCog size={20} />,
            },
            {
                path: '',
                name: 'Thông báo',
                icon: <FaBell size={20} />,
            },
        ],
    },
];
