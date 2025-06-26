import React from 'react';
import './InputField.css';

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        {...register(name, { required: true })}
        className="input-field"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
