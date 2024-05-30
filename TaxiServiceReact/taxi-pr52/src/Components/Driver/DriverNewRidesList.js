import React from 'react';

const DriverNewRidesList = ({ rides, onAcceptRide }) => {
  return (
    <div>
      <h3>Nove vožnje</h3>
      <ul>
        {rides.filter(ride => !ride.accepted).map((ride, index) => (
          <li key={index}>
            Od: {ride.startAddress} Do: {ride.endAddress} Cena: {ride.price} RSD Vreme čekanja: {ride.waitTime} minuta
            <button onClick={() => onAcceptRide(index)}>Prihvati</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverNewRidesList;
