import React, { useState } from 'react';
import api from '../services/api';

const LoginPage = ({ onLoginSuccess, onBackToLanding }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // Default to standard user
  
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Quick-login: auto-register (if needed) and login in one click
  const handleAutofill = async (type) => {
    const credentials = type === 'admin'
      ? { email: 'admin@caia.com', password: 'admin1234', name: 'Admin User', role: 'admin' }
      : { email: 'user@caia.com', password: 'user1234', name: 'Standard User', role: 'user' };

    // Autofill the visible form fields
    setEmail(credentials.email);
    setPassword(credentials.password);
    setRole(credentials.role);
    setName(credentials.name);

    setFeedback({ type: 'success', message: `Signing in as ${type}...` });
    setLoading(true);

    try {
      // Step 1: Try to login directly
      let res;
      try {
        res = await api.post('/auth/login', { email: credentials.email, password: credentials.password });
      } catch (loginErr) {
        // If 401 (user not found / wrong password), try registering first
        if (loginErr.response && (loginErr.response.status === 401 || loginErr.response.status === 404)) {
          try {
            await api.post('/auth/register', credentials);
            // Now login after successful registration
            res = await api.post('/auth/login', { email: credentials.email, password: credentials.password });
          } catch (regErr) {
            // If 409 conflict (already exists), the password might be wrong
            if (regErr.response && regErr.response.status === 409) {
              // User exists but password doesn't match - could be re-seeded with different password
              throw loginErr; // re-throw original login error
            }
            throw regErr;
          }
        } else if (!loginErr.response) {
          // Network error — backend offline, use mock session
          throw loginErr;
        } else {
          throw loginErr;
        }
      }

      // Login succeeded
      setLoading(false);
      const resData = res.data;
      const userData = {
        name: resData.data.name,
        email: resData.data.email,
        role: resData.data.role,
        token: resData.accessToken,
        refreshToken: resData.refreshToken,
        _id: resData.data._id
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setFeedback({ type: 'success', message: `Logged in as ${credentials.name}! Redirecting...` });

      setTimeout(() => {
        onLoginSuccess(userData);
      }, 600);

    } catch (err) {
      // Fallback: if backend is offline, use mock session
      if (!err.response) {
        console.warn("Backend not running. Using offline mock session...");
        setLoading(false);
        const userData = {
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
          token: 'mock-jwt-token-xyz-123',
          isOfflineMock: true
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setFeedback({ type: 'success', message: 'Server offline. Logged in with Offline Mock Session!' });
        setTimeout(() => {
          onLoginSuccess(userData);
        }, 800);
      } else {
        setLoading(false);
        setFeedback({
          type: 'error',
          message: err.response?.data?.error || `Failed to sign in as ${type}. Try using the form manually.`
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);

    // Validation
    if (!email || !password || (!isLoginTab && !name)) {
      setFeedback({
        type: 'error',
        message: 'All fields are required'
      });
      return;
    }

    setLoading(true);

    // Make real authentication API request
    api.post(isLoginTab ? '/auth/login' : '/auth/register', {
      name,
      email,
      password,
      role
    })
    .then((res) => {
      setLoading(false);
      const resData = res.data;
      const userData = {
        name: resData.data.name,
        email: resData.data.email,
        role: resData.data.role,
        token: resData.accessToken,
        refreshToken: resData.refreshToken,
        _id: resData.data._id
      };

      localStorage.setItem('user', JSON.stringify(userData));

      setFeedback({
        type: 'success',
        message: isLoginTab ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...'
      });

      // Pass user data up to App state after a small delay
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 800);
    })
    .catch((err) => {
      // If it's a network error (backend not running), fall back to mock for testing
      if (!err.response) {
        console.warn("Backend not running. Falling back to offline mock session for testing...");
        setTimeout(() => {
          setLoading(false);
          const userData = {
            name: isLoginTab ? (email.split('@')[0]) : name,
            email,
            role,
            token: 'mock-jwt-token-xyz-123',
            isOfflineMock: true
          };

          localStorage.setItem('user', JSON.stringify(userData));

          setFeedback({
            type: 'success',
            message: 'Server offline. Logged in with Offline Mock Session!'
          });

          setTimeout(() => {
            onLoginSuccess(userData);
          }, 1000);
        }, 800);
      } else {
        setLoading(false);
        setFeedback({
          type: 'error',
          message: err.response.data.error || 'Authentication failed'
        });
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* BACK BUTTON */}
        <button 
          className="neo-btn" 
          style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '14px', backgroundColor: '#ffffff' }}
          onClick={onBackToLanding}
        >
          ← Back to Info
        </button>

        {/* BRUTALIST AUTH CARD */}
        <div className="neo-card" style={{ padding: '0px', overflow: 'hidden' }}>
          
          {/* TAB HEADER */}
          <div style={{ display: 'flex', borderBottom: '4px solid #000000' }}>
            <button 
              style={{
                flex: 1,
                padding: '16px',
                fontWeight: 'bold',
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isLoginTab ? 'var(--neo-yellow)' : '#ffffff',
                borderRight: '4px solid #000000',
                outline: 'none'
              }}
              onClick={() => { setIsLoginTab(true); setFeedback(null); }}
            >
              LOGIN
            </button>
            <button 
              style={{
                flex: 1,
                padding: '16px',
                fontWeight: 'bold',
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: !isLoginTab ? 'var(--neo-yellow)' : '#ffffff',
                outline: 'none'
              }}
              onClick={() => { setIsLoginTab(false); setFeedback(null); }}
            >
              REGISTER
            </button>
          </div>

          <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '20px', textTransform: 'uppercase' }}>
              {isLoginTab ? 'Enter Credentials' : 'Create Account'}
            </h2>

            {/* QUICK PRE-SET PROFILE TOGGLES */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--neo-light-gray)', border: '3px solid #000' }}>
              <p style={{ fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Quick Test Autofills:
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="neo-btn teal" 
                  style={{ padding: '6px 12px', fontSize: '12px', boxShadow: '2px 2px 0px #000' }}
                  onClick={() => handleAutofill('user')}
                >
                  Standard User Profile
                </button>
                <button 
                  type="button" 
                  className="neo-btn orange" 
                  style={{ padding: '6px 12px', fontSize: '12px', boxShadow: '2px 2px 0px #000' }}
                  onClick={() => handleAutofill('admin')}
                >
                  Admin Profile
                </button>
              </div>
            </div>

            {/* FEEDBACK BANNER */}
            {feedback && (
              <div 
                className="neo-border" 
                style={{
                  backgroundColor: feedback.type === 'success' ? 'var(--neo-green)' : 'var(--neo-red)',
                  padding: '12px 16px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  boxShadow: '3px 3px 0px #000'
                }}
              >
                {feedback.message}
              </div>
            )}

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit}>
              
              {!isLoginTab && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  type="email" 
                  className="neo-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
                <input 
                  type="password" 
                  className="neo-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Testing User Role</label>
                <select 
                  className="neo-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="user">Standard User (Read-Only Explorer)</option>
                  <option value="admin">System Admin (Full Access & Controls)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="neo-btn yellow" 
                style={{ width: '100%', padding: '14px', fontSize: '18px', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? 'PROCESSING...' : isLoginTab ? 'SIGN IN →' : 'REGISTER NOW →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
