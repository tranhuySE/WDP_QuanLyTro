import React from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { roomValidationSchema } from "../../validation/roomSchema";

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

const RoomForm = ({ initialValues, onSubmit, onCancel, isSaving }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={roomValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched }) => (
        <Form>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {initialValues._id
                ? "Chỉnh sửa thông tin phòng"
                : "Thêm phòng mới"}
            </Typography>
            <Grid container spacing={2}>
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
                <FormikTextField name="status" label="Trạng thái" select>
                  <MenuItem value="available">Còn trống</MenuItem>
                  <MenuItem value="occupied">Đã thuê</MenuItem>
                  <MenuItem value="under_maintenance">Đang bảo trì</MenuItem>
                </FormikTextField>
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Quản lý Tiện ích */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Tiện ích
                </Typography>
                <FieldArray name="amenities">
                  {({ push, remove }) => (
                    <div>
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
                    </div>
                  )}
                </FieldArray>
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
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RoomForm;
