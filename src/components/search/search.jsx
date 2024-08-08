import React, { useState } from 'react';
import PropTypes from 'prop-types';


const Search = ( {setFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredData(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredData('');
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search player name"
        value={searchTerm}
        onChange={handleSearch}
        className='inline-block'
      />
      <button onClick={handleClear} name='clear' type='reset'>Clear</button>
    </>
  );
};

Search.propTypes = {
  setFilteredData: PropTypes.func.isRequired // Ensure it's defined as a function
};
export default Search;
