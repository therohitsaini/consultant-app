import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ConsultantProfileModal = ({ show, handleClose, onLogout, consultantOverview }) => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        avatar: null,
    });

    useEffect(() => {
        if (consultantOverview) {
            setProfile({    
                name: consultantOverview?.consultant?.fullname || "",
                email: consultantOverview?.consultant?.email || "",
                phone: consultantOverview?.consultant?.phone || "",
                gender: consultantOverview?.consultant?.gender || "",
                avatar: `${process.env.REACT_APP_BACKEND_HOST}/${consultantOverview?.consultant?.profileImage?.replace("\\", "/")}`,
            });
        }
    }, [consultantOverview]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({
                ...profile,
                avatar: URL.createObjectURL(file),
            });
        }
    };

    const handleSave = () => {
        console.log("Saved Profile:", profile);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>My Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Profile Image */}
                <div className="text-center mb-4">
                    <img
                        src={profile.avatar || "https://via.placeholder.com/120"}
                        alt="Profile"
                        className="rounded-circle mb-2"
                        width="120"
                        height="120"
                        style={{ objectFit: "cover" }}
                    />
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <Form>
                    {/* Row 1 */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Row 2 */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="danger" onClick={onLogout}>
                    Logout
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsultantProfileModal;
