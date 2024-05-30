import React, { useState } from 'react';

const NewRideForm = ({ onRideRequest }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRideRequest({ startAddress, endAddress });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={startAddress}
        onChange={(e) => setStartAddress(e.target.value)}
        placeholder="Start Address"
        required
      />
      <input
        type="text"
        value={endAddress}
        onChange={(e) => setEndAddress(e.target.value)}
        placeholder="End Address"
        required
      />
      <button type="submit">Poruči</button>
    </form>
  );
};

export default NewRideForm;
