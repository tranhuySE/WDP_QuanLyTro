// src/pages/Tenant/Payment_History.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip, Button, Typography } from "@mui/material";
import { Visibility, PictureAsPdf } from "@mui/icons-material";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import InvoiceDetailModal from "../../components/Modals/InvoiceDetailModal";

const API_URL = "http://localhost:9999/api/history";

const Payment_History = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState({ status: "paid" });
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn!");
      setIsLoading(false);
      return;
    }

    if (!data.length) setIsLoading(true);
    else setIsRefetching(true);

    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...globalFilter,
    };

    try {
      const response = await axios.get(API_URL, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.invoices);
      setRowCount(response.data.totalItems);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Lỗi khi tải dữ liệu hoá đơn!");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        Cell: ({ cell }) => <span>{cell.getValue().slice(-8)}</span>,
      },
      { accessorKey: "for_room_id.roomNumber", header: "Phòng" },
      {
        accessorKey: "total_amount",
        header: "Tổng tiền",
        Cell: ({ cell }) => `${cell.getValue().toLocaleString("vi-VN")} VNĐ`,
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        Cell: ({ cell }) =>
          new Date(cell.getValue()).toLocaleDateString("vi-VN"),
      },
      {
        accessorKey: "payment_status",
        header: "Trạng thái",
        Cell: () => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            Đã thanh toán 
          </Box>
        ),
      },
    ],
    []
  );

  const handleDownloadPDF = (invoiceId) => {
    const token = localStorage.getItem("token");

    // --- BƯỚC KIỂM TRA QUAN TRỌNG ---
    if (!token) {
      toast.error("Không tìm thấy token. Vui lòng đăng nhập lại!");
      return; // Dừng hàm nếu không có token
    }
    // ---------------------------------

    axios
      .get(`${API_URL}/${invoiceId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = response.headers["content-disposition"];
        let filename = `hoa-don-${invoiceId}.pdf`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url); // Dọn dẹp
      })
      .catch((error) => {
        console.error("Lỗi khi tải PDF: ", error);
        if (error.response && error.response.status === 401) {
          toast.error("Lỗi xác thực hoặc phiên hết hạn.");
        } else if (error.response && error.response.status === 404) {
          toast.error("Không tìm thấy hóa đơn hoặc dữ liệu liên quan.");
        } else {
          toast.error("Không thể tải file PDF!");
        }
      });
  };

  const handleViewDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsModalOpen(true);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Lịch sử Thanh toán
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip title="Xem chi tiết">
              <IconButton onClick={() => handleViewDetails(row.original._id)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Tải PDF">
              <IconButton
                color="error"
                onClick={() => handleDownloadPDF(row.original._id)}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip> */}
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Formik
            initialValues={{ startDate: "", endDate: "" }}
            onSubmit={(values) =>
              setGlobalFilter({ ...values, status: "paid" })
            }
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    p: "4px",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1">Bộ lọc:</Typography>
                  <Field
                    type="date"
                    name="startDate"
                    className="filter-input"
                  />
                  <Field type="date" name="endDate" className="filter-input" />
                  <Button type="submit" variant="contained" size="small">
                    Lọc
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
        manualPagination
        rowCount={rowCount}
        onPaginationChange={setPagination}
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        muiToolbarAlertBannerProps={
          isError
            ? { color: "error", children: "Lỗi khi tải dữ liệu" }
            : undefined
        }
      />
      {selectedInvoiceId && (
        <InvoiceDetailModal
          invoiceId={selectedInvoiceId}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Payment_History;
