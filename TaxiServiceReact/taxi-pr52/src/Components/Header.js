import '../Styles/ALL.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetUserRole } from '../Services/UserService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
function Header() {
    const nav = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [verified, setVerified] = useState(null);
    const [isGoogleUser,setIsGoogleUser] = useState('');

    const location = useLocation();
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encodedtoken');
        localStorage.removeItem('googleuser');
        setUserRole('');
        nav('/');
    }
    useEffect(() => {
        setUserRole('');
        const t = localStorage.getItem('googleuser');
        console.log(t);
        setIsGoogleUser(t);
        var token = localStorage.getItem('token');
        if (token) {
            const w = JSON.parse(token);
            const r = w['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (r == 'seller') {
                setVerified(w.verified.toLowerCase());
            }
            setUserRole(r);
        }

    }, [])
    return (
        <div style={{ backgroundColor: '#000000' }}>
            <Nav style={{ borderBottom: '3px solid #b0b0b0' }} >

                {userRole === 'admin' && (
                    <Nav.Item>

                        <Link to='verification' className={`nav-link  ${location.pathname === '/home/verification' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Verifications
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'passenger' && (
                    <Nav.Item>
                        <Link to='neworder' className={`nav-link  ${location.pathname === '/home/rideConfirmation' ? 'active link-light' : 'link-light hoverLink '}`}>
                            New order
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'admin' && (
                    <Nav.Item>

                        <Link to='allorders' className={` nav-link  ${location.pathname === '/home/adminPanel' ? 'active link-light ' : 'link-light hoverLink '}`}>
                            Orders
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'driver' && verified === 'false' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'red' }}>Account not verified!</Link>
                    </Nav.Item>

                )}

                {userRole === 'driver' && verified === '' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'yellow' }}>Verification pending!</Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item className={`${userRole === 'driver' ? '' : 'ms-auto'}`}>
                        <Link to='profile' className={`nav-link  ${location.pathname === '/home/profile' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Edit profile
                        </Link>
                    </Nav.Item>
                )}
                {userRole && isGoogleUser==='false' && (
                    <Nav.Item>
                        <Link to='changePassword' className={`nav-link  ${location.pathname === '/home/changePassword' ? 'active link-light' : 'link-light hoverLink '}`}>
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