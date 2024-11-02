import React from 'react';

const FIELD_TYPES = ['Text', 'URL', 'Email', 'Phone', 'Date', 'Number'];

const CustomFieldsSection = ({ formData, setFormData }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <label className="form-label mb-0">Custom Fields</label>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setFormData({
                ...formData,
                customFields: [...formData.customFields, { 
                  label: '', 
                  value: '', 
                  type: 'Text'
                }]
              });
            }}
          >
            Add Custom Field
          </button>
        </div>

        {formData.customFields.map((field, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Field Label *"
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...formData.customFields];
                      newFields[index].label = e.target.value;
                      setFormData({...formData, customFields: newFields});
                    }}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={field.type}
                    onChange={(e) => {
                      const newFields = [...formData.customFields];
                      newFields[index].type = e.target.value;
                      setFormData({...formData, customFields: newFields});
                    }}
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <input
                    type={field.type.toLowerCase()}
                    className="form-control"
                    placeholder="Field Value *"
                    value={field.value}
                    onChange={(e) => {
                      const newFields = [...formData.customFields];
                      newFields[index].value = e.target.value;
                      setFormData({...formData, customFields: newFields});
                    }}
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm mt-2"
                onClick={() => {
                  const newFields = formData.customFields.filter((_, i) => i !== index);
                  setFormData({...formData, customFields: newFields});
                }}
              >
                Remove Field
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsSection;
