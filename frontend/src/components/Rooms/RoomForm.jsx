import React, { useState } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Paper,
  Stack,
  Autocomplete,
  Card,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  HomeWork,
  PlaylistAddCheck,
  Category,
  Wallet,
  CameraAlt,
  Add,
  Close,
} from "@mui/icons-material";
import { roomValidationSchema } from "../../validation/roomSchema";
import axios from "axios";
import { toast } from "react-toastify";

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

const RoomForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSaving,
  allUsers = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (files, push) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          "http://localhost:9999/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        return response.data.imageUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
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
      onSubmit={onSubmit} // onSubmit vẫn được giữ nguyên để xử lý khi form hợp lệ
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        setFieldTouched,
        validateForm,
        handleSubmit,
      }) => {
        // TẠO HÀM XỬ LÝ SUBMIT TÙY CHỈNH
        const handleSaveClick = async () => {
          // Bước 1: Chạy validation trên toàn bộ form
          const formErrors = await validateForm();

          // Bước 2: Nếu có lỗi, đánh dấu tất cả các trường có lỗi là "touched"
          if (Object.keys(formErrors).length > 0) {
            setFieldTouched("tenant", true); // Đảm bảo trường tenant được touch
            // Bạn cũng có thể lặp qua tất cả lỗi để touch
            Object.keys(formErrors).forEach((key) => {
              setFieldTouched(key, true, true); // Chạm vào tất cả các trường có lỗi
            });
          }

          // Bước 3: Gọi hàm handleSubmit gốc của Formik.
          // Hàm này sẽ tự kiểm tra lại lỗi, nếu không có lỗi nó sẽ gọi `onSubmit` của bạn.
          handleSubmit();
        };

        return (
          <Form>
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                {initialValues._id
                  ? "Chỉnh sửa thông tin phòng"
                  : "Thêm phòng mới"}
              </Typography>
              <Grid container spacing={3}>
                {/* HÀNG 1: THÔNG TIN CƠ BẢN */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
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

                {/* HÀNG 2: TRẠNG THÁI & NGƯỜI THUÊ */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <PlaylistAddCheck color="primary" />
                      <Typography variant="h6">
                        Trạng thái & Người thuê
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormikTextField
                          name="status"
                          label="Trạng thái"
                          select
                        >
                          <MenuItem value="available">Còn trống</MenuItem>
                          <MenuItem value="occupied">Đã thuê</MenuItem>
                          <MenuItem value="under_maintenance">
                            Đang bảo trì
                          </MenuItem>
                        </FormikTextField>
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
                            onBlur={() => setFieldTouched("tenant", true)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Chọn người thuê"
                                error={touched.tenant && Boolean(errors.tenant)}
                                helperText={touched.tenant && errors.tenant}
                              />
                            )}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* HÀNG 3: QUẢN LÝ TIỆN ÍCH */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <Category color="primary" />
                      <Typography variant="h6">Quản lý Tiện ích</Typography>
                    </Stack>
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
                                <Grid item xs={12}>
                                  <FormikTextField
                                    name={`amenities[${index}].name`}
                                    label="Tên tiện ích"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <FormikTextField
                                    name={`amenities[${index}].quantity`}
                                    label="Số lượng"
                                    type="number"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={12}>
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
                  </Paper>
                </Grid>

                {/* HÀNG 4: QUẢN LÝ TÀI SẢN */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <Wallet color="primary" />
                      <Typography variant="h6">
                        Quản lý Tài sản của người thuê
                      </Typography>
                    </Stack>
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
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                  <FormikTextField
                                    name={`assets[${index}].licensePlate`}
                                    label="Biển số"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={12}>
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
                  </Paper>
                </Grid>

                {/* HÀNG 5: HÌNH ẢNH */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
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
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
                gap: 1,
                borderTop: "1px solid #eee",
              }}
            >
              <Button onClick={onCancel} color="secondary">
                Hủy
              </Button>
              {/* THAY ĐỔI Ở NÚT LƯU */}
              <Button
                onClick={handleSaveClick}
                variant="contained"
                disabled={isSaving || isUploading}
              >
                {isSaving ? "Đang lưu..." : "Lưu"}
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RoomForm;
