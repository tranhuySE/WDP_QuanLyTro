import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Grid,
  FormHelperText,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

// --- YUP VALIDATION SCHEMA HOÀN CHỈNH VÀ NGHIÊM NGẶT ---
const roomValidationSchema = Yup.object().shape({
  roomNumber: Yup.string().trim().required("Số phòng là bắt buộc"),

  floor: Yup.number()
    .positive("Tầng phải là số dương")
    .integer("Tầng phải là số nguyên")
    .required("Tầng là bắt buộc"),

  area: Yup.number()
    .positive("Diện tích phải là số dương")
    .required("Diện tích là bắt buộc"),

  price: Yup.number()
    .positive("Giá phòng phải lớn hơn 0")
    .required("Giá là bắt buộc"),

  maxOccupants: Yup.number()
    .positive("Số người tối đa phải là số dương")
    .integer("Số người phải là số nguyên")
    .required("Số người tối đa là bắt buộc"),

  status: Yup.string().required("Trạng thái là bắt buộc"),

  description: Yup.string().max(500, "Mô tả không được vượt quá 500 ký tự"),

  tenant: Yup.array()
    .of(Yup.string())
    .when("status", {
      is: "occupied",
      then: (schema) =>
        schema.min(
          1,
          'Phòng ở trạng thái "occupied" phải có ít nhất 1 người thuê.'
        ),
      otherwise: (schema) => schema.optional(),
    }),

  room_service: Yup.array().of(Yup.string()),

  images: Yup.array()
    .of(
      Yup.string()
        .url("Phải là một URL hợp lệ")
        .required("URL không được để trống")
    )
    .min(1, "Phải có ít nhất một hình ảnh cho phòng"),

  amenities: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Tên tiện nghi là bắt buộc"),
        quantity: Yup.number()
          .positive("Số lượng phải > 0")
          .integer()
          .required("Số lượng là bắt buộc"),
        status: Yup.string().required("Trạng thái là bắt buộc"),
      })
    )
    .min(1, "Phải cung cấp ít nhất một tiện nghi"),

  assets: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required("Loại tài sản là bắt buộc"),
      description: Yup.string(),
      quantity: Yup.number()
        .positive("Số lượng phải > 0")
        .integer()
        .required("Số lượng là bắt buộc"),
      licensePlate: Yup.string().when("type", {
        is: (type) => type === "motorbike" || type === "car",
        then: (schema) =>
          schema.trim().required("Biển số xe là bắt buộc cho xe máy và ô tô"),
        otherwise: (schema) => schema.optional(),
      }),
    })
  ),
});

const ManageRoomPage = () => {
  // ... (Toàn bộ state và functions không thay đổi)
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchUsers();
    fetchServices();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:9999/rooms");
      setRooms(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách phòng!");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng!");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:9999/services");
      setServices(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ!");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = { ...values };
      if (editingRoom) {
        await axios.put(
          `http://localhost:9999/rooms/${editingRoom._id}`,
          payload
        );
        toast.success("Cập nhật phòng thành công!");
      } else {
        await axios.post("http://localhost:9999/rooms", payload);
        toast.success("Thêm phòng mới thành công!");
      }
      fetchRooms();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save room:", err);
      toast.error(err.response?.data?.message || "Lưu phòng thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá phòng này không?")) {
      try {
        await axios.delete(`http://localhost:9999/rooms/${id}`);
        setRooms(rooms.filter((r) => r._id !== id));
        toast.success("Xoá phòng thành công!");
      } catch (err) {
        toast.error("Xoá phòng thất bại!");
      }
    }
  };

  const handleOpenModal = (room = null) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
  };

  const handleViewRoom = (room) => {
    setViewingRoom(room);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "roomNumber", header: "Số phòng", size: 120 },
      {
        accessorKey: "price",
        header: "Giá (VNĐ)",
        size: 120,
        Cell: ({ cell }) => cell.getValue().toLocaleString(),
      },
      { accessorKey: "status", header: "Trạng thái" },
      {
        accessorKey: "tenant",
        header: "Người thuê",
        Cell: ({ cell }) => cell.getValue()?.length || 0,
      },
      { accessorKey: "maxOccupants", header: "Tối đa", size: 100 },
    ],
    []
  );

  const getInitialValues = () => {
    const defaults = {
      roomNumber: "",
      floor: 1,
      area: 20,
      price: 1000000,
      maxOccupants: 1,
      status: "available",
      description: "",
      tenant: [],
      room_service: [],
      images: [],
      amenities: [],
      assets: [],
    };

    if (editingRoom) {
      return {
        ...defaults,
        ...editingRoom,
        tenant: editingRoom.tenant?.map((t) => t._id) || [],
        room_service: editingRoom.room_service?.map((s) => s._id) || [],
        amenities: editingRoom.amenities || [],
        assets: editingRoom.assets || [],
        images: editingRoom.images || [],
      };
    }
    return defaults;
  };
  // ...

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý phòng
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={rooms}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip title="Xem">
              <IconButton onClick={() => handleViewRoom(row.original)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sửa">
              <IconButton
                color="primary"
                onClick={() => handleOpenModal(row.original)}
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xoá">
              <IconButton
                color="error"
                onClick={() => handleDeleteRoom(row.original._id)}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Thêm phòng mới
          </Button>
        )}
      />

      {/* --- ADD/EDIT DIALOG --- */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingRoom ? "Sửa thông tin phòng" : "Thêm phòng mới"}
        </DialogTitle>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={roomValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, handleChange }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  {/* Basic Info */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      name="roomNumber"
                      label="Số phòng"
                      fullWidth
                      error={touched.roomNumber && !!errors.roomNumber}
                      helperText={<ErrorMessage name="roomNumber" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      name="floor"
                      label="Tầng"
                      type="number"
                      fullWidth
                      error={touched.floor && !!errors.floor}
                      helperText={<ErrorMessage name="floor" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      name="area"
                      label="Diện tích (m²)"
                      type="number"
                      fullWidth
                      error={touched.area && !!errors.area}
                      helperText={<ErrorMessage name="area" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      name="price"
                      label="Giá (VNĐ)"
                      type="number"
                      fullWidth
                      error={touched.price && !!errors.price}
                      helperText={<ErrorMessage name="price" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      name="maxOccupants"
                      label="Số người tối đa"
                      type="number"
                      fullWidth
                      error={touched.maxOccupants && !!errors.maxOccupants}
                      helperText={<ErrorMessage name="maxOccupants" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Field
                      as={TextField}
                      select
                      name="status"
                      label="Trạng thái"
                      fullWidth
                      error={touched.status && !!errors.status}
                      helperText={<ErrorMessage name="status" />}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="under_maintenance">
                        Under Maintenance
                      </MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="description"
                      label="Mô tả"
                      multiline
                      rows={2}
                      fullWidth
                      error={touched.description && !!errors.description}
                      helperText={<ErrorMessage name="description" />}
                    />
                  </Grid>

                  {/* --- LINKED DATA (TENANTS & SERVICES) --- */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={touched.tenant && !!errors.tenant}
                    >
                      {" "}
                      <InputLabel>Người thuê</InputLabel>{" "}
                      <Select
                        multiple
                        name="tenant"
                        value={values.tenant || []}
                        onChange={handleChange}
                        input={<OutlinedInput label="Người thuê" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((id) => (
                              <Chip
                                key={id}
                                label={
                                  users.find((u) => u._id === id)?.fullName ||
                                  id
                                }
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.fullName} ({user.email})
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <ErrorMessage name="tenant" />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Dịch vụ phòng</InputLabel>
                      <Select
                        multiple
                        name="room_service"
                        value={values.room_service || []}
                        onChange={handleChange}
                        input={<OutlinedInput label="Dịch vụ phòng" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((id) => (
                              <Chip
                                key={id}
                                label={
                                  services.find((s) => s._id === id)?.name || id
                                }
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {services.map((service) => (
                          <MenuItem key={service._id} value={service._id}>
                            {service.name} - {service.price.toLocaleString()}đ
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* --- IMAGES FIELD ARRAY --- */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Chip label="Hình ảnh" />
                    </Divider>
                    <ErrorMessage
                      name="images"
                      render={(msg) => (
                        <FormHelperText error>{msg}</FormHelperText>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray name="images">
                      {({ push, remove }) => (
                        <Box>
                          {values.images?.map((_, index) => (
                            <Box
                              key={index}
                              sx={{ display: "flex", gap: 1, mb: 1 }}
                            >
                              <Field
                                as={TextField}
                                name={`images[${index}]`}
                                label={`URL Hình ảnh ${index + 1}`}
                                fullWidth
                                size="small"
                                error={
                                  touched.images?.[index] &&
                                  !!errors.images?.[index]
                                }
                                helperText={
                                  <ErrorMessage name={`images[${index}]`} />
                                }
                              />
                              <IconButton
                                color="error"
                                onClick={() => remove(index)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => push("")}
                          >
                            Thêm URL hình ảnh
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Grid>

                  {/* --- AMENITIES FIELD ARRAY --- */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Chip label="Tiện nghi" />
                    </Divider>
                    <ErrorMessage
                      name="amenities"
                      render={(msg) => (
                        <FormHelperText error>{msg}</FormHelperText>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray name="amenities">
                      {({ push, remove }) => (
                        <Box>
                          {values.amenities?.map((_, index) => (
                            <Grid
                              container
                              spacing={1}
                              key={index}
                              sx={{ mb: 1 }}
                            >
                              <Grid item xs={12} sm={5}>
                                <Field
                                  as={TextField}
                                  size="small"
                                  fullWidth
                                  name={`amenities[${index}].name`}
                                  label="Tên tiện nghi"
                                  error={
                                    touched.amenities?.[index]?.name &&
                                    !!errors.amenities?.[index]?.name
                                  }
                                  helperText={
                                    <ErrorMessage
                                      name={`amenities[${index}].name`}
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Field
                                  as={TextField}
                                  size="small"
                                  fullWidth
                                  name={`amenities[${index}].quantity`}
                                  type="number"
                                  label="Số lượng"
                                  error={
                                    touched.amenities?.[index]?.quantity &&
                                    !!errors.amenities?.[index]?.quantity
                                  }
                                  helperText={
                                    <ErrorMessage
                                      name={`amenities[${index}].quantity`}
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Field
                                  as={TextField}
                                  select
                                  size="small"
                                  fullWidth
                                  name={`amenities[${index}].status`}
                                  label="Trạng thái"
                                >
                                  <MenuItem value="available">
                                    Available
                                  </MenuItem>
                                  <MenuItem value="unavailable">
                                    Unavailable
                                  </MenuItem>
                                </Field>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={1}
                                sx={{ textAlign: "center" }}
                              >
                                <IconButton
                                  color="error"
                                  onClick={() => remove(index)}
                                >
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              push({
                                name: "",
                                quantity: 1,
                                status: "available",
                              })
                            }
                          >
                            Thêm tiện nghi
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Grid>

                  {/* --- ASSETS FIELD ARRAY --- */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Chip label="Tài sản" />
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray name="assets">
                      {({ push, remove }) => (
                        <Box>
                          {values.assets?.map((_, index) => (
                            <Grid
                              container
                              spacing={1}
                              key={index}
                              sx={{ mb: 1 }}
                            >
                              <Grid item xs={6} sm={3}>
                                <Field
                                  as={TextField}
                                  select
                                  size="small"
                                  fullWidth
                                  name={`assets[${index}].type`}
                                  label="Loại tài sản"
                                >
                                  <MenuItem value="motorbike">
                                    Motorbike
                                  </MenuItem>
                                  <MenuItem value="car">Car</MenuItem>
                                  <MenuItem value="bicycle">Bicycle</MenuItem>
                                  <MenuItem value="other">Other</MenuItem>
                                </Field>
                              </Grid>
                              <Grid item xs={6} sm={2}>
                                <Field
                                  as={TextField}
                                  size="small"
                                  fullWidth
                                  name={`assets[${index}].quantity`}
                                  type="number"
                                  label="Số lượng"
                                  error={
                                    touched.assets?.[index]?.quantity &&
                                    !!errors.assets?.[index]?.quantity
                                  }
                                  helperText={
                                    <ErrorMessage
                                      name={`assets[${index}].quantity`}
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Field
                                  as={TextField}
                                  size="small"
                                  fullWidth
                                  name={`assets[${index}].licensePlate`}
                                  label="Biển số xe"
                                  error={
                                    touched.assets?.[index]?.licensePlate &&
                                    !!errors.assets?.[index]?.licensePlate
                                  }
                                  helperText={
                                    <ErrorMessage
                                      name={`assets[${index}].licensePlate`}
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Field
                                  as={TextField}
                                  size="small"
                                  fullWidth
                                  name={`assets[${index}].description`}
                                  label="Mô tả"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={1}
                                sx={{ textAlign: "center" }}
                              >
                                <IconButton
                                  color="error"
                                  onClick={() => remove(index)}
                                >
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              push({
                                type: "motorbike",
                                quantity: 1,
                                licensePlate: "",
                                description: "",
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
              <DialogActions>
                <Button onClick={handleCloseModal}>Huỷ</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Lưu
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* View Dialog... (không thay đổi) */}
    </Container>
  );
};

export default ManageRoomPage;
