import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/register", {
                email,
                password,
            });
            setMessage({
                type: "success",
                text: response.data.message,
            });
            navigate("/contact-form", {
                state: { userId: response.data.userId },
            });
            localStorage.setItem('userId', response.data.userId);
        } catch (error) {
            if (error.response?.status === 409) {
                setMessage({
                    type: "warning",
                    text: "This email is already registered.",
                    showLoginOption: true,
                });
            } else {
                setMessage({
                    type: "danger",
                    text:
                        error.response?.data?.message || "Registration failed",
                });
            }
        }
    };

    const redirectToLogin = () => {
        navigate("/login", { state: { email } });
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Create Account</h2>
                                    <p className="text-muted">
                                        Get started with your digital contact
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
                                                placeholder="Choose a password"
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
                                        Create Account
                                    </button>

                                    {message && (
                                        <div
                                            className={`alert alert-${
                                                message.type
                                            } ${
                                                message.showLoginOption
                                                    ? "alert-dismissible"
                                                    : ""
                                            }`}
                                        >
                                            {message.text}
                                            {message.showLoginOption && (
                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={
                                                            redirectToLogin
                                                        }
                                                    >
                                                        Login with this email
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>

                                <div className="text-center mt-4">
                                    <p className="mb-0">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className="text-decoration-none"
                                        >
                                            Login here
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

export default Register;
