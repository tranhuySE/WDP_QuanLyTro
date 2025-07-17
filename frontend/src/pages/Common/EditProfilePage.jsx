/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaUserFriends
} from "react-icons/fa";
import UserAPI from "../../api/userAPI";

const defaultEmergency = { name: "", relationship: "", phoneNumber: "" };

const getUserFromLocal = () => {
  try {
    return JSON.parse(localStorage.getItem("userData")) || {};
  } catch {
    return {};
  }
};

const EditProfilePage = () => {
  const [form, setForm] = useState(() => {
    const userData = getUserFromLocal();
    return {
      ...userData,
      contactEmergency: userData.contactEmergency || defaultEmergency,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    () => getUserFromLocal()?.avatar || ""
  );

  useEffect(() => {
    const userData = getUserFromLocal();
    setForm({
      ...userData,
      contactEmergency: userData.contactEmergency || defaultEmergency,
    });
    setAvatarPreview(userData?.avatar || "");
    // eslint-disable-next-line
  }, []);

  if (!form || Object.keys(form).length === 0) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải thông tin người dùng...</p>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contactEmergency.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contactEmergency: { ...prev.contactEmergency, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setForm((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let dataToSave = { ...form };
      if (form.avatar instanceof File) {
        // Convert file to base64
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        dataToSave.avatar = await toBase64(form.avatar);
      }
      const res = await UserAPI.editUserById(form._id, dataToSave);
      if (res.status === 200) {
        localStorage.setItem("userData", JSON.stringify(res.data));
        setSuccess("Cập nhật thông tin thành công!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload from localStorage
    const userData = getUserFromLocal();
    setForm({
      ...userData,
      contactEmergency: userData.contactEmergency || defaultEmergency,
    });
    setAvatarPreview(userData?.avatar || "");
    setError("");
    setSuccess("");
  };

  return (
    <Container className="py-4" style={{ maxWidth: 1200 }}>
      <h2 className="mb-1 fw-bold">Edit Profile</h2>
      <div className="text-muted mb-4">
        Update your personal information and contact details.
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <Card className="mb-4">
          <Card.Body>
            <div className="mb-2">
              <div className="d-flex align-items-center mb-1">
                <FaUser className="me-2" />
                <span className="fw-semibold">Profile Picture</span>
              </div>
              <div className="text-muted" style={{ fontSize: 14 }}>
                Upload a new profile picture or keep your current one
              </div>
            </div>
            <div className="d-flex align-items-center" style={{ gap: 24 }}>
              {/* Avatar with initials fallback */}
              <div
                className="d-flex justify-content-center align-items-center border rounded-circle"
                style={{
                  width: 64,
                  height: 64,
                  background: "#fafbfc",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#888",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />
                ) : (
                  // Show initials if no avatar
                  (form.fullname || form.username || "JD")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div>
                <Form.Label
                  className="btn btn-outline-dark fw-semibold"
                  style={{ minWidth: 160, marginBottom: 8 }}
                >
                  Upload New Photo
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </Form.Label>
                <div className="text-muted small mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Personal Information */}
        <Card className="mb-4">
          <Card.Body>
            <div className="mb-2">
              <div className="d-flex align-items-center mb-1">
                <FaIdCard className="me-2" />
                <span className="fw-semibold" style={{ fontSize: 18 }}>
                  Personal Information
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: 14 }}>
                Your basic personal details and identification
              </div>
            </div>
            <Row className="g-4 mt-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={form.fullname || ""}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      value={form.username || ""}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                      disabled
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Citizen ID</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaIdCard />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="citizen_id"
                      value={form.citizen_id || ""}
                      onChange={handleChange}
                      placeholder="Enter your citizen ID number"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Date of Birth</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-calendar-event"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={
                        form.dateOfBirth
                          ? dayjs(form.dateOfBirth).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleChange}
                      placeholder="Select your date of birth"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Contact Information */}
        <Card className="mb-4">
          <Card.Body>
            <div className="mb-2">
              <div className="d-flex align-items-center mb-1">
                <FaEnvelope className="me-2" />
                <span className="fw-semibold" style={{ fontSize: 18 }}>
                  Contact Information
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: 14 }}>
                Your email, phone number, and address details
              </div>
            </div>
            <Row className="g-4 mt-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      disabled
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Phone Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={form.phoneNumber || ""}
                      onChange={handleChange}
                      placeholder="+84123456789"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-normal">Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaMapMarkerAlt />
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={form.address || ""}
                      onChange={handleChange}
                      placeholder="123 Main Street, District 1, Ho Chi Minh City"
                      style={{
                        minHeight: 70,
                        resize: "vertical",
                        fontSize: 15,
                        paddingTop: 10,
                      }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-4">
          <Card.Body>
            <div className="mb-2">
              <div className="d-flex align-items-center mb-1">
                <FaUserFriends className="me-2" />
                <span className="fw-semibold" style={{ fontSize: 18 }}>
                  Emergency Contact
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: 14 }}>
                Contact person in case of emergency
              </div>
            </div>
            <Row className="g-4 mt-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Contact Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contactEmergency.name"
                      value={form.contactEmergency?.name || ""}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      style={{ minHeight: 40 }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-normal">Relationship</Form.Label>
                  <InputGroup style={{ height: 48 }}>
                    <InputGroup.Text>
                      <FaUserFriends />
                    </InputGroup.Text>
                    <Form.Select
                      name="contactEmergency.relationship"
                      value={form.contactEmergency?.relationship || ""}
                      onChange={handleChange}
                      required
                      style={{ minHeight: 40 }}
                    >
                      <option value="">Select relationship</option>
                      <option value="Father">Father</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Wife">Wife</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-normal">Emergency Phone Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contactEmergency.phoneNumber"
                      value={form.contactEmergency?.phoneNumber || ""}
                      onChange={handleChange}
                      placeholder="+84987654321"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditProfilePage;
