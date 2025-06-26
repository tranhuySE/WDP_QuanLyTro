import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // BƯỚC 1: THÊM IMPORT AXIOS
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
  Autocomplete,
  CircularProgress,
  Card,
  CardMedia,
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
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
  InfoOutlined,
  GroupOutlined,
  PhotoLibraryOutlined,
  ConstructionOutlined,
  ApartmentOutlined,
  SquareFootOutlined,
  AttachMoneyOutlined,
  ImageNotSupported,
  NoMeetingRoom,
  HomeWork,
  CameraAlt,
  PlaylistAddCheck,
  ExpandMore,
  Category,
  Wallet,
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

// Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt và màu sắc tương ứng
const statusMapping = {
  available: { text: "Còn trống", color: "success" },
  occupied: { text: "Đã thuê", color: "warning" },
  under_maintenance: { text: "Đang bảo trì", color: "info" },
};

// Helper component để quản lý nội dung của các tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`room-details-tabpanel-${index}`}
      aria-labelledby={`room-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Component hiển thị chi tiết phòng
const RoomDetails = ({ room }) => {
  const [tabIndex, setTabIndex] = useState(0);
  if (!room) return null;
  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const EmptyState = ({ icon, text }) => (
    <Box textAlign="center" p={4} color="text.secondary">
      {icon} <Typography>{text}</Typography>
    </Box>
  );
  const currentStatus = statusMapping[room.status] || {
    text: room.status,
    color: "default",
  };
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Phòng {room.roomNumber}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              label={currentStatus.text}
              color={currentStatus.color}
              size="medium"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} color="text.secondary" mt={1}>
          <Grid item xs={12} sm={4} container alignItems="center" gap={1}>
            <AttachMoneyOutlined fontSize="small" />{" "}
            <Typography variant="body1">
              {room.price?.toLocaleString("vi-VN")} VND
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} container alignItems="center" gap={1}>
            <SquareFootOutlined fontSize="small" />{" "}
            <Typography variant="body1">{room.area} m²</Typography>
          </Grid>
          <Grid item xs={12} sm={4} container alignItems="center" gap={1}>
            <ApartmentOutlined fontSize="small" />{" "}
            <Typography variant="body1">Tầng {room.floor}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="room details tabs"
          variant="fullWidth"
        >
          <Tab icon={<InfoOutlined />} iconPosition="start" label="Thông tin" />
          <Tab
            icon={<GroupOutlined />}
            iconPosition="start"
            label="Người thuê"
          />
          <Tab
            icon={<PhotoLibraryOutlined />}
            iconPosition="start"
            label="Hình ảnh"
          />
          <Tab
            icon={<ConstructionOutlined />}
            iconPosition="start"
            label="Tiện ích & Tài sản"
          />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <Typography variant="h6" gutterBottom>
          Mô tả chi tiết
        </Typography>
        <Typography paragraph>
          {room.description || "Không có mô tả."}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Số người ở tối đa: {room.maxOccupants}
        </Typography>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {room.tenant?.filter(Boolean).length > 0 ? (
          <List>
            {room.tenant.filter(Boolean).map((t) => (
              <ListItem key={t._id}>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t.fullname} secondary={t.email} />
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState
            icon={<NoMeetingRoom sx={{ fontSize: 40, mb: 1 }} />}
            text="Phòng này hiện chưa có người thuê."
          />
        )}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        {room.images?.length > 0 ? (
          <Grid container spacing={2}>
            {room.images.map((img, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card>
                  <CardMedia
                    component="img"
                    height="160"
                    image={img}
                    alt={`Hình ảnh phòng ${i + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            icon={<ImageNotSupported sx={{ fontSize: 40, mb: 1 }} />}
            text="Chưa có hình ảnh nào."
          />
        )}
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <Typography variant="h6" gutterBottom>
          Tiện ích trong phòng
        </Typography>
        {room.amenities?.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
            {room.amenities.map((a, i) => (
              <Chip
                key={i}
                label={`${a.name} (SL: ${a.quantity})`}
                variant="outlined"
              />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Không có tiện ích.
          </Typography>
        )}
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
          <Typography color="text.secondary">Không có tài sản.</Typography>
        )}
      </TabPanel>
    </Box>
  );
};

const FormikTextField = ({ name, label, ...props }) => (
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

const RoomForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSaving,
  allUsers = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // BƯỚC 2: THAY THẾ HOÀN TOÀN HÀM NÀY
  const handleImageUpload = async (files, push) => {
    setIsUploading(true);
    try {
      // Tạo một mảng các promise cho mỗi lần tải ảnh
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        // "image" phải khớp với tên trong upload.single("image") ở backend
        formData.append("image", file);

        // Gọi API backend của bạn
        const response = await axios.post(
          "http://localhost:9999/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Trả về URL của ảnh từ response
        return response.data.imageUrl;
      });

      // Chờ tất cả các ảnh được tải lên
      const imageUrls = await Promise.all(uploadPromises);

      // Đẩy tất cả các URL mới vào Formik state
      imageUrls.forEach((url) => push(url));

      toast.success(`Đã tải lên ${imageUrls.length} ảnh thành công!`);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      const errorMessage =
        error.response?.data?.message || "Tải ảnh lên thất bại!";
      toast.error(errorMessage);
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
      {({ values, setFieldValue }) => (
        <Form>
          <DialogTitle>
            {initialValues._id
              ? `Chỉnh sửa phòng ${initialValues.roomNumber || ""}`
              : "Thêm phòng mới"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <HomeWork color="primary" />
                    <Typography variant="h6">Thông tin cơ bản</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormikTextField name="roomNumber" label="Số phòng" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormikTextField
                        name="floor"
                        label="Tầng"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormikTextField
                        name="area"
                        label="Diện tích (m²)"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormikTextField
                        name="price"
                        label="Giá (VND)"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormikTextField
                        name="maxOccupants"
                        label="Số người tối đa"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormikTextField
                        name="description"
                        label="Mô tả"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <PlaylistAddCheck color="primary" />
                    <Typography variant="h6">
                      Trạng thái & Người thuê
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field name="status">
                        {({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Trạng thái"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value !== "occupied") {
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
                    {values.status === "occupied" && (
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={allUsers}
                          getOptionLabel={(option) =>
                            `${option.fullname} (${option.email})`
                          }
                          value={values.tenant}
                          isOptionEqualToValue={(option, value) =>
                            option?._id === value?._id
                          }
                          onChange={(_, newValue) =>
                            setFieldValue("tenant", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Chọn người thuê"
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <CameraAlt color="primary" />
                    <Typography variant="h6">Hình ảnh</Typography>
                  </Stack>
                  <FieldArray name="images">
                    {({ push, remove }) => (
                      <>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          {values.images?.map((img, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                              <Card sx={{ position: "relative" }}>
                                <CardMedia
                                  component="img"
                                  height="120"
                                  image={img}
                                  alt={`Image ${index + 1}`}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => remove(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(255,255,255,0.7)",
                                  }}
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                        <Button
                          variant="contained"
                          component="label"
                          disabled={isUploading}
                          startIcon={
                            isUploading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Add />
                            )
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
                      </>
                    )}
                  </FieldArray>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Category color="primary" />
                      <Typography>Quản lý Tiện ích</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FieldArray name="amenities">
                      {({ push, remove }) => (
                        <>
                          {values.amenities?.map((_, index) => (
                            <Box
                              key={index}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                p: 1.5,
                                mb: 1.5,
                                borderRadius: 1,
                                position: "relative",
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <FormikTextField
                                    name={`amenities[${index}].name`}
                                    label="Tên tiện ích"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                  <FormikTextField
                                    name={`amenities[${index}].quantity`}
                                    label="Số lượng"
                                    type="number"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                  <FormikTextField
                                    name={`amenities[${index}].status`}
                                    label="Trạng thái"
                                    size="small"
                                    select
                                  >
                                    <MenuItem value="available">Tốt</MenuItem>
                                    <MenuItem value="unavailable">
                                      Hỏng
                                    </MenuItem>
                                  </FormikTextField>
                                </Grid>
                              </Grid>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => remove(index)}
                                sx={{ position: "absolute", top: 4, right: 4 }}
                              >
                                <RemoveCircleOutline />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddCircleOutline />}
                            onClick={() =>
                              push({
                                name: "",
                                quantity: 1,
                                status: "available",
                              })
                            }
                          >
                            Thêm tiện ích
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Wallet color="primary" />
                      <Typography>Quản lý Tài sản của người thuê</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FieldArray name="assets">
                      {({ push, remove }) => (
                        <>
                          {values.assets?.map((_, index) => (
                            <Box
                              key={index}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                p: 1.5,
                                mb: 1.5,
                                borderRadius: 1,
                                position: "relative",
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                  <FormikTextField
                                    name={`assets[${index}].type`}
                                    label="Loại tài sản"
                                    size="small"
                                    select
                                  >
                                    <MenuItem value="motorbike">
                                      Xe máy
                                    </MenuItem>
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
                                <Grid item xs={12} sm={6}>
                                  <FormikTextField
                                    name={`assets[${index}].description`}
                                    label="Mô tả"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => remove(index)}
                                sx={{ position: "absolute", top: 4, right: 4 }}
                              >
                                <RemoveCircleOutline />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddCircleOutline />}
                            onClick={() =>
                              push({
                                type: "motorbike",
                                licensePlate: "",
                                description: "",
                              })
                            }
                          >
                            Thêm tài sản
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  </AccordionDetails>
                </Accordion>
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
        .filter(Boolean)
        .map((tenantInRoom) =>
          allUsers.find(
            (user) => user._id === (tenantInRoom._id || tenantInRoom)
          )
        )
        .filter(Boolean),
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
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const statusInfo = statusMapping[status] || {
            text: status,
            color: "default",
          };
          return (
            <Chip
              label={statusInfo.text}
              color={statusInfo.color}
              size="small"
            />
          );
        },
      },
      {
        accessorKey: "tenant",
        header: "Người thuê",
        Cell: ({ cell }) =>
          cell
            .getValue()
            ?.filter(Boolean)
            .map((t) => t.fullname)
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
    floor: 1,
    area: 20,
    price: 1000000,
    maxOccupants: 1,
    status: "available",
    description: "",
    images: [],
    amenities: [],
    assets: [],
    tenant: [],
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRoom(null);
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <>
      <MaterialReactTable table={table} />

      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onClose={isCreateModalOpen ? closeCreateModal : closeEditModal}
        maxWidth="lg"
        fullWidth
      >
        {(isCreateModalOpen || editingRoom) && (
          <RoomForm
            initialValues={
              isCreateModalOpen ? createFormInitialValues : editingRoom
            }
            onSubmit={isCreateModalOpen ? handleCreateRoom : handleUpdateRoom}
            onCancel={isCreateModalOpen ? closeCreateModal : closeEditModal}
            isSaving={isSaving}
            allUsers={allUsers}
          />
        )}
      </Dialog>

      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, pr: 4 }}>
          <IconButton
            aria-label="close"
            onClick={() => setIsViewModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
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
