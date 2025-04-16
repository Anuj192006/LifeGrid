import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', '[]');
    }
  }, []);

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
      let existingUsers;
      try {
        existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (!Array.isArray(existingUsers)) {
          throw new Error('Invalid users data format');
        }
      } catch (err) {
        existingUsers = [];
        localStorage.setItem('users', '[]');
      }

      if (currState === "Sign Up") {
        const userExists = existingUsers.some(user => user.username === username);
        
        if (userExists) {
          throw new Error("Username already exists");
        }
        const newUser = { 
          username, 
          password, 
          todos: [] 
        };
        localStorage.setItem(
          'users', 
          JSON.stringify([...existingUsers, newUser])
        );
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));

      } else {
        const user = existingUsers.find(
          user => user.username === username && user.password === password
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }
        const currentUserData = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = {...user,todos: currentUserData.todos || []};

        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('isLoggedIn', 'true');
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
        <input type="text" placeholder='Username' className="form-input" ref={usernameRef}required />
        <input type="password" placeholder='Password' className="form-input" ref={passwordRef} required/>
        <button type='submit'className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-toggle">
          {currState === "Sign Up" ? 
          (<p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>)
            : 
          (<p> Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign up</span></p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;