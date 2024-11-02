import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const BasicInfoSection = ({ formData, setFormData }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="row mx-0 g-4">
          <div className="col-12">
            <select 
              className="form-select"
              value={formData.namePrefix}
              onChange={(e) => setFormData({...formData, namePrefix: e.target.value})}
            >
              <option value="">Prefix</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>
          
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
          </div>
          
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Suffix"
              value={formData.nameSuffix}
              onChange={(e) => setFormData({...formData, nameSuffix: e.target.value})}
            />
          </div>
          
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">
                <FaBuilding />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
