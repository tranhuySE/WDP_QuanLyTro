import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// URL của backend
const API_URL = "http://localhost:9999/api/history";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InvoiceDetailModal = ({ invoiceId, open, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && invoiceId) {
      const fetchInvoiceDetail = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/${invoiceId}`);
          setInvoice(response.data);
        } catch (err) {
          console.error("Failed to fetch invoice details:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchInvoiceDetail();
    }
  }, [invoiceId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2">
          Chi tiết Hoá đơn
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : invoice ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              <strong>ID:</strong> {invoice._id}
            </Typography>
            <Typography>
              <strong>Nội dung:</strong> {invoice.content}
            </Typography>
            <Typography>
              <strong>Phòng:</strong> {invoice.for_room_id?.roomNumber}
            </Typography>
            <Typography>
              <strong>Người thuê:</strong> {invoice.create_by?.fullname}
            </Typography>
            <Typography>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
            </Typography>
            <Typography>
              <strong>Trạng thái:</strong>{" "}
              {invoice.payment_status === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Các khoản phí:</Typography>
            <List dense>
              {invoice.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Đơn giá: ${item.price_unit.toLocaleString(
                      "vi-VN"
                    )} VNĐ - Thành tiền: ${item.subTotal.toLocaleString(
                      "vi-VN"
                    )} VNĐ`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" align="right">
              <strong>
                Tổng cộng: {invoice.total_amount.toLocaleString("vi-VN")} VNĐ
              </strong>
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ mt: 2 }}>Không thể tải dữ liệu.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default InvoiceDetailModal;
