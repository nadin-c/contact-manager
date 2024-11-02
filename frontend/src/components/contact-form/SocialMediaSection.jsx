import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const SocialMediaSection = ({ formData, setFormData }) => {
  const socialIcons = {
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="row mx-0 g-3">
          {Object.entries(formData.socialMedia).map(([platform, url]) => {
            const Icon = socialIcons[platform];
            return (
              <div key={platform} className="col-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <Icon className={`text-${platform}`} />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile URL`}
                    value={url}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        [platform]: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
