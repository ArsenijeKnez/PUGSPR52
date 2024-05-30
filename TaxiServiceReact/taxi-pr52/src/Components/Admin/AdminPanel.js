import React from 'react';

const AdminPanel = ({ drivers, onApproveDriver, onRejectDriver }) => {
  return (
    <div>
      <h3>Admin Panel</h3>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            {driver.name} - Prosečna ocena: {driver.rating} - Status: {driver.status}
            <button onClick={() => onApproveDriver(driver.id)}>Odobri</button>
            <button onClick={() => onRejectDriver(driver.id)}>Odbij</button>
          </li>
        ))}
      </ul>
      <h4>Odobreni vozači:</h4>
      <ul>
        {drivers.filter(driver => driver.status === 'approved').map((driver, index) => (
          <li key={index}>
            {driver.name} - Prosečna ocena: {driver.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
