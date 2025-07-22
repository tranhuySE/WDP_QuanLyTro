import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  Card,
  CardMedia,
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar,
  Paper,
  Stack,
  CardContent,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
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
  MeetingRoom,
  MoreVert,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getAllRooms } from "../../../api/roomAPI";
import { getAllUsers } from "../../../api/userAPI";

// ----- CHILD COMPONENTS (TabPanel, RoomDetails) -----
// These components remain unchanged as they are used for viewing details.

const statusMapping = {
  available: { text: "Còn trống", color: "success" },
  occupied: { text: "Đã thuê", color: "warning" },
  under_maintenance: { text: "Đang bảo trì", color: "info" },
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

// ----- MAIN COMPONENT (RoomTable) -----
// This is the primary component, now simplified for viewing only.

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoomForMenu, setSelectedRoomForMenu] = useState(null);

  const handleMenuOpen = (event, room) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra Card cha
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
      // Fetch both rooms and users to populate tenant details in the view modal
      const [roomsResponse, usersResponse] = await Promise.all([
        getAllRooms(),
        getAllUsers(),
      ]);

      const allUsers =
        usersResponse.data?.filter((u) => u.role === "user") || [];

      // Populate tenant details for each room
      const populatedRooms = roomsResponse.data.map((room) => ({
        ...room,
        tenant: (room.tenant || [])
          .map((tenantId) => allUsers.find((user) => user._id === tenantId))
          .filter(Boolean), // Filter out any tenants not found
      }));

      setRooms(populatedRooms);
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

  const roomsByFloor = useMemo(() => {
    const sortedRooms = [...rooms].sort((a, b) =>
      a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
    );
    return sortedRooms.reduce((acc, room) => {
      const floor = room.floor || "N/A";
      if (!acc[floor]) {
        acc[floor] = [];
      }
      acc[floor].push(room);
      return acc;
    }, {});
  }, [rooms]);

  const openViewModal = (room) => {
    setViewingRoom(room);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingRoom(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Sơ đồ phòng
        </Typography>

        {Object.keys(roomsByFloor).length === 0 && !isLoading && (
          <Box textAlign="center" mt={5}>
            <MeetingRoom sx={{ fontSize: 60, color: "text.secondary" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Chưa có phòng nào được tạo.
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
                  borderBottom: "2px solid",
                  borderColor: "primary.main",
                  pb: 1,
                }}
              >
                Tầng {floor}
              </Typography>
              <Grid container spacing={3}>
                {roomsByFloor[floor].map((room) => {
                  const statusInfo = statusMapping[room.status] || {
                    text: room.status,
                    color: "default",
                  };
                  const tenantNames =
                    room.tenant
                      ?.filter(Boolean)
                      .map((t) => t.fullname)
                      .join(", ") || "Trống";
                  const roomImage = room.images?.[0];

                  return (
                    <Grid item key={room._id}>
                      <Card
                        onClick={() => openViewModal(room)} // **ACTION: Click card to view details**
                        sx={{
                          position: "relative",
                          width: 280,
                          height: 360,
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "12px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition:
                            "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
                          cursor: "pointer", // **STYLE: Indicate card is clickable**
                          "&:hover": {
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                            transform: "translateY(-4px)",
                          },
                        }}
                      >
                        <IconButton
                          aria-label="settings"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1, // Ensure menu icon is above the image
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                            alt={`Hình ảnh phòng ${room.roomNumber}`}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 160,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f5f5f5",
                              color: "text.secondary",
                            }}
                          >
                            <ImageNotSupported sx={{ fontSize: 40 }} />
                          </Box>
                        )}

                        <CardContent
                          sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Typography variant="h6" fontWeight="700" noWrap>
                              P.{room.roomNumber}
                            </Typography>
                            <Chip
                              label={statusInfo.text}
                              color={statusInfo.color}
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                flexShrink: 0,
                                ml: 1,
                              }}
                            />
                          </Stack>
                          <Tooltip
                            title={`Giá thuê: ${room.price.toLocaleString(
                              "vi-VN"
                            )} VND/tháng`}
                            arrow
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <AttachMoneyOutlined sx={{ fontSize: "1rem" }} />
                              {room.price.toLocaleString("vi-VN")}
                            </Typography>
                          </Tooltip>
                          <Tooltip title={`Người thuê: ${tenantNames}`} arrow>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              sx={{
                                mt: 0.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <GroupOutlined sx={{ fontSize: "1rem" }} />
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

      {/* --- Menu for each room card --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            openViewModal(selectedRoomForMenu);
            handleMenuClose();
          }}
        >
          <Visibility sx={{ mr: 1.5, fontSize: "1.25rem" }} />
          Xem chi tiết
        </MenuItem>
      </Menu>

      {/* --- View Details Modal --- */}
      <Dialog
        open={isViewModalOpen}
        onClose={closeViewModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, pr: 4 }}>
          {/* This is intentionally empty to allow full control by RoomDetails, but provides space for the close button */}
          <IconButton
            aria-label="close"
            onClick={closeViewModal}
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
          <Button onClick={closeViewModal}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomTable;
