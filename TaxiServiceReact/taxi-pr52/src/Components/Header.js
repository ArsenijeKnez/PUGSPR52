import '../Styles/ALL.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetUserRole } from '../Services/UserService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {User , getUserFromLocalStorage} from "../Model/User";

function Header() {
    const nav = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [verified, setVerified] = useState(null);

    const location = useLocation();
    
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encodedtoken');
        localStorage.removeItem('googleuser');
        setUserRole('');
        localStorage.setItem('inProgress', false);
        nav('/login');
    }
    useEffect(() => {
        setUserRole('');
        const currentPath = location.pathname;
        if(currentPath === '/login' || currentPath === '/register' || currentPath === '/googleregister' || currentPath === '/inprogress'){
            return;
        }
        var token = localStorage.getItem('token');
        var user =  getUserFromLocalStorage();
        if (token && user) {
            setUserRole(user.Role());
            setVerified(user.isVerified());
        }
    }, [])
    return (
        <div style={{ backgroundColor: '#000000' }}>
            <Nav style={{ borderBottom: '3px solid #b0b0b0' }} >
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/adminPanel' className={` nav-link  ${location.pathname === '/home/admin/adminPanel' ? 'active link-light ' : 'link-light hoverLink '}`}>
                            Pannel
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/verifyDrivers' className={`nav-link  ${location.pathname === '/home/admin/verifyDrivers' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Verifications
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/previousRides' className={`nav-link  ${location.pathname === '/home/previousRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Passenger Pannel
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/newRide' className={`nav-link  ${location.pathname === '/home/newRide' ? 'active link-light' : 'link-light hoverLink '}`}>
                            New order
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Driver' && (
                    <Nav.Item>
                        <Link to='/home/driver/previousRides' className={`nav-link  ${location.pathname === '/home/driver/previousRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Previous Rides
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Driver' && (
                    <Nav.Item>
                        <Link to='/home/driver/newRides' className={`nav-link  ${location.pathname === '/home/driver/newRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            New Rides
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'Driver' && verified === 'false' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'red' }}>Account not verified!</Link>
                    </Nav.Item>

                )}

                {userRole === 'Driver' && verified === '' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'yellow' }}>Verification pending!</Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item className={`${userRole === 'Driver' ? '' : 'ms-auto'}`}>
                        <Link to='/home/profile' className={`nav-link  ${location.pathname === '/home/profile' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Edit profile
                        </Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item>
                        <Link to='/home/changePassword' className={`nav-link  ${location.pathname === '/home/changePassword' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Change password
                        </Link>
                    </Nav.Item>

                )}
                {userRole && (
                    <Nav.Item >
                        <Button variant="outline-success" onClick={logout} className='btn btn-link link-light text-decoration-none'>
                            Log out
                        </Button>
                    </Nav.Item>

                )}
            </Nav>
        </div>
        // <div style={{ height: '30px', width: '100%', backgroundColor: '#ededed', borderBottom: '3px solid #b0b0b0' }}>
        //     {userRole && <Link to='profile'>Edit profile</Link>}
        //     {userRole && <Link to='changePassword'>Change password</Link>}
        //     {userRole && <button onClick={logout}>Log out</button>}
        //     {userRole == 'admin' && <Link to='verification'>Verifications</Link>}
        //     {userRole == 'seller' && verified == 'false' && <Link>Account not verified!</Link>}
        //     {userRole == 'seller' && verified == '' && <Link>Verification pending!</Link>}
        //     {userRole == 'seller' && verified == 'true' && <> <Link>Account verified!</Link> <Link to='allproducts'>Add product</Link></>}
        //     {userRole == 'buyer' && <><Link to='neworder'>New order</Link></>}
        //     {userRole == 'admin' && <Link to='allorders'>Orders</Link>}
        //     {userRole == 'buyer' && <><Link to='allordersbuyer'>Previous orders</Link></>}
        //     {userRole == 'seller' && <><Link to='allordersseller'>Orders</Link></>}
        //     {/*userRole==="buyer" && <li><Link className='meni' to="addproduct">Dodavanje artikla</Link></li>*/}
        // </div>
    )
}
export default Header;