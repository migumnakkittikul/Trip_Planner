import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/LoginSignup.module.css';

export default function LoginSignup() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ userId: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //login
  const handleLogin = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    if (password !== 'test123') {
      setError('Invalid password');
      return;
    }
    
    fetch(`https://travel-planner-440113.uc.r.appspot.com/users/email/${loginData.email}`)
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          navigate(`/users/${data.data.user_id}/plans`);
        } else {
          setError('User not found');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        setError('Login failed');
      });
  };

  //signup
  const handleSignup = (e) => {
    e.preventDefault();
    
    // Prepare payload with proper types
    const payload = {
      user_name: signupData.username,
      email: signupData.email,  
      phone: signupData.phone ? Number(signupData.phone) : undefined 
    };
  
    fetch('https://travel-planner-440113.uc.r.appspot.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.data?.user_id) {
          navigate(`/users/${data.data.user_id}/plans`);
        } else {
          setError(data.message || 'Signup failed');
          console.error('Signup response:', data);
        }
      })
      .catch(error => {
        console.error('Signup error:', error);
        setError('Signup failed: ' + error.message);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Travel Planner</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'signup' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                placeholder="Password"
              />
            </div>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className={styles.inputGroup}>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={styles.input}
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              />
              <input
                id="phone"
                name="phone"
                type="tel"
                className={styles.input}
                placeholder="Phone"
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
              />
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}