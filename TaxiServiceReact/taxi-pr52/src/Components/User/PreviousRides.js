import React, { useState, useEffect } from "react";
import {getRides} from "../../Services/RideService";

const PreviousRides = () => {
  const [rideHistory, setRideHistory] = useState([]);

  const fetchRideHistory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));

      const tokenS = localStorage.getItem('encodedToken');
      const token2 = tokenS ? JSON.parse(tokenS) : null;

      const history = await getRides(token.id, token2);
      console.log("Ride History:", history); 
      setRideHistory(history);
    } catch (error) {
      console.error("Error fetching ride history:", error);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  return (
    <div id="historyComponent">
      <h2>My rides</h2>
    {rideHistory.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Start Address</th>
              <th>End Address</th>
              <th>Wait Duration</th>
              <th>Ride Duration</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {rideHistory.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.id}</td>
                <td>{ride.startAdress}</td>
                <td>{ride.endAdress}</td>
                <td>{ride.waitDuration}</td>
                <td>{ride.rideDuration}</td>
                <td>{ride.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ride history available.</p>
      )}
    </div>
  );
};

export default PreviousRides;
