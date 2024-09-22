import { useState } from 'react';
import Select from 'react-select';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('{"data":["M","1","334","4","r"]}');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Options for Multi-Select Filter
  const options = [
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  // Custom styles for the react-select dropdown
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#f1f1f1',
      borderColor: '#ddd',
      padding: '5px',
      fontSize: '16px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007bff' : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      '&:hover': {
        backgroundColor: '#007bff',
        color: '#fff',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#007bff',
      color: '#fff',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#fff',
      '&:hover': {
        backgroundColor: '#0056b3',
        color: '#fff',
      },
    }),
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('https://bajaj-t18w.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFilterChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;
    let filteredResponse = {};

    if (selectedOptions.some(option => option.value === 'Numbers')) {
      filteredResponse.numbers = numbers;
    }
    if (selectedOptions.some(option => option.value === 'Alphabets')) {
      filteredResponse.alphabets = alphabets;
    }
    if (selectedOptions.some(option => option.value === 'Highest Lowercase Alphabet')) {
      filteredResponse.highestLowercaseAlphabet = highest_lowercase_alphabet;
    }

    return (
      <div className="filtered-response">
        {filteredResponse.numbers && <p>Numbers: {filteredResponse.numbers.join(', ')}</p>}
        {filteredResponse.alphabets && <p>Alphabets: {filteredResponse.alphabets.join(', ')}</p>}
        {filteredResponse.highestLowercaseAlphabet && (
          <p>Highest Lowercase Alphabet: {filteredResponse.highestLowercaseAlphabet.join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="title">BFHL Challenge</h1>

      <textarea
        className="input"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON like {"data": ["A", "1", "B", "c"]}'
      ></textarea>

      {/* Multi Filter Dropdown visible before submit */}
      <div className="multi-filter">
        <h2 className="response-title">Multi Filter</h2>
        <Select
          isMulti
          value={selectedOptions}
          onChange={handleFilterChange}
          options={options}
          styles={customStyles}
        />
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>

      {response && (
        <>
          <h2 className="response-title">Filtered Response:</h2>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}

export default App;
