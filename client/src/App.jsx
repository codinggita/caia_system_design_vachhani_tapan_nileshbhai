import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import api from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'dashboard'
  const [user, setUser] = useState(null);

  // Check if user session already exists
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div>
      {/* HEADER BAR */}
      <header className="neo-border" style={{ backgroundColor: '#ffffff', borderBottom: '4px solid #000', padding: '15px 0' }}>
        <div className="container flex-row-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              🏛️ CAIA <span style={{ backgroundColor: 'var(--neo-yellow)', padding: '2px 8px', border: '2px solid #000' }}>SYSTEM DESIGN</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <div className="neo-border" style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 'bold', backgroundColor: user.role === 'admin' ? 'var(--neo-orange)' : 'var(--neo-teal)' }}>
                  {user.role.toUpperCase()}: {user.name}
                </div>
                <button 
                  className="neo-btn" 
                  style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: 'var(--neo-red)' }} 
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </>
            ) : (
              currentView !== 'login' && (
                <button 
                  className="neo-btn yellow" 
                  style={{ padding: '8px 16px', fontSize: '14px' }} 
                  onClick={() => setCurrentView('login')}
                >
                  Enter App →
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* CORE SCREEN CONTENT */}
      {currentView === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentView('login')} />
      )}

      {currentView === 'login' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onBackToLanding={() => setCurrentView('landing')} 
        />
      )}

      {currentView === 'dashboard' && user && (
        <Dashboard user={user} onSignOut={handleSignOut} />
      )}
    </div>
  );
}

export default App;
