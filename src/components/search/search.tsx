import React, { useState } from 'react';

interface SearchProps {
  setFilteredData: (key: string) => void;
}

const Search = ( {setFilteredData }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
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

export default Search;
