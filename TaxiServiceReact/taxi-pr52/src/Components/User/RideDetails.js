import React from 'react';

const RideDetails = ({ price, waitTime, onConfirm }) => {
  return (
    <div>
      <p>Predviđena cena: {price} RSD</p>
      <p>Vreme čekanja: {waitTime} minuta</p>
      <button onClick={onConfirm}>Potvrdi</button>
    </div>
  );
};

export default RideDetails;
