import React, { useEffect, useState } from 'react';

const RideCountdown = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  return (
    <div>
      <p>Vreme do dolaska vozača: {timeLeft} sekundi</p>
    </div>
  );
};

export default RideCountdown;
