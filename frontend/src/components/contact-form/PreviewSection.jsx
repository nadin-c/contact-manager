import React, { useState } from 'react';
import { 
  FaUser, FaBuilding, FaPhone, FaEnvelope, FaCalendar, 
  FaLinkedin, FaTwitter, FaFacebook, FaInstagram,
  FaChevronDown, FaChevronUp, FaLink, FaHashtag, FaFont
} from 'react-icons/fa';

const PreviewSection = ({ formData }) => {
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    dates: true,
    social: true,
    custom: true
  });

  const typeIcons = {
    'Text': FaFont,
    'URL': FaLink,
    'Email': FaEnvelope,
    'Phone': FaPhone,
    'Date': FaCalendar,
    'Number': FaHashtag
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card-body p-4 h-100 d-flex flex-column">
      <h3 className="mb-4">Preview</h3>
      <div className="preview-card flex-grow-1 overflow-auto">
        {/* Name and Company Section */}
        <div className="text-center mb-4 pb-3 border-bottom">
          <h2 className="mb-2">
            {formData.namePrefix} {formData.firstName} {formData.middleName} {formData.lastName} {formData.nameSuffix}
          </h2>
          {formData.company && (
            <div className="text-muted d-flex align-items-center justify-content-center">
              <FaBuilding className="me-2" />
              <span>{formData.company}</span>
            </div>
          )}
        </div>
        
        {/* Contact Information */}
        {(formData.phones.length > 0 || formData.emails.length > 0) && (
          <div className="preview-section mb-4">
            <div 
              className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3 cursor-pointer"
              onClick={() => toggleSection('contact')}
            >
              <h5 className="mb-0">Contact Details</h5>
              {expandedSections.contact ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.contact && (
              <div className="ps-2">
                {formData.phones.map((phone, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <FaPhone className="me-2 text-primary" />
                    <a href={`tel:${phone.number}`} className="text-decoration-none">
                      <span className="text-muted me-2">{phone.label}:</span>
                      {phone.number}
                    </a>
                  </div>
                ))}
                {formData.emails.map((email, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-2 text-primary" />
                    <a href={`mailto:${email.address}`} className="text-decoration-none">
                      <span className="text-muted me-2">{email.label}:</span>
                      {email.address}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Important Dates */}
        {formData.significantDates.length > 0 && (
          <div className="preview-section mb-4">
            <div 
              className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3 cursor-pointer"
              onClick={() => toggleSection('dates')}
            >
              <h5 className="mb-0">Important Dates</h5>
              {expandedSections.dates ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.dates && (
              <div className="ps-2">
                {formData.significantDates.map((date, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <FaCalendar className="me-2 text-primary" />
                    <span className="text-muted me-2">{date.label}:</span>
                    {formatDate(date.date)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social Media */}
        {Object.entries(formData.socialMedia).some(([_, url]) => url) && (
          <div className="preview-section mb-4">
            <div 
              className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3 cursor-pointer"
              onClick={() => toggleSection('social')}
            >
              <h5 className="mb-0">Social Media</h5>
              {expandedSections.social ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.social && (
              <div className="ps-2">
                {Object.entries(formData.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = {
                    linkedin: FaLinkedin,
                    twitter: FaTwitter,
                    facebook: FaFacebook,
                    instagram: FaInstagram
                  }[platform];
                  return (
                    <div key={platform} className="d-flex align-items-center mb-2">
                      <Icon className={`me-2 text-${platform}`} />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Custom Fields */}
        {formData.customFields.length > 0 && (
          <div className="preview-section">
            <div 
              className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3 cursor-pointer"
              onClick={() => toggleSection('custom')}
            >
              <h5 className="mb-0">Additional Information</h5>
              {expandedSections.custom ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.custom && (
              <div className="ps-2">
                {formData.customFields.map((field, index) => {
                  const IconComponent = typeIcons[field.type];
                  return (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <IconComponent className="me-2 text-primary" />
                      <span className="text-muted me-2">{field.label}:</span>
                      {field.type === 'URL' ? (
                        <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          {field.value}
                        </a>
                      ) : (
                        <span>{field.value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
