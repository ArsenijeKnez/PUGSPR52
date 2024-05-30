import React from 'react';

const DriverRideList = ({ rides, onAcceptRide }) => {
  return (
    <div>
      <h3>Vožnje koje čekaju da budu prihvaćene:</h3>
      <ul>
        {rides.map((ride, index) => (
          <li key={index}>
            Od: {ride.startAddress} Do: {ride.endAddress} Cena: {ride.price} RSD Vreme čekanja: {ride.waitTime} minuta
            <button onClick={() => onAcceptRide(index)}>Prihvati</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverRideList;
