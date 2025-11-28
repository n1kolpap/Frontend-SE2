import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => (
  <input type="text" placeholder="Search activities" onChange={(e) => onSearch(e.target.value)} />
);

export default SearchBar;