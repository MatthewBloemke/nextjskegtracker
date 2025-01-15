'use client';

import { useState } from 'react';
import { useAuth } from '@/app/utils/AuthContext';

export default function GrantAccessPage() {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGrantAccess = async () => {
    try {
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/set-allowed-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Access granted to ${email}`);
        setEmail('');
        setError(null);
      } else {
        setError(data.error || 'Failed to grant access');
      }
    } catch (err) {
      console.error('Error granting access:', err);
      setError('Failed to grant access. Please try again.');
    }
  };

  if (!isAdmin) return <p>Access denied. Admins only.</p>;

  return (
    <div>
      <h1>Grant Access</h1>
      <input
        type="email"
        placeholder="Enter user's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleGrantAccess}>Grant Access</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
