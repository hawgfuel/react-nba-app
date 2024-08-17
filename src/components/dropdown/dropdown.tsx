import React, { useState } from 'react';

interface DropdownProps {
  options: (string|number)[];
  onSelect: (value: string | number) => void;
  label: string;
  className: string;
  defaultSelection: string | number;
}

export const Dropdown = ({ options, onSelect, label, className, defaultSelection }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelection);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <span className={className}>
      <label className='drop-down-label margin-left-sm inline-block'>{label}
        <select value={selectedOption} onChange={handleSelect}>
          {options.map((option) => (
            <option key={option.toString()} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </span>
  );
};

export default Dropdown;
