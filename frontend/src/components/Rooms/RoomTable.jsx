import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  MenuItem,
  ListItemIcon,
  Autocomplete,
  CircularProgress,
  Card,
  CardMedia,
  CardActions,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Visibility,
  AddCircleOutline,
  RemoveCircleOutline,
  Person,
  Close,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { Formik, Form, Field, FieldArray } from "formik";
import { roomValidationSchema } from "../../validation/roomSchema";

import {
  getAllRooms,
  createRoom,
  updateRoomById,
  deleteRoomById,
} from "../../api/roomAPI";
import { getAllUsers } from "../../api/userAPI";

// Component hiển thị chi tiết thông tin phòng
const RoomDetails = ({ room }) => {
  if (!room) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Typography>
            <strong>Số phòng:</strong> {room.roomNumber}
          </Typography>
          <Typography>
            <strong>Tầng:</strong> {room.floor}
          </Typography>
          <Typography>
            <strong>Giá phòng:</strong> {room.price?.toLocaleString("vi-VN")}{" "}
            VND
          </Typography>
          <Typography>
            <strong>Diện tích:</strong> {room.area} m²
          </Typography>
          <Typography>
            <strong>Số người tối đa:</strong> {room.maxOccupants}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong>{" "}
            <Chip
              label={room.status}
              color={room.status === "available" ? "success" : "warning"}
              size="small"
            />
          </Typography>
          <Typography>
            <strong>Mô tả:</strong> {room.description || "Không có"}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Người thuê
          </Typography>
          {room.tenant?.length > 0 ? (
            <List dense>
              {room.tenant.map((t) => (
                <ListItem key={t._id}>
                  <ListItemText primary={t.fullname} secondary={t.email} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Chưa có người thuê</Typography>
          )}
        </Grid>
        {/* NEW: Hiển thị hình ảnh */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Hình ảnh
          </Typography>
          {room.images?.length > 0 ? (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {room.images.map((img, i) => (
                <Card key={i} sx={{ width: 150, height: 100 }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={img}
                    alt={`Hình ảnh phòng ${i + 1}`}
                  />
                </Card>
              ))}
            </Box>
          ) : (
            <Typography>Chưa có hình ảnh.</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Tiện ích trong phòng
          </Typography>
          {room.amenities?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {room.amenities.map((a, i) => (
                <Chip key={i} label={`${a.name} (SL: ${a.quantity})`} />
              ))}
            </Box>
          ) : (
            <Typography>Không có tiện ích nào.</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Tài sản của người thuê
          </Typography>
          {room.assets?.length > 0 ? (
            <List dense>
              {room.assets.map((a, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`${a.type}: ${a.licensePlate || "Không có BKS"}`}
                    secondary={a.description}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Không có tài sản nào.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

// Component TextField tích hợp với Formik để hiển thị lỗi
const FormikTextField = ({ name, label, ...props }) => {
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          fullWidth
          variant="outlined"
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
        />
      )}
    </Field>
  );
};

// Form để thêm và sửa phòng
const RoomForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSaving,
  allUsers = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // NEW: Hàm giả lập upload ảnh.
  // Trong thực tế, bạn sẽ gọi API upload của mình ở đây.
  const handleImageUpload = async (files, push) => {
    setIsUploading(true);
    try {
      // Lặp qua từng file và "upload"
      for (const file of files) {
        // Đây là nơi bạn sẽ dùng axios để gửi file lên server
        // const formData = new FormData();
        // formData.append('image', file);
        // const response = await axios.post('/api/upload', formData);
        // const imageUrl = response.data.url;

        // ---- Giả lập API call ----
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập độ trễ mạng
        const imageUrl = `https://placehold.co/600x400/EEE/31343C?text=Uploaded!`;
        // ---- Kết thúc giả lập ----

        push(imageUrl); // Thêm URL mới vào mảng images của Formik
      }
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Tải ảnh lên thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={roomValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <DialogTitle>
            {initialValues._id
              ? `Chỉnh sửa phòng ${initialValues.roomNumber}`
              : "Thêm phòng mới"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {/* Các trường cơ bản */}
              <Grid item xs={12} sm={6}>
                <FormikTextField name="roomNumber" label="Số phòng" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikTextField name="floor" label="Tầng" type="number" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikTextField
                  name="area"
                  label="Diện tích (m²)"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikTextField name="price" label="Giá (VND)" type="number" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikTextField
                  name="maxOccupants"
                  label="Số người tối đa"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="status">
                  {({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Trạng thái"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        field.onChange(e);
                        if (newStatus !== "occupied") {
                          setFieldValue("tenant", []);
                        }
                      }}
                    >
                      <MenuItem value="available">Còn trống</MenuItem>
                      <MenuItem value="occupied">Đã thuê</MenuItem>
                      <MenuItem value="under_maintenance">
                        Đang bảo trì
                      </MenuItem>
                    </TextField>
                  )}
                </Field>
              </Grid>

              {/* Hiển thị ô chọn người thuê khi trạng thái là "Đã thuê" */}
              {values.status === "occupied" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Người thuê
                  </Typography>
                  <Autocomplete
                    multiple
                    options={allUsers}
                    getOptionLabel={(option) =>
                      `${option.fullname} (${option.email})`
                    }
                    value={values.tenant}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    onChange={(event, newValue) =>
                      setFieldValue("tenant", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Chọn hoặc tìm người thuê"
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormikTextField
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={3}
                />
              </Grid>

              {/* NEW: Quản lý Hình ảnh */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Hình ảnh
                </Typography>
                <FieldArray name="images">
                  {({ push, remove }) => (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {values.images?.map((img, index) => (
                          <Card
                            key={index}
                            sx={{ width: 150, position: "relative" }}
                          >
                            <CardMedia
                              component="img"
                              height="100"
                              image={img}
                              alt={`Image ${index + 1}`}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "rgba(255,255,255,0.7)",
                              }}
                              onClick={() => remove(index)}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Card>
                        ))}
                      </Box>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={isUploading}
                        startIcon={
                          isUploading ? <CircularProgress size={20} /> : <Add />
                        }
                      >
                        Tải ảnh lên
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e.currentTarget.files, push)
                          }
                        />
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>

              {/* Quản lý Tiện ích */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Tiện ích
                </Typography>
                <FieldArray name="amenities">
                  {({ push, remove }) => (
                    <Box>
                      {values.amenities?.map((_, index) => (
                        <Grid
                          container
                          spacing={1}
                          key={index}
                          sx={{ mb: 1, alignItems: "center" }}
                        >
                          <Grid item xs={4}>
                            <FormikTextField
                              name={`amenities[${index}].name`}
                              label="Tên tiện ích"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormikTextField
                              name={`amenities[${index}].quantity`}
                              label="Số lượng"
                              type="number"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormikTextField
                              name={`amenities[${index}].status`}
                              label="Trạng thái"
                              size="small"
                              select
                            >
                              <MenuItem value="available">Tốt</MenuItem>
                              <MenuItem value="unavailable">Hỏng</MenuItem>
                            </FormikTextField>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() => remove(index)}
                              color="error"
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        startIcon={<AddCircleOutline />}
                        onClick={() =>
                          push({ name: "", quantity: 1, status: "available" })
                        }
                      >
                        Thêm tiện ích
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>

              {/* Quản lý Tài sản */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Tài sản của người thuê
                </Typography>
                <FieldArray name="assets">
                  {({ push, remove }) => (
                    <Box>
                      {values.assets?.map((_, index) => (
                        <Grid
                          container
                          spacing={1}
                          key={index}
                          sx={{ mb: 1, alignItems: "center" }}
                        >
                          <Grid item xs={12} sm={3}>
                            <FormikTextField
                              name={`assets[${index}].type`}
                              label="Loại tài sản"
                              size="small"
                              select
                            >
                              <MenuItem value="motorbike">Xe máy</MenuItem>
                              <MenuItem value="car">Ô tô</MenuItem>
                              <MenuItem value="bicycle">Xe đạp</MenuItem>
                              <MenuItem value="other">Khác</MenuItem>
                            </FormikTextField>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <FormikTextField
                              name={`assets[${index}].licensePlate`}
                              label="Biển số"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormikTextField
                              name={`assets[${index}].description`}
                              label="Mô tả"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <IconButton
                              onClick={() => remove(index)}
                              color="error"
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        startIcon={<AddCircleOutline />}
                        onClick={() =>
                          push({
                            type: "motorbike",
                            licensePlate: "",
                            description: "",
                            quantity: 1,
                          })
                        }
                      >
                        Thêm tài sản
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button onClick={onCancel} color="secondary">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving || isUploading}
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [roomsResponse, usersResponse] = await Promise.all([
        getAllRooms(),
        getAllUsers(),
      ]);
      setRooms(roomsResponse.data);
      if (usersResponse.data && Array.isArray(usersResponse.data)) {
        setAllUsers(usersResponse.data.filter((u) => u.role === "user"));
      }
    } catch (error) {
      console.error(
        "Lỗi khi tải dữ liệu:",
        error.response ? error.response.data : error
      );
      toast.error("Không thể tải dữ liệu từ máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const preparePayload = (values) => {
    const payload = { ...values };
    if (payload.status !== "occupied") {
      payload.tenant = [];
    } else if (payload.tenant?.length > 0) {
      payload.tenant = payload.tenant.map((t) => t._id || t);
    }
    return payload;
  };

  const handleCreateRoom = async (values, { setSubmitting }) => {
    const roomNumberExists = rooms.some(
      (room) =>
        room.roomNumber.toLowerCase() === values.roomNumber.toLowerCase().trim()
    );
    if (roomNumberExists) {
      toast.error(`Số phòng "${values.roomNumber}" đã tồn tại!`);
      setSubmitting(false);
      return;
    }
    setIsSaving(true);
    try {
      await createRoom(preparePayload(values));
      toast.success("Thêm phòng thành công!");
      fetchAllData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(
        "Lỗi khi thêm phòng:",
        error.response ? error.response.data : error
      );
      toast.error(error.response?.data?.message || "Thêm phòng thất bại!");
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };

  const handleUpdateRoom = async (values, { setSubmitting }) => {
    const roomNumberExists = rooms.some(
      (room) =>
        room.roomNumber.toLowerCase() ===
          values.roomNumber.toLowerCase().trim() && room._id !== values._id
    );
    if (roomNumberExists) {
      toast.error(`Số phòng "${values.roomNumber}" đã tồn tại!`);
      setSubmitting(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateRoomById(values._id, preparePayload(values));
      toast.success("Cập nhật phòng thành công!");
      fetchAllData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật phòng:",
        error.response ? error.response.data : error
      );
      toast.error(error.response?.data?.message || "Cập nhật phòng thất bại!");
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingRoomId) return;
    try {
      await deleteRoomById(deletingRoomId);
      toast.success("Xóa phòng thành công!");
      fetchAllData();
    } catch (error) {
      console.error(
        "Lỗi khi xóa phòng:",
        error.response ? error.response.data : error
      );
      toast.error("Xóa phòng thất bại!");
    } finally {
      setIsDeleteConfirmOpen(false);
      setDeletingRoomId(null);
    }
  };

  const openEditModal = (room) => {
    const populatedRoom = {
      ...room,
      tenant: (room.tenant || [])
        .map((t) => allUsers.find((u) => u._id === (t._id || t)) || t)
        .filter((t) => t._id),
    };
    setEditingRoom(populatedRoom);
    setIsEditModalOpen(true);
  };

  const openViewModal = (room) => {
    setViewingRoom(room);
    setIsViewModalOpen(true);
  };
  const openDeleteConfirmModal = (id) => {
    setDeletingRoomId(id);
    setIsDeleteConfirmOpen(true);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "roomNumber", header: "Số phòng" },
      {
        accessorKey: "price",
        header: "Giá (VND)",
        Cell: ({ cell }) => cell.getValue().toLocaleString("vi-VN"),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            color={cell.getValue() === "available" ? "success" : "warning"}
            size="small"
          />
        ),
      },
      {
        accessorKey: "tenant",
        header: "Người thuê",
        Cell: ({ cell }) =>
          cell
            .getValue()
            ?.map((t) => t.fullname)
            .join(", ") || "Trống",
      },
    ],
    [allUsers]
  );

  const table = useMaterialReactTable({
    columns,
    data: rooms,
    state: { isLoading },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Xem chi tiết">
          <IconButton color="info" onClick={() => openViewModal(row.original)}>
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton
            color="primary"
            onClick={() => openEditModal(row.original)}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton
            color="error"
            onClick={() => openDeleteConfirmModal(row.original._id)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Thêm phòng mới
      </Button>
    ),
  });

  const createFormInitialValues = {
    roomNumber: "",
    floor: 0,
    area: 0,
    price: 0,
    maxOccupants: 1,
    status: "available",
    description: "",
    images: [],
    amenities: [],
    assets: [],
    tenant: [],
  };

  return (
    <>
      <MaterialReactTable table={table} />
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <RoomForm
          initialValues={
            isCreateModalOpen ? createFormInitialValues : editingRoom
          }
          onSubmit={isCreateModalOpen ? handleCreateRoom : handleUpdateRoom}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
          isSaving={isSaving}
          allUsers={allUsers}
        />
      </Dialog>
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết phòng</DialogTitle>
        <DialogContent>
          <RoomDetails room={viewingRoom} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle>Xác nhận xóa?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể
            hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomTable;
