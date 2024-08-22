import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Styles/ALL.css";
import Login from "./Components/Login";
import { ToastContainer, toast } from 'react-toastify';
import PrivateRoute from './Components/PrivateRoute';
import Register from "./Components/Register";
import PrivateRouteA from './Components/PrivateRouteA';
import GoogleRegister from "./Components/GoogleRegister";
import HomePage from "./Components/Register";
import Profile from "./Components/Profile";
import ChangePassword from "./Components/ChangePassword";
import PreviousRides from "./Components/User/PreviousRides";
import NewRideForm from "./Components/User/NewRideForm";
import AdminPanel from "./Components/Admin/AdminPanel";
import VerifyDrivers from "./Components/Admin/VerifyDrivers";
import DriverPreviousRides from "./Components/Driver/DriverPreviousRides";
import DriverNewRidesList from "./Components/Driver/DriverNewRidesList";
import RideCountdown from "./Components/User/RideCountdown";
import Unauthorized from "./Components/Unathorized";
import Header from "./Components/Header";


function App() {
  const navigate = useNavigate();

  return (
    <div><Header/>
    <div className="App">
      <ToastContainer position='top-right' autoClose={3000}/>

      <header className="App-header">
        <Routes>

        <Route path='/' element={<Login/>}/> 
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/googleregister' element= {<GoogleRegister/>}/>
        <Route path='/unauthorized' element= {<Unauthorized/>}/>
        <Route path='/inprogress' element= {<PrivateRoute allowedRoles={['User']}><RideCountdown/></PrivateRoute>}/>
        <Route path='/home' element={<PrivateRoute allowedRoles={['Admin','User','Driver']}><HomePage/></PrivateRoute>}/>
        <Route path='/home/previousRides' element={<PrivateRoute allowedRoles={['User']}><PreviousRides/></PrivateRoute>}/>
        <Route path='/home/newRide' element={<PrivateRoute allowedRoles={['User']}><NewRideForm/></PrivateRoute>}/>
        <Route path='/home/profile' element={<Profile/>} />
        <Route path='/home/changePassword' element={<ChangePassword/>}/>
        <Route path='/home/admin/adminPanel' element={<PrivateRoute allowedRoles={['Admin']}><AdminPanel/></PrivateRoute>}/>
        <Route path='/home/admin/verifyDrivers' element={<PrivateRoute allowedRoles={['Admin']}><VerifyDrivers/></PrivateRoute>}/>
        <Route path='/home/driver/previousRides' element={<PrivateRoute allowedRoles={['Driver']}><DriverPreviousRides/></PrivateRoute>} />
        <Route path='/home/driver/newRides' element={<PrivateRoute allowedRoles={['Driver']}><DriverNewRidesList/></PrivateRoute>} />
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;
