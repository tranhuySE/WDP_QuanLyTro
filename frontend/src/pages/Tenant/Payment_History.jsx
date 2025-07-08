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
  const [globalFilter, setGlobalFilter] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const fetchData = useCallback(async () => {
    if (!data.length) setIsLoading(true);
    else setIsRefetching(true);

    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...globalFilter,
    };

    try {
      const response = await axios.get(API_URL, { params });
      setData(response.data.invoices);
      setRowCount(response.data.totalItems);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      toast.error("Lỗi khi tải dữ liệu hoá đơn!");
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
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === "paid"
                  ? theme.palette.success.dark
                  : theme.palette.warning.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue() === "paid" ? "Đã trả" : "Chưa trả"}
          </Box>
        ),
      },
    ],
    []
  );

  const handleDownloadPDF = (invoiceId) =>
    window.open(`${API_URL}/${invoiceId}/download`, "_blank");
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
            <Tooltip title="Tải PDF">
              <IconButton
                color="error"
                onClick={() => handleDownloadPDF(row.original._id)}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Formik
            initialValues={{ status: "", startDate: "", endDate: "" }}
            onSubmit={(values) => setGlobalFilter(values)}
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
                  <Field as="select" name="status" className="filter-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="pending">Chưa thanh toán</option>
                  </Field>
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
