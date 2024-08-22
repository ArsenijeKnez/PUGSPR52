import React, { useState } from "react";
import {createRide} from "../../Services/RideService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewRideForm = () => {
  const navigate = useNavigate();
  const [podaci, setPodaci] = useState({
    startAddress: "",
    endAddress: "",
    price: 0,
    waitingTime: 0,
    userId: 0,
  });
  const [obrada, setObrada] = useState(false);

  const kreiranjeVoznje = async () => {
    if (podaci.startAddress.trim().length < 3) {
      toast.error("Unesite adresu polazne tačke!");
      return;
    }

    if (podaci.endAddress.trim().length < 3) {
      toast.error("Unesite adresu krajnje tačke!");
      return;
    }

    setObrada(true);
    const tokenS = localStorage.getItem('encodedToken');
    const token = tokenS ? JSON.parse(tokenS) : null;

    const voznja = await createRide(podaci, token);

    if (voznja.id !== 0) {
      localStorage.setItem('inProgress', true);
      navigate("/inprogress", { replace: true });
    } else {
      toast.error("Unable to order ride!");
    }

    setObrada(false);
  };

  const proracunCene = () => {
    console.log(podaci)
    if (podaci.startAddress.trim().length < 1) {
      toast.error("Unesite adresu polazne tačke!");
      return;
    }

    if (podaci.endAddress.trim().length < 1) {
      toast.error("Unesite adresu krajnje tačke!");
      return;
    }

    const cena = Math.random() * (5000 - 280) + 280;
    const vreme_cekenja = Math.random() * (60 - 10) + 10;
    const token = JSON.parse(localStorage.getItem('token'));

    setPodaci({
      ...podaci,
      price: Math.round(cena),
      waitingTime: Math.round(vreme_cekenja),
      userId: parseInt(token.id),
    });
  };

  return (
<div>
  <h2>Order New Ride</h2>
  <table>
    <tbody>
      <tr>
        <td>{podaci.price}</td>
        <td>dinara je cena vaše vožnje</td>
      </tr>
      <tr>
        <td>{podaci.waitingTime}</td>
        <td>sekundi je vreme dolaska vozača</td>
      </tr>
      <tr>
        <td>
          <label>Start Address</label>
        </td>
        <td>
          <input
            placeholder="From here"
            type="text"
            value={podaci.startAddress}
            onChange={(e) =>
              setPodaci({ ...podaci, startAddress: e.currentTarget.value })
            }
          />
        </td>
      </tr>
      <tr>
        <td>
          <label>Destination Address</label>
        </td>
        <td>
          <input
            placeholder="To there"
            type="text"
            value={podaci.endAddress}
            onChange={(e) =>
              setPodaci({ ...podaci, endAddress: e.currentTarget.value })
            }
          />
        </td>
      </tr>
      <tr>
        <td>
          <button type="button" onClick={proracunCene}>
            Calculate Price
          </button>
          </td>
          <td>
          <button type="button" onClick={kreiranjeVoznje}>
            Order
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  );
};

export default NewRideForm;
