import { Link } from 'react-router-dom';
import '../../index.css';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; 
  };

  return (
    <header className="App-header">
      <h1 style={{ color: "white", textAlign: "center", marginRight: "2rem" }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>LifeGrid</Link>
      </h1>
      <ul>
        
        <li>
          <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        </li>
        <li>
          <Link to="/add-task" style={{ color: 'white', textDecoration: 'none' }}>Add task</Link>
        </li>
        <li>
          <Link to="/portfolio" style={{ color: 'white', textDecoration: 'none' }}>Portfolio</Link>
        </li>
        <li><Link to="/" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none' }}>Logout</Link></li>
      </ul>
    </header>
  );
}

export default Navbar;