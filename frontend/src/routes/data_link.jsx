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
    FaUsersCog
} from "react-icons/fa";
import { ROUTES } from "../constants/routes.js";
import HomePage from "../pages/Admin/HomePage";
import ChangePasswordPage from "../pages/Auth/ChangePasswordPage";
import EditProfilePage from "../pages/Common/EditProfilePage";
import ManageRoomPage from "../pages/Admin/ManageRoom.jsx";
export const side_nav = [
  {
    path: ROUTES.ADMIN_HOMEPAGE,
    element: <HomePage />,
    name: "Trang chủ",
    icon: <FaHome size={25} />,
    children: [],
  },
  {
    path: ROUTES.DASHBOARD,
    element: "",
    name: "Phân tích dữ liệu",
    icon: <FaChartPie />,
  },
  {
    element: "",
    name: "Quản lý hệ thống",
    icon: <FaUsersCog size={25} />,
    children: [
      {
        path: ROUTES.MANAGE_ROOMS,
        element: <ManageRoomPage />,
        name: "Quản lý phòng",
        icon: <FaBed />,
      },
      {
        path: ROUTES.MANAGE_ACCOUNTS,
        element: "",
        name: "Quản lý tài khoản",
        icon: <FaUser />,
      },
      {
        path: "",
        element: "",
        name: "Quản lý hóa đơn",
        icon: <FaFileInvoiceDollar />,
      },
      {
        path: "",
        element: "",
        name: "Quản lý hợp đồng",
        icon: <FaUser />,
      },
      {
        path: "",
        element: "",
        name: "Quản lý dịch vụ",
        icon: <FaConciergeBell />,
      },
    ],
  },
  {
    path: ROUTES.TENANT_REQUESTS,
    element: "",
    name: "Yêu cầu hỗ trợ",
    icon: <FaPen />,
  },
  {
    element: "",
    name: "Thông tin cá nhân",
    icon: <FaUsersCog size={25} />,
    children: [
      {
        path: ROUTES.EDIT_PROFILE,
        element: <EditProfilePage />,
        name: "Chỉnh sửa thông tin",
        icon: <FaUserEdit size={20} />,
      },
      {
        path: ROUTES.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
        name: "Đổi mật khẩu",
        icon: <FaUserLock size={20} />,
      },
    ],
  },
  {
    element: "",
    name: "Cài đặt",
    icon: <FaCogs size={25} />,
    children: [
      {
        path: "",
        name: "Cài đặt chung",
        icon: <FaCog size={20} />,
      },
      {
        path: "",
        name: "Thông báo",
        icon: <FaBell size={20} />,
      },
    ],
  },
];
