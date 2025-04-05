// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Home from './Components/Home/Home.jsx';
import Portfolio from './Components/Portfolio/Portfolio.jsx';
import Body from './Components/Addtask/Body.jsx';
import Login from './Login/Login.jsx';
import Loader from './Components/Loader/Loader.jsx'; // Import the Loader component
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Loader />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/add-task" element={<Body />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
