import React, { useState, useEffect } from 'react';
import { getRides } from "../../Services/RideService";


const DriverPreviousRides = () => {

  const [rides, setRides] = useState([]);


  useEffect(() => {

    const fetchRides = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));


        const tokenS = localStorage.getItem('encodedToken');
        const token2 = tokenS ? JSON.parse(tokenS) : null;
        console.log(token2);
        const response = await getRides(token.id, token2);
        if(response.status === 200 && response.data.length !== 0)
          setRides(response.data); 
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };
  
    fetchRides();
  }, [])
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
