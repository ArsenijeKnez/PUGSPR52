import React, { useState, useEffect } from 'react';
import NewRideForm from './NewRideForm';
import RideDetails from './RideDetails';
import DriverRideList from '../Driver/DriverRideList';
import RideCountdown from './RideCountdown';
import RateDriver from './RateDriver';
import AdminPanel from '../Admin/AdminPanel';
import PreviousRides from './PreviousRides';
import DriverNewRidesList from '../Driver/DriverNewRidesList';
import DriverPreviousRides from '../Driver/DriverPreviousRides';
import AdminRideList from '../Admin/AdminRideList';

const RideConfirmation = () => {
  const [ride, setRide] = useState(null);
  const [price, setPrice] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [rides, setRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [userStatus, setUserStatus] = useState('idle'); 
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Driver 1', rating: 4.5, status: 'pending' },
    { id: 2, name: 'Driver 2', rating: 4.0, status: 'pending' },
  ]);

  const handleRideRequest = ({ startAddress, endAddress }) => {
    const distance = Math.random() * 10; // Simulating distance
    const estimatedPrice = distance * 50; // Example calculation
    const estimatedWaitTime = Math.floor(Math.random() * 15) + 1; // Random wait time

    setRide({ startAddress, endAddress });
    setPrice(estimatedPrice);
    setWaitTime(estimatedWaitTime);
    setUserStatus('waiting');
  };

  const handleConfirm = () => {
    setRides([...rides, { ...ride, price, waitTime, accepted: false, completed: false }]);
    setRide(null);
    setPrice(null);
    setWaitTime(null);
    setUserStatus('inRide');
  };

  const handleCompleteArrival = () => {
    setUserStatus('inRide');
  };

  const handleCompleteRide = () => {
    setRides((prevRides) => {
      const updatedRides = [...prevRides];
      updatedRides[updatedRides.length - 1].completed = true;
      setCompletedRides([...completedRides, updatedRides[updatedRides.length - 1]]);
      return updatedRides;
    });
    setUserStatus('rateDriver');
  };

  const handleRateDriver = (rating) => {
    setUserStatus('idle');
  };

  const handleAcceptRide = (index) => {
    setRides((prevRides) => {
      const newRides = [...prevRides];
      newRides[index].accepted = true;
      return newRides;
    });
  };

  const handleApproveDriver = (id) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.id === id ? { ...driver, status: 'approved' } : driver
      )
    );
  };

  const handleRejectDriver = (id) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.id === id ? { ...driver, status: 'rejected' } : driver
      )
    );
  };

  return (
    <div>
      {userStatus === 'idle' && (
        <NewRideForm onRideRequest={handleRideRequest} />
      )}
      {userStatus === 'waiting' && (
        <RideDetails price={price} waitTime={waitTime} onConfirm={handleConfirm} />
      )}
      {userStatus === 'inRide' && (
        <>
          <RideCountdown duration={waitTime * 60} onComplete={handleCompleteArrival} />
          <RideCountdown duration={Math.floor(Math.random() * 30) + 10} onComplete={handleCompleteRide} />
        </>
      )}
      {userStatus === 'rateDriver' && (
        <RateDriver onSubmitRating={handleRateDriver} />
      )}
      <DriverRideList rides={rides} onAcceptRide={handleAcceptRide} />
      <AdminPanel
        drivers={drivers}
        onApproveDriver={handleApproveDriver}
        onRejectDriver={handleRejectDriver}
      />
      <PreviousRides rides={completedRides} />
      <DriverNewRidesList rides={rides} onAcceptRide={handleAcceptRide} />
      <DriverPreviousRides rides={rides} />
      <AdminRideList rides={rides} />
    </div>
  );
};

export default RideConfirmation;
