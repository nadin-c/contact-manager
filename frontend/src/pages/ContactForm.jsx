import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import BasicInfoSection from "../components/contact-form/BasicInfoSection";
import ContactDetailsSection from "../components/contact-form/ContactDetailsSection";
import DatesSection from "../components/contact-form/DatesSection";
import SocialMediaSection from "../components/contact-form/SocialMediaSection";
import CustomFieldsSection from "../components/contact-form/CustomFieldsSection";
import PreviewSection from "../components/contact-form/PreviewSection";
import api from "../services/api";

const ContactForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("basic");
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formData, setFormData] = useState(
        location.state?.formData || {
            namePrefix: "",
            firstName: "",
            middleName: "",
            lastName: "",
            nameSuffix: "",
            company: "",
            phones: [
                {
                    number: "",
                    label: "Mobile",
                    required: true,
                },
            ],
            emails: [
                {
                    address: "",
                    label: "No label",
                    required: true,
                },
            ],
            significantDates: [],
            socialMedia: {
                linkedin: "",
                twitter: "",
                facebook: "",
                instagram: "",
            },
            customFields: [],
        }
    );

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all phone numbers are verified
        const unverifiedNumbers = formData.phones.filter(
            phone => phone.number && !phone.verified
        );
    
        if (unverifiedNumbers.length > 0) {
            setSubmitStatus({
                type: 'warning',
                message: 'Please verify all phone numbers before submitting'
            });
            return;
        }

        const form = e.target;

        if (!formData.firstName || !formData.lastName) {
            setActiveTab("basic");
            form.classList.add("was-validated");
            return;
        }

        if (!formData.phones[0].number || !formData.emails[0].address) {
            setActiveTab("contact");
            form.classList.add("was-validated");
            return;
        }

        const invalidCustomField = formData.customFields.find(
            (field) => field && (!field.label || !field.value)
        );
        if (invalidCustomField) {
            setActiveTab("custom");
            form.classList.add("was-validated");
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                userId: location.state?.userId || localStorage.getItem("userId"),
            };

            const response = await api.post("/contacts/create", dataToSubmit);

            // Store the updated form data in location state
            navigate(`/card/${dataToSubmit.userId}`, {
                state: { formData: dataToSubmit }
            });
            
        } catch (error) {
            setSubmitStatus({
                type: "danger",
                message: error.response?.data?.message || "Failed to save contact card"
            });
        }
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Contact Manager</span>
                    <button className="btn btn-outline-primary rounded-pill" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container-fluid ">
                <div className="row  mx-0">
                    <div className="col-md-7  d-flex flex-column px-2">
                        <div className="card shadow flex-grow-1">
                            <div className="card-body d-flex flex-column">
                                <h2 className="mb-4">
                                    Create Your Contact Card
                                </h2>

                                {submitStatus && (
                                    <div
                                        className={`alert alert-${submitStatus.type} alert-dismissible fade show`}
                                        role="alert"
                                    >
                                        {submitStatus.message}
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                                setSubmitStatus(null)
                                            }
                                        ></button>
                                    </div>
                                )}

                                <ul className="nav nav-tabs mb-4">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "basic"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("basic")
                                            }
                                        >
                                            Basic Info
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "contact"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("contact")
                                            }
                                        >
                                            Contact
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "dates"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("dates")
                                            }
                                        >
                                            Dates
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "social"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("social")
                                            }
                                        >
                                            Social
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "custom"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("custom")
                                            }
                                        >
                                            Custom
                                        </button>
                                    </li>
                                </ul>

                                <form
                                    onSubmit={handleSubmit}
                                    className="flex-grow-1 d-flex flex-column"
                                >
                                    <div className="tab-content flex-grow-1 overflow-auto">
                                        {activeTab === "basic" && (
                                            <BasicInfoSection
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}
                                        {activeTab === "contact" && (
                                            <ContactDetailsSection
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}
                                        {activeTab === "dates" && (
                                            <DatesSection
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}
                                        {activeTab === "social" && (
                                            <SocialMediaSection
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}
                                        {activeTab === "custom" && (
                                            <CustomFieldsSection
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mt-3"
                                    >
                                        Save Contact Card
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5  d-flex flex-column px-2">
                        <div className="card shadow flex-grow-1">
                            <PreviewSection formData={formData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactForm;
