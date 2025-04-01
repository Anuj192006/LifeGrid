import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (user && isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleAuth = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (currState === "Sign Up") {
        // Sign Up logic
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(user => user.username === username);
        
        if (userExists) {
          throw new Error("Username already exists");
        }

        const newUser = { username, password };
        localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true'); // Add login flag
      } else {
        // Login logic
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = existingUsers.find(
          user => user.username === username && user.password === password
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true'); // Add login flag
      }

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
        <h2>{currState}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input 
          type="text" 
          placeholder='Username' 
          className="form-input" 
          ref={usernameRef}
          required 
        />
        
        <input 
          type="password" 
          placeholder='Password' 
          className="form-input" 
          ref={passwordRef}
          required 
        />
        
        <button 
          type='submit'
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Processing...' : currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        
        <div className="login-toggle">
          {currState === "Sign Up" ? (
            <p>
              Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          ) : (
            <p>
              Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign up</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;