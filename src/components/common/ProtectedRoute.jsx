import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ isAuthenticated, isLoading, children }) {
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)'
      }}>
        <Loader2 size={36} className="spin-anim text-blue-500" style={{ animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Verifying MoSPI Officer Credentials...</div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
