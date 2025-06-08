import {
  FaHome,
  FaUser,
  FaCog,
  FaUsersCog,
  FaUserEdit,
  FaUserLock,
  FaCogs,
  FaBell,
  FaBed,
  FaUsers,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaConciergeBell,
  FaChartPie,
  FaPen,
} from "react-icons/fa";
import ProfilePage from "../pages/ProfilePage";
import SettingPage from "../pages/SettingPage";
import LoginPage from "../pages/LoginPage";
import EditProfile from "../pages/profile/EditProfile";
import HomePage from "../pages/Home/HomePage";

export const side_nav = [
  {
    path: "/",
    element: <HomePage />,
    name: "Trang chủ",
    icon: <FaHome size={25} />,
    children: [],
  },
  {
    path: "/room-manager",
    element: "",
    name: "Quản lý phòng",
    icon: <FaBed />,
  },
  {
    path: "/tenant-manager",
    element: "",
    name: "Quản lý người thuê",
    icon: <FaUser />,
  },
  {
    path: "/invoice-manager",
    element: "",
    name: "Quản lý hóa đơn",
    icon: <FaFileInvoiceDollar />,
  },
  {
    path: "/payment-manager",
    element: "",
    name: "Quản lý thanh toán",
    icon: <FaMoneyCheckAlt />,
  },
  {
    path: "/servicer",
    element: "",
    name: "Quản lý dịch vụ",
    icon: <FaConciergeBell />,
  },
  {
    path: "/dashboard-anlysist",
    element: "",
    name: "Phân tích dữ liệu",
    icon: <FaChartPie />,
  },
  {
    path: "/create-request",
    element: "",
    name: "Yêu cầu hỗ trợ",
    icon: <FaPen />,
  },
  {
    path: "/profile",
    element: "",
    name: "Thông tin cá nhân",
    icon: <FaUsersCog size={25} />,
    children: [
      {
        path: "/profile/edit",
        element: <EditProfile />,
        name: "Chỉnh sửa thông tin",
        icon: <FaUserEdit size={20} />,
      },
      {
        path: "/profile/change-password",
        element: <ProfilePage />,
        name: "Đổi mật khẩu",
        icon: <FaUserLock size={20} />,
      },
    ],
  },
  {
    path: "/setting",
    element: "",
    name: "Cài đặt",
    icon: <FaCogs size={25} />,
    children: [
      {
        path: "/setting/general",
        element: <SettingPage />,
        name: "Cài đặt chung",
        icon: <FaCog size={20} />,
      },
      {
        path: "/setting/notifications",
        element: <SettingPage />,
        name: "Thông báo",
        icon: <FaBell size={20} />,
      },
    ],
  },
];
