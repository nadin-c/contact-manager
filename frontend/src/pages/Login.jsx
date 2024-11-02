import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/login", {
                email,
                password,
            });
            setMessage(response.data.message);
            if (response.data.lastContact) {
                navigate("/contact-form", {
                    state: {
                        userId: response.data.userId,
                        formData: response.data.lastContact,
                    },
                });
            } else {
                navigate("/contact-form", {
                    state: { userId: response.data.userId },
                });
            }
            localStorage.setItem('userId', response.data.userId);
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Welcome Back!</h2>
                                    <p className="text-muted">
                                        Login to manage your digital contact
                                        card
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FaEnvelope />
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email address"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FaLock />
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                    >
                                        Login
                                    </button>

                                    {message && (
                                        <div
                                            className={`alert ${
                                                message.includes("successful")
                                                    ? "alert-success"
                                                    : "alert-danger"
                                            } mt-3`}
                                        >
                                            {message}
                                        </div>
                                    )}
                                </form>

                                <div className="text-center mt-4">
                                    <p className="mb-0">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/register"
                                            className="text-decoration-none"
                                        >
                                            Create one now
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
