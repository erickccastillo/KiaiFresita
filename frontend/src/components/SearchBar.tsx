import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
      <input
        type="text"
        placeholder=" Buscar producto..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.9rem 1rem',
          borderRadius: '10px',
          border: '1px solid #d9d9d9',
          fontSize: '1rem',
          backgroundColor: '#fff',
          color: '#333',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.border = '1px solid #e1b71f';
          e.target.style.boxShadow = '0 0 0 3px rgba(225,183,31,0.2)';
        }}
        onBlur={(e) => {
          e.target.style.border = '1px solid #d9d9d9';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default SearchBar;
