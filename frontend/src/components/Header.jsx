import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">MyApp</Link>
                <div className="ms-auto d-flex align-items-center gap-2">
                    {user ? (
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                                {user.profilePicture
                                    ? <img src={`http://localhost:5000${user.profilePicture}`} alt="avatar" className="rounded-circle" width="30" height="30" style={{objectFit:'cover'}} />
                                    : <span className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width:30,height:30,fontSize:14}}>{user.first_name?.[0]}</span>
                                }
                                {user.first_name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                            <Link className="btn btn-light btn-sm" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
