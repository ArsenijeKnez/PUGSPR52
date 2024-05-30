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
import RideConfirmation from "./Components/Passenger/RideConfirmation";
import AdminPanel from "./Components/Admin/AdminPanel";


function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <ToastContainer position='top-right' autoClose={3000}/>

      <header className="App-header">
        <Routes>

        <Route path='/' element={<PrivateRouteA><Login/></PrivateRouteA>}/> 
        <Route path='/login' element={<PrivateRouteA><Login/></PrivateRouteA>}/>
        <Route path='/register' element={<PrivateRouteA><Register/></PrivateRouteA>}/>
        <Route path='/googleregister' element= {<PrivateRouteA><GoogleRegister/></PrivateRouteA>}/>
        <Route path='/home' element={<PrivateRoute allowedRoles={['admin','seller','buyer']}><HomePage/></PrivateRoute>}>
            <Route path='profile' element={<Profile/>} />
            <Route path='changePassword' element={<ChangePassword/>}/>
            <Route path='rideConfirmation' element={<RideConfirmation/>}/>
            <Route path='adminPanel' element={<AdminPanel/>}/>
        </Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
