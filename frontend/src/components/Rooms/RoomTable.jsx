import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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
    CardContent,
    Menu,
    FormControl,
    InputLabel,
    Select,
    Slider,
} from '@mui/material';
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
    MeetingRoom,
    MoreVert,
    FilterList,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FieldArray } from 'formik';
import { roomValidationSchema } from '../../validation/roomSchema';
import { getAllRooms, createRoom, updateRoomById, deleteRoomById } from '../../api/roomAPI';
import { getAllUsers } from '../../api/userAPI';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

// ----- CÁC COMPONENT CON (TabPanel, RoomDetails, RoomForm) GIỮ NGUYÊN -----
const statusMapping = {
    available: { text: 'Còn trống', color: 'success' },
    occupied: { text: 'Đã thuê', color: 'warning' },
    under_maintenance: { text: 'Đang bảo trì', color: 'info' },
};

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
        color: 'default',
    };
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
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
                        <AttachMoneyOutlined fontSize="small" />{' '}
                        <Typography variant="body1">
                            {room.price?.toLocaleString('vi-VN')} VND
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} container alignItems="center" gap={1}>
                        <SquareFootOutlined fontSize="small" />{' '}
                        <Typography variant="body1">{room.area} m²</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} container alignItems="center" gap={1}>
                        <ApartmentOutlined fontSize="small" />{' '}
                        <Typography variant="body1">Tầng {room.floor}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="room details tabs"
                    variant="fullWidth"
                >
                    <Tab icon={<InfoOutlined />} iconPosition="start" label="Thông tin" />
                    <Tab icon={<GroupOutlined />} iconPosition="start" label="Người thuê" />
                    <Tab icon={<PhotoLibraryOutlined />} iconPosition="start" label="Hình ảnh" />
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
                <Typography paragraph>{room.description || 'Không có mô tả.'}</Typography>
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
                                    <Zoom>
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={img}
                                            alt={`Hình ảnh phòng ${i + 1}`}
                                            style={{
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                borderRadius: 4,
                                            }}
                                        />
                                    </Zoom>
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
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
                                    primary={`${a.type}: ${a.licensePlate || 'Không có BKS'}`}
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

const RoomForm = ({ initialValues, onSubmit, onCancel, isSaving, allUsers = [] }) => {
    const [isUploading, setIsUploading] = useState(false);
    const handleImageUpload = async (files, push) => {
        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const response = await axios.post('http://localhost:9999/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return response.data.imageUrl;
            });
            const imageUrls = await Promise.all(uploadPromises);
            imageUrls.forEach((url) => push(url));
            toast.success(`Đã tải lên ${imageUrls.length} ảnh thành công!`);
        } catch (error) {
            console.error('Lỗi khi tải ảnh:', error);
            const errorMessage = error.response?.data?.message || 'Tải ảnh lên thất bại!';
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
                            ? `Chỉnh sửa phòng ${initialValues.roomNumber || ''}`
                            : 'Thêm phòng mới'}
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
                                <Paper sx={{ p: 2, height: '100%' }}>
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
                                                            if (e.target.value !== 'occupied') {
                                                                setFieldValue('tenant', []);
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value="available">
                                                            Còn trống
                                                        </MenuItem>
                                                        <MenuItem value="occupied">
                                                            Đã thuê
                                                        </MenuItem>
                                                        <MenuItem value="under_maintenance">
                                                            Đang bảo trì
                                                        </MenuItem>
                                                    </TextField>
                                                )}
                                            </Field>
                                        </Grid>
                                        {values.status === 'occupied' && (
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
                                                        setFieldValue('tenant', newValue)
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
                                                            <Card sx={{ position: 'relative' }}>
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
                                                                        position: 'absolute',
                                                                        top: 4,
                                                                        right: 4,
                                                                        bgcolor:
                                                                            'rgba(255,255,255,0.7)',
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
                                                            handleImageUpload(
                                                                e.currentTarget.files,
                                                                push,
                                                            )
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
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                p: 1.5,
                                                                mb: 1.5,
                                                                borderRadius: 1,
                                                                position: 'relative',
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
                                                                        <MenuItem value="available">
                                                                            Tốt
                                                                        </MenuItem>
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
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4,
                                                                }}
                                                            >
                                                                <RemoveCircleOutline />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button
                                                        startIcon={<AddCircleOutline />}
                                                        onClick={() =>
                                                            push({
                                                                name: '',
                                                                quantity: 1,
                                                                status: 'available',
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
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                p: 1.5,
                                                                mb: 1.5,
                                                                borderRadius: 1,
                                                                position: 'relative',
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
                                                                        <MenuItem value="car">
                                                                            Ô tô
                                                                        </MenuItem>
                                                                        <MenuItem value="bicycle">
                                                                            Xe đạp
                                                                        </MenuItem>
                                                                        <MenuItem value="other">
                                                                            Khác
                                                                        </MenuItem>
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
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4,
                                                                }}
                                                            >
                                                                <RemoveCircleOutline />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button
                                                        startIcon={<AddCircleOutline />}
                                                        onClick={() =>
                                                            push({
                                                                type: 'motorbike',
                                                                licensePlate: '',
                                                                description: '',
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
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={onCancel} color="secondary">
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSaving || isUploading}
                        >
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
};

// ----- MAIN COMPONENT WITH CRUD & FILTERING -----
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
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRoomForMenu, setSelectedRoomForMenu] = useState(null);

    const [statusFilter, setStatusFilter] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [maxPrice, setMaxPrice] = useState(0);

    const handleMenuOpen = (event, room) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedRoomForMenu(room);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRoomForMenu(null);
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [roomsResponse, usersResponse] = await Promise.all([
                getAllRooms(),
                getAllUsers(),
            ]);

            const fetchedRooms = roomsResponse.data || [];
            setRooms(fetchedRooms);

            if (usersResponse.data && Array.isArray(usersResponse.data)) {
                setAllUsers(usersResponse.data.filter((u) => u.role === 'user'));
            }

            if (fetchedRooms.length > 0) {
                const prices = fetchedRooms
                    .map((r) => r.price)
                    .filter((p) => typeof p === 'number');
                const min = prices.length > 0 ? Math.min(...prices) : 0;
                const max = prices.length > 0 ? Math.max(...prices) : 10000000;
                setMaxPrice(max);
                setPriceRange([min, max]);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error.response ? error.response.data : error);
            toast.error('Không thể tải dữ liệu từ máy chủ!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const roomsByFloor = useMemo(() => {
        const filteredRooms = rooms.filter((room) => {
            const statusMatch = statusFilter === 'all' || room.status === statusFilter;
            const priceMatch = room.price >= priceRange[0] && room.price <= priceRange[1];
            return statusMatch && priceMatch;
        });

        const sortedRooms = [...filteredRooms].sort((a, b) =>
            a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }),
        );

        return sortedRooms.reduce((acc, room) => {
            const floor = room.floor || 'N/A';
            if (!acc[floor]) {
                acc[floor] = [];
            }
            acc[floor].push(room);
            return acc;
        }, {});
    }, [rooms, statusFilter, priceRange]);

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const preparePayload = (values) => {
        const payload = { ...values };
        if (payload.status !== 'occupied') {
            payload.tenant = [];
        } else if (payload.tenant?.length > 0) {
            payload.tenant = payload.tenant.map((t) => t._id || t);
        }
        return payload;
    };

    const handleCreateRoom = async (values, { setSubmitting }) => {
        const roomNumberExists = rooms.some(
            (room) => room.roomNumber.toLowerCase() === values.roomNumber.toLowerCase().trim(),
        );
        if (roomNumberExists) {
            toast.error(`Số phòng "${values.roomNumber}" đã tồn tại!`);
            setSubmitting(false);
            return;
        }
        setIsSaving(true);
        try {
            await createRoom(preparePayload(values));
            toast.success('Thêm phòng thành công!');
            fetchAllData();
            setIsCreateModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Thêm phòng thất bại!');
        } finally {
            setIsSaving(false);
            setSubmitting(false);
        }
    };

    const handleUpdateRoom = async (values, { setSubmitting }) => {
        const roomNumberExists = rooms.some(
            (room) =>
                room.roomNumber.toLowerCase() === values.roomNumber.toLowerCase().trim() &&
                room._id !== values._id,
        );
        if (roomNumberExists) {
            toast.error(`Số phòng "${values.roomNumber}" đã tồn tại!`);
            setSubmitting(false);
            return;
        }
        setIsSaving(true);
        try {
            await updateRoomById(values._id, preparePayload(values));
            toast.success('Cập nhật phòng thành công!');
            fetchAllData();
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật phòng thất bại!');
        } finally {
            setIsSaving(false);
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingRoomId) return;
        try {
            await deleteRoomById(deletingRoomId);
            toast.success('Xóa phòng thành công!');
            fetchAllData();
        } catch (error) {
            toast.error('Xóa phòng thất bại!');
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
                    allUsers.find((user) => user._id === (tenantInRoom._id || tenantInRoom)),
                )
                .filter(Boolean),
        };
        setEditingRoom(populatedRoom);
        setIsEditModalOpen(true);
    };

    const openViewModal = (room) => {
        const populatedRoom = {
            ...room,
            tenant: (room.tenant || [])
                .filter(Boolean)
                .map((tenantInRoom) =>
                    allUsers.find((user) => user._id === (tenantInRoom._id || tenantInRoom)),
                )
                .filter(Boolean),
        };
        setViewingRoom(populatedRoom);
        setIsViewModalOpen(true);
    };

    const openDeleteConfirmModal = (id) => {
        setDeletingRoomId(id);
        setIsDeleteConfirmOpen(true);
    };

    const createFormInitialValues = {
        roomNumber: '',
        floor: 1,
        area: 20,
        price: 1000000,
        maxOccupants: 1,
        status: 'available',
        description: '',
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
    const closeViewModal = () => setIsViewModalOpen(false);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const isOriginalRoomListEmpty = rooms.length === 0;
    const isFilterResultEmpty = !isOriginalRoomListEmpty && Object.keys(roomsByFloor).length === 0;

    return (
        <>
            <Box sx={{ p: 3 }}>
                {/* ----- UPDATED: Header layout ----- */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Sơ đồ phòng
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Thêm phòng
                    </Button>
                </Box>

                {/* ----- UPDATED: Filter section moved below the header ----- */}
                {!isOriginalRoomListEmpty && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle1" fontWeight={500}>
                                    Bộ lọc:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Trạng thái"
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        {Object.entries(statusMapping).map(([key, value]) => (
                                            <MenuItem key={key} value={key}>
                                                {value.text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    min={0}
                                    max={maxPrice}
                                    step={100000}
                                    size="small"
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) =>
                                        `${value.toLocaleString('vi-VN')} VND`
                                    }
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {priceRange[0].toLocaleString('vi-VN')} VND
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {priceRange[1].toLocaleString('vi-VN')} VND
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {isOriginalRoomListEmpty && !isLoading && (
                    <Box textAlign="center" mt={5}>
                        <MeetingRoom sx={{ fontSize: 60, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            Chưa có phòng nào được tạo.
                        </Typography>
                    </Box>
                )}

                {isFilterResultEmpty && (
                    <Box textAlign="center" mt={5}>
                        <FilterList sx={{ fontSize: 60, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            Không tìm thấy phòng nào phù hợp với bộ lọc.
                        </Typography>
                    </Box>
                )}

                {Object.keys(roomsByFloor)
                    .sort((a, b) => a - b)
                    .map((floor) => (
                        <Box key={floor} sx={{ mb: 5 }}>
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{
                                    mb: 3,
                                    borderBottom: '2px solid',
                                    borderColor: 'primary.main',
                                    pb: 1,
                                }}
                            >
                                Tầng {floor}
                            </Typography>
                            <Grid container spacing={3}>
                                {roomsByFloor[floor].map((room) => {
                                    const statusInfo = statusMapping[room.status] || {
                                        text: room.status,
                                        color: 'default',
                                    };
                                    const tenantNames =
                                        room.tenant
                                            ?.filter(Boolean)
                                            .map((t) => t.fullname)
                                            .join(', ') || 'Trống';
                                    const roomImage = room.images?.[0];

                                    return (
                                        <Grid item key={room._id}>
                                            <Card
                                                onClick={() => openViewModal(room)}
                                                sx={{
                                                    position: 'relative',
                                                    width: 280,
                                                    height: 360,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    cursor: 'pointer',
                                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                                    '&:hover': {
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                                        transform: 'translateY(-4px)',
                                                    },
                                                }}
                                            >
                                                <IconButton
                                                    aria-label="settings"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 2,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.9)',
                                                        },
                                                    }}
                                                    onClick={(event) => handleMenuOpen(event, room)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                                {roomImage ? (
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ height: 160 }}
                                                        image={roomImage}
                                                        alt={`Phòng ${room.roomNumber}`}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 160,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#f5f5f5',
                                                            color: 'text.secondary',
                                                        }}
                                                    >
                                                        <ImageNotSupported sx={{ fontSize: 40 }} />
                                                    </Box>
                                                )}
                                                <CardContent
                                                    sx={{ flexGrow: 1, p: 2, overflow: 'hidden' }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            fontWeight="700"
                                                            noWrap
                                                        >
                                                            P.{room.roomNumber}
                                                        </Typography>
                                                        <Chip
                                                            label={statusInfo.text}
                                                            color={statusInfo.color}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                flexShrink: 0,
                                                                ml: 1,
                                                            }}
                                                        />
                                                    </Stack>
                                                    <Tooltip
                                                        title={`Giá: ${room.price.toLocaleString(
                                                            'vi-VN',
                                                        )} VND/tháng`}
                                                        arrow
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            <AttachMoneyOutlined
                                                                sx={{ fontSize: '1rem' }}
                                                            />
                                                            {room.price.toLocaleString('vi-VN')}
                                                        </Typography>
                                                    </Tooltip>
                                                    <Tooltip
                                                        title={`Người thuê: ${tenantNames}`}
                                                        arrow
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            noWrap
                                                            sx={{
                                                                mt: 0.5,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            <GroupOutlined
                                                                sx={{ fontSize: '1rem' }}
                                                            />
                                                            {tenantNames}
                                                        </Typography>
                                                    </Tooltip>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    ))}
            </Box>

            {/* --- Menus & Modals (Unchanged) --- */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={() => {
                        openViewModal(selectedRoomForMenu);
                        handleMenuClose();
                    }}
                >
                    <Visibility sx={{ mr: 1.5 }} /> Xem chi tiết
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        openEditModal(selectedRoomForMenu);
                        handleMenuClose();
                    }}
                >
                    <Edit sx={{ mr: 1.5 }} /> Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        openDeleteConfirmModal(selectedRoomForMenu._id);
                        handleMenuClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1.5 }} /> Xóa phòng
                </MenuItem>
            </Menu>

            <Dialog
                open={isCreateModalOpen || isEditModalOpen}
                onClose={isCreateModalOpen ? closeCreateModal : closeEditModal}
                maxWidth="lg"
                fullWidth
            >
                {(isCreateModalOpen || editingRoom) && (
                    <RoomForm
                        initialValues={isCreateModalOpen ? createFormInitialValues : editingRoom}
                        onSubmit={isCreateModalOpen ? handleCreateRoom : handleUpdateRoom}
                        onCancel={isCreateModalOpen ? closeCreateModal : closeEditModal}
                        isSaving={isSaving}
                        allUsers={allUsers}
                    />
                )}
            </Dialog>

            <Dialog open={isViewModalOpen} onClose={closeViewModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, pr: 4 }}>
                    <IconButton
                        aria-label="close"
                        onClick={closeViewModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (t) => t.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <RoomDetails room={viewingRoom} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeViewModal}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
                <DialogTitle>Xác nhận xóa?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác.
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
