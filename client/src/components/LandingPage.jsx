import React from 'react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. TOP MARQUEE */}
      <div className="marquee-container">
        <div className="marquee-content">
          ⚡ System Design Explorer • Microservices Architecture • Distributed Databases • Cache Strategies • API Gateways • Consistent Hashing • Load Balancing • ⚡
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div className="container" style={{ marginTop: '60px' }}>
        <div className="neo-card yellow" style={{ padding: '60px 40px', marginBottom: '60px', borderRadius: '0px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '6px 12px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Space Mono', marginBottom: '20px' }}>
            VERSION 2.1.0 • PRODUCTION READY
          </div>
          <h1 style={{ fontSize: '4.5rem', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '-1px' }}>
            CAIA SYSTEM DESIGN <br />
            <span style={{ backgroundColor: '#fff', color: '#000', padding: '0 10px', border: '4px solid #000', display: 'inline-block', marginTop: '10px' }}>KNOWLEDGE BASE</span>
          </h1>
          <p style={{ fontSize: '1.25rem', fontWeight: '500', maxWidth: '800px', lineHeight: '1.6', marginBottom: '30px' }}>
            A high-performance interactive playbook designed to master distributed system-design interviews. Built with advanced validation sandboxes, simulated error consoles, and lightweight API capability checking.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button className="neo-btn teal" style={{ padding: '16px 36px', fontSize: '1.1rem' }} onClick={onGetStarted}>
              Enter Platform →
            </button>
            <a 
              href="https://github.com/Vachhani-Tapan/caia_system_design" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="neo-btn" 
              style={{ padding: '16px 36px', fontSize: '1.1rem', backgroundColor: '#ffffff' }}
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>

      {/* 3. PLATFORM STATS */}
      <div className="container" style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div className="neo-border" style={{ flex: 1, minWidth: '220px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '4px 4px 0px #000' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>50+</h3>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', color: 'var(--neo-gray)' }}>API Endpoints</p>
          </div>
          <div className="neo-border" style={{ flex: 1, minWidth: '220px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '4px 4px 0px #000' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>100%</h3>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', color: 'var(--neo-gray)' }}>Validation Integrity</p>
          </div>
          <div className="neo-border" style={{ flex: 1, minWidth: '220px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '4px 4px 0px #000' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>5</h3>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', color: 'var(--neo-gray)' }}>Simulated Failures</p>
          </div>
          <div className="neo-border" style={{ flex: 1, minWidth: '220px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '4px 4px 0px #000' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>40</h3>
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', color: 'var(--neo-gray)' }}>HEAD & OPTIONS Checks</p>
          </div>
        </div>
      </div>

      {/* 4. CORE FEATURES SECTION */}
      <div className="container" style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '40px' }}>
          Platform Capabilities
        </h2>
        <div className="grid-cols-3">
          <div className="neo-card teal">
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Advanced Query & Search</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Query models via fuzzy keywords, exact string match, regex patterns, voice searches, categories, difficulty layers, and autocomplete suggestions.
            </p>
          </div>
          
          <div className="neo-card green">
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🛠️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Validation & Error Sandbox</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Inspect and build payload JSONs dynamically. Test validation error structures and simulate 404, 500, Mongo timeouts, and token expirations.
            </p>
          </div>

          <div className="neo-card lavender">
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🗒️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Collaborative Notebook</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Save system-design templates, bookmark popular patterns, and write rich concept-specific text notes stored in the Mongoose database.
            </p>
          </div>

          <div className="neo-card orange">
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🧬</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>HEAD & OPTIONS Inspector</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Make capability headers-only checks against 20 key REST endpoints. Fetch status counts and supported verbs using HTTP HEAD and OPTIONS protocols.
            </p>
          </div>

          <div className="neo-card yellow">
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Admin Panel Diagnostics</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Toggle global maintenance mode, inspect live audit logs, monitor hardware statistics (CPU/RAM/Uptime), and purge memory caches.
            </p>
          </div>

          <div className="neo-card" style={{ backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Bulk Operations</h3>
            <p style={{ lineHeight: '1.5', fontWeight: '500' }}>
              Perform batch creations, bulk content updates, and multi-concept deletes to simulate production-level data import pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* 5. TECH STACK PANEL */}
      <div className="container">
        <div className="neo-border" style={{ backgroundColor: '#ffffff', padding: '30px', textAlign: 'center', boxShadow: '5px 5px 0px #000' }}>
          <h4 style={{ textTransform: 'uppercase', fontSize: '14px', letterSpacing: '2px', marginBottom: '20px', color: 'var(--neo-gray)' }}>
            POWERED BY A ROBUST BACKEND STACK
          </h4>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span style={{ padding: '8px 16px', border: '3px solid #000', backgroundColor: 'var(--neo-yellow)' }}>React 18</span>
            <span style={{ padding: '8px 16px', border: '3px solid #000', backgroundColor: 'var(--neo-teal)' }}>Vite 5</span>
            <span style={{ padding: '8px 16px', border: '3px solid #000', backgroundColor: 'var(--neo-green)' }}>Node.js / Express</span>
            <span style={{ padding: '8px 16px', border: '3px solid #000', backgroundColor: 'var(--neo-lavender)' }}>MongoDB / Mongoose</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
