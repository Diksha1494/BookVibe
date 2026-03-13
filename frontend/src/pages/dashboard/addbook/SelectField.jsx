import React from 'react';
import './SelectField.css';

const SelectField = ({ label, name, options, register }) => {
  return (
    <div className="select-group">
      <label className="select-label">{label}</label>
      <select
        {...register(name, { required: true })}
        className="select-field"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
