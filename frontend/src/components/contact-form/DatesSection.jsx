import React from 'react';
import { FaCalendar } from 'react-icons/fa';

const DATE_LABELS = ['Birthday', 'Anniversary', 'Other', 'Custom'];

const DatesSection = ({ formData, setFormData }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <label className="form-label mb-0">Important Dates</label>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setFormData({
                ...formData,
                significantDates: [...formData.significantDates, { date: '', label: 'No label' }]
              });
            }}
          >
            Add Date
          </button>
        </div>

        {formData.significantDates.map((date, index) => (
          <div key={index} className="input-group mb-3">
            <span className="input-group-text">
              <FaCalendar />
            </span>
            <input
              type="date"
              className="form-control"
              value={date.date}
              onChange={(e) => {
                const newDates = [...formData.significantDates];
                newDates[index].date = e.target.value;
                setFormData({...formData, significantDates: newDates});
              }}
            />
            <select
              className="form-select"
              style={{maxWidth: '150px'}}
              value={date.label}
              onChange={(e) => {
                const newDates = [...formData.significantDates];
                newDates[index].label = e.target.value;
                setFormData({...formData, significantDates: newDates});
              }}
            >
              {DATE_LABELS.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                const newDates = formData.significantDates.filter((_, i) => i !== index);
                setFormData({...formData, significantDates: newDates});
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatesSection;
