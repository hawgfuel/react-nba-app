import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Dropdown = ({ options, onSelect, label, className }) => {
  const [selectedOption, setSelectedOption] = useState(options[options.length -1]);
  Dropdown.propTypes = {
    options: PropTypes.array,
    onSelect: PropTypes.func,
    label: PropTypes.string,
    className: PropTypes.string
  }
  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <span className={className}>
        <label className='drop-down-label margin-left-sm inline-block'>{label}
        <select value={selectedOption} onChange={handleSelect}>
        {options.map((option) => (
            <option key={option} value={option} name={option}>
            {option}
            </option>
        ))}
        </select>
        </label>
    </span>
  );
};

export default Dropdown;
