import { useState } from "react";
import {
    Button,
    Container,
    Form,
    InputGroup
} from "react-bootstrap";
import {
    FaBirthdayCake,
    FaEnvelope,
    FaHome,
    FaIdBadge,
    FaLock,
    FaPhone,
    FaUser,
    FaUserCircle,
} from "react-icons/fa";

const EditProfilePage = () => {
    // State mẫu, bạn có thể bind từ API hoặc formik/yup
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý submit
        alert("Profile updated!");
    };

    return (
        <Container fluid style={{ overflowY: "auto" }}>
            <h2 className="mb-4 text-center">
                <FaUserCircle style={{ marginRight: 10 }} />
                Edit Profile
            </h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaIdBadge />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formFullname">
                    <Form.Label>Full Name</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaUser />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Enter full name"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaEnvelope />
                        </InputGroup.Text>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaLock />
                        </InputGroup.Text>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaPhone />
                        </InputGroup.Text>
                        <Form.Control
                            type="tel"
                            placeholder="Enter phone number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaBirthdayCake />
                        </InputGroup.Text>
                        <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaHome />
                        </InputGroup.Text>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter your address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default EditProfilePage;
