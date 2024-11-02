import React, {useState} from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';

const PHONE_LABELS = ['Mobile', 'Home', 'Main', 'Work', 'Home Fax', 'Work Fax', 'Pager', 'Other'];
const EMAIL_LABELS = ['Home', 'Work', 'Other', 'Custom'];

const ContactDetailsSection = ({ formData, setFormData }) => {
  // Add state for verification
  const [verificationStatus, setVerificationStatus] = useState({});
  const [showOtpInput, setShowOtpInput] = useState({});
  const [otp, setOtp] = useState({});

  const initiateVerification = async (phoneNumber, index) => {
    try {
      const response = await api.post('/verify/send-otp', { phoneNumber });
      if (response.data.success) {
        setShowOtpInput({...showOtpInput, [phoneNumber]: true});
      }
    } catch (error) {
      console.error('Verification initiation failed:', error);
    }
  };
  
  const verifyOtp = async (phoneNumber, index) => {
    try {
      const response = await api.post('/verify/check-otp', {
        phoneNumber,
        code: otp[phoneNumber]
      });
      
      if (response.data.success) {
        setVerificationStatus({...verificationStatus, [phoneNumber]: true});
        const newPhones = [...formData.phones];
        newPhones[index].verified = true;
        setFormData({...formData, phones: newPhones});
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1">
        {/* Phone Numbers */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label mb-0">Phone Numbers</label>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  phones: [...formData.phones, { number: '', label: 'Mobile', required: false }]
                });
              }}
            >
              Add Phone Number
            </button>
          </div>
          
          {formData.phones.map((phone, index) => (
            <div key={index} className="input-group mb-2">
              <span className="input-group-text">
                <FaPhone />
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder={`Phone Number ${phone.required ? '*' : ''}`}
                value={phone.number}
                onChange={(e) => {
                  const newPhones = [...formData.phones];
                  newPhones[index].number = e.target.value;
                  // Reset verification status when number is changed
                  newPhones[index].verified = false;
                  setFormData({...formData, phones: newPhones});
                  // Also reset the verification status in local state
                  setVerificationStatus(prev => {
                    const newStatus = {...prev};
                    delete newStatus[phone.number];
                    return newStatus;
                  });
                }}
                required={phone.required}
              />
              <select
                className="form-select"
                style={{maxWidth: '150px'}}
                value={phone.label}
                onChange={(e) => {
                  const newPhones = [...formData.phones];
                  newPhones[index].label = e.target.value;
                  setFormData({...formData, phones: newPhones});
                }}
              >
                {PHONE_LABELS.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              {formData.phones.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    const newPhones = formData.phones.filter((_, i) => i !== index);
                    setFormData({...formData, phones: newPhones});
                  }}
                >
                  Remove
                </button>
              )}
              {phone.number && !phone.verified && (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => initiateVerification(phone.number, index)}
                >
                  Verify
                </button>
              )}
              {showOtpInput[phone.number] && (
                <>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp[phone.number] || ''}
                    onChange={(e) => setOtp({...otp, [phone.number]: e.target.value})}
                  />
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => verifyOtp(phone.number, index)}
                  >
                    Verify OTP
                  </button>
                </>
              )}
              {verificationStatus[phone.number] && (
                <span className="input-group-text text-success">✓ Verified</span>
              )}
            </div>
          ))}
        </div>

        {/* Email Addresses */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label mb-0">Email Addresses</label>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  emails: [...formData.emails, { address: '', label: 'Other', required: false }]
                });
              }}
            >
              Add Email Address
            </button>
          </div>

          {formData.emails.map((email, index) => (
            <div key={index} className="input-group mb-2">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder={`Email Address ${email.required ? '*' : ''}`}
                value={email.address}
                onChange={(e) => {
                  const newEmails = [...formData.emails];
                  newEmails[index].address = e.target.value;
                  setFormData({...formData, emails: newEmails});
                }}
                required={email.required}
              />
              <select
                className="form-select"
                style={{maxWidth: '150px'}}
                value={email.label}
                onChange={(e) => {
                  const newEmails = [...formData.emails];
                  newEmails[index].label = e.target.value;
                  setFormData({...formData, emails: newEmails});
                }}
              >
                {EMAIL_LABELS.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              {formData.emails.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    const newEmails = formData.emails.filter((_, i) => i !== index);
                    setFormData({...formData, emails: newEmails});
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSection;
