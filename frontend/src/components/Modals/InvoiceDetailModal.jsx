import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Grid,
  Stack,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Close,
  ReceiptLong,
  Person,
  Apartment,
  CalendarToday,
  CheckCircle,
  Paid,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:9999/api/history";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600, md: 700 },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  maxHeight: "90vh",
  overflowY: "auto",
};

const InfoItem = ({ icon, primary, secondary }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    {icon}
    <Box>
      <Typography variant="body2" color="text.secondary">
        {primary}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {secondary || "N/A"}
      </Typography>
    </Box>
  </Stack>
);

const InvoiceDetailModal = ({ invoiceId, open, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && invoiceId) {
      const fetchInvoiceDetails = async () => {
        setIsLoading(true);
        setError("");
        setInvoice(null);

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Không tìm thấy token xác thực.");
          setError("Vui lòng đăng nhập lại.");
          setIsLoading(false);
          return;
        }

        try {
          const response = await axios.get(`${API_URL}/${invoiceId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setInvoice(response.data);
        } catch (err) {
          console.error("Lỗi khi fetch chi tiết hóa đơn:", err);
          setError("Đã có lỗi xảy ra khi tải dữ liệu.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInvoiceDetails();
    }
  }, [invoiceId, open]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      );
    }
    if (invoice) {
      const isPaid = invoice.payment_status === "paid";

      // ===================================================================
      // === FIX: LẤY VÀ HIỂN THỊ TÊN CỦA TẤT CẢ NGƯỜI THUÊ ================
      // ===================================================================
      const tenants = invoice.for_room_id?.tenant;
      let tenantNames = "Chưa có người thuê"; // Giá trị mặc định

      if (tenants && tenants.length > 0) {
        // Dùng map để lấy fullname và join để nối chúng lại
        tenantNames = tenants.map((t) => t.fullname).join(", ");
      }
      // ===================================================================

      return (
        <Paper elevation={0} sx={{ p: 0 }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <ReceiptLong color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Hoá đơn điện tử
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {invoice._id}
                </Typography>
              </Box>
            </Stack>
            <Chip
              icon={isPaid ? <CheckCircle /> : <Paid />}
              label={isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              color={isPaid ? "success" : "warning"}
              size="small"
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Thông tin người thuê và phòng */}
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <InfoItem
                  icon={<Person color="action" />}
                  primary="Người thuê"
                  secondary={tenantNames} // <-- Sử dụng biến mới ở đây
                />
                <InfoItem
                  icon={<Apartment color="action" />}
                  primary="Phòng"
                  secondary={invoice.for_room_id?.roomNumber}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <InfoItem
                  icon={<CalendarToday color="action" />}
                  primary="Ngày tạo hóa đơn"
                  secondary={new Date(invoice.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                />
                {isPaid && (
                  <InfoItem
                    icon={<CalendarToday color="action" />}
                    primary="Ngày thanh toán"
                    secondary={new Date(invoice.paid_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Bảng chi tiết các khoản phí */}
          <Typography variant="h6" gutterBottom>
            Chi tiết các khoản phí
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell>Hạng mục</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      {item.price_unit?.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "500" }}>
                      {item.subTotal?.toLocaleString("vi-VN")} VNĐ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tổng cộng */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Tổng cộng</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {invoice.total_amount?.toLocaleString("vi-VN")} VNĐ
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default InvoiceDetailModal;
