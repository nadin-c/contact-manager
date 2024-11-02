import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { 
    FaUser, FaBuilding, FaPhone, FaEnvelope, FaCalendar, 
    FaLinkedin, FaTwitter, FaFacebook, FaInstagram,
    FaLink, FaHashtag, FaFont, FaDownload, FaShare,
    FaQrcode, FaCopy, FaWhatsapp, FaTelegram
} from 'react-icons/fa';
import {
    WhatsappShareButton,
    TelegramShareButton,
    LinkedinShareButton,
    EmailShareButton,
    WhatsappIcon,
    TelegramIcon,
    LinkedinIcon,
    EmailIcon
} from 'react-share';
import api from '../services/api';

const PublicCard = () => {
    const { userId } = useParams();
    const [contactData, setContactData] = useState(null);
    const [error, setError] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const currentUrl = window.location.href;

    const typeIcons = {
        'Text': FaFont,
        'URL': FaLink,
        'Email': FaEnvelope,
        'Phone': FaPhone,
        'Date': FaCalendar,
        'Number': FaHashtag
    };

    useEffect(() => {
        const fetchContactCard = async () => {
            try {
                const response = await api.get(`/contacts/${userId}`);
                setContactData(response.data.contact);
            } catch (error) {
                setError('Contact card not found');
            }
        };
        fetchContactCard();
    }, [userId]);

    const generateVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.namePrefix || ''} ${contactData.firstName} ${contactData.middleName || ''} ${contactData.lastName} ${contactData.nameSuffix || ''}
${contactData.company ? `ORG:${contactData.company}` : ''}
${contactData.phones.map(phone => `TEL;TYPE=${phone.label}:${phone.number}`).join('\n')}
${contactData.emails.map(email => `EMAIL;TYPE=${email.label}:${email.address}`).join('\n')}
${Object.entries(contactData.socialMedia)
    .filter(([_, url]) => url)
    .map(([platform, url]) => `URL;TYPE=${platform}:${url}`).join('\n')}
${contactData.customFields.map(field => `X-${field.label}:${field.value}`).join('\n')}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${contactData.firstName}_${contactData.lastName}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyLink = () => {
        copy(currentUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${contactData.firstName}'s Contact Card`,
                    text: 'Check out my contact card!',
                    url: currentUrl
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    if (error) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center">
                <div className="container text-center">
                    <h2>{error}</h2>
                </div>
            </div>
        );
    }

    if (!contactData) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100">
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <div className="text-center">
                        <div className="display-1 fw-bold mb-3">
                            {contactData.namePrefix} {contactData.firstName} {contactData.middleName} {contactData.lastName} {contactData.nameSuffix}
                        </div>
                        {contactData.company && (
                            <div className="fs-3 opacity-75">
                                <FaBuilding className="me-2" />
                                {contactData.company}
                            </div>
                        )}
                        
                        <div className="mt-4 d-flex justify-content-center gap-3">
                            <button 
                                className="btn btn-light btn-lg rounded-pill px-4"
                                onClick={generateVCard}
                            >
                                <FaDownload className="me-2" />
                                Add to Contacts
                            </button>

                            <div className="dropdown">
                                <button 
                                    className="btn btn-light btn-lg rounded-pill px-4"
                                    onClick={() => setShowShareOptions(!showShareOptions)}
                                >
                                    <FaShare className="me-2" />
                                    Share
                                </button>
                                {showShareOptions && (
                                    <div className="dropdown-menu show p-3" style={{ minWidth: '300px' }}>
                                        <h6 className="dropdown-header">Share via</h6>
                                        
                                        <div className="d-flex justify-content-around mb-3">
                                            <WhatsappShareButton url={currentUrl}>
                                                <WhatsappIcon size={40} round />
                                            </WhatsappShareButton>
                                            
                                            <TelegramShareButton url={currentUrl}>
                                                <TelegramIcon size={40} round />
                                            </TelegramShareButton>
                                            
                                            <LinkedinShareButton url={currentUrl}>
                                                <LinkedinIcon size={40} round />
                                            </LinkedinShareButton>
                                            
                                            <EmailShareButton url={currentUrl}>
                                                <EmailIcon size={40} round />
                                            </EmailShareButton>
                                        </div>

                                        <div className="dropdown-divider"></div>
                                        
                                        <button 
                                            className="dropdown-item d-flex align-items-center"
                                            onClick={() => setShowQR(!showQR)}
                                        >
                                            <FaQrcode className="me-2" /> Show QR Code
                                        </button>
                                        
                                        <button 
                                            className="dropdown-item d-flex align-items-center"
                                            onClick={handleCopyLink}
                                        >
                                            <FaCopy className="me-2" /> 
                                            {copySuccess ? 'Copied!' : 'Copy Link'}
                                        </button>

                                        {navigator.share && (
                                            <button 
                                                className="dropdown-item d-flex align-items-center"
                                                onClick={handleNativeShare}
                                            >
                                                <FaShare className="me-2" /> Share via...
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {showQR && (
                            <div className="mt-4 bg-white p-4 rounded d-inline-block">
                                <QRCodeSVG value={currentUrl} size={200} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="row g-4 mb-5">
                        {contactData.phones[0] && (
                            <div className="col-md-6">
                                <a href={`tel:${contactData.phones[0].number}`} 
                                   className="btn btn-outline-primary w-100 p-4 rounded-3">
                                    <FaPhone className="me-2" size={24} />
                                    Call Primary Number
                                </a>
                            </div>
                        )}
                        {contactData.emails[0] && (
                            <div className="col-md-6">
                                <a href={`mailto:${contactData.emails[0].address}`}
                                   className="btn btn-outline-primary w-100 p-4 rounded-3">
                                    <FaEnvelope className="me-2" size={24} />
                                    Send Email
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Contact Details */}
                    {(contactData.phones.length > 0 || contactData.emails.length > 0) && (
                        <div className="col-lg-6">
                            <div className="bg-light p-4 rounded-3 h-100">
                                <h3 className="mb-4">Contact Details</h3>
                                {contactData.phones.map((phone, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="text-muted small">{phone.label}</div>
                                        <a href={`tel:${phone.number}`} className="text-decoration-none fs-5 d-flex align-items-center">
                                            <FaPhone className="me-2 text-primary" />
                                            {phone.number}
                                        </a>
                                    </div>
                                ))}
                                {contactData.emails.map((email, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="text-muted small">{email.label}</div>
                                        <a href={`mailto:${email.address}`} className="text-decoration-none fs-5 d-flex align-items-center">
                                            <FaEnvelope className="me-2 text-primary" />
                                            {email.address}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Media */}
                    {Object.entries(contactData.socialMedia).some(([_, url]) => url) && (
                        <div className="col-lg-6">
                            <div className="bg-light p-4 rounded-3 h-100">
                                <h3 className="mb-4">Social Media</h3>
                                <div className="row g-4">
                                    {Object.entries(contactData.socialMedia).map(([platform, url]) => {
                                        if (!url) return null;
                                        const Icon = {
                                            linkedin: FaLinkedin,
                                            twitter: FaTwitter,
                                            facebook: FaFacebook,
                                            instagram: FaInstagram
                                        }[platform];
                                        return (
                                            <div key={platform} className="col-6">
                                                <a href={url} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   className={`btn btn-outline-${platform} w-100 d-flex flex-column align-items-center gap-2`}>
                                                    <Icon size={30} />
                                                    <span className="fs-5 mt-2">
                                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                    </span>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Important Dates */}
                    {contactData.significantDates.length > 0 && (
                        <div className="col-lg-6">
                            <div className="bg-light p-4 rounded-3 h-100">
                                <h3 className="mb-4">Important Dates</h3>
                                {contactData.significantDates.map((date, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="text-muted small">{date.label}</div>
                                        <div className="fs-5 d-flex align-items-center">
                                        <FaCalendar className="me-2 text-primary" />
                                            {date.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Custom Fields */}
                    {contactData.customFields.length > 0 && (
                        <div className="col-lg-6">
                            <div className="bg-light p-4 rounded-3 h-100">
                                <h3 className="mb-4">Additional Information</h3>
                                {contactData.customFields.map((field, index) => {
                                    const IconComponent = typeIcons[field.type];
                                    return (
                                        <div key={index} className="mb-3">
                                            <div className="text-muted small">{field.label}</div>
                                            <div className="fs-5 d-flex align-items-center">
                                                <IconComponent className="me-2 text-primary" />
                                                {field.type === 'URL' ? (
                                                    <a href={field.value} 
                                                       target="_blank" 
                                                       rel="noopener noreferrer" 
                                                       className="text-decoration-none">
                                                        {field.value}
                                                    </a>
                                                ) : (
                                                    <span>{field.value}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicCard;

