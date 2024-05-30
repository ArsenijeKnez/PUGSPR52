import React from 'react';

const DriverPreviousRides = ({ rides }) => {
  return (
    <div>
      <h3>Prethodne vožnje</h3>
      <ul>
        {rides.filter(ride => ride.completed).map((ride, index) => (
          <li key={index}>
            Od: {ride.startAddress} Do: {ride.endAddress} Cena: {ride.price} RSD Vreme čekanja: {ride.waitTime} minuta
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverPreviousRides;
