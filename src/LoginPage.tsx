import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DEMO_ACCOUNTS = [
  { username: 'fajar', label: 'Pelapor (Fajar)', role: 'Pelapor' },
  { username: 'admin', label: 'Administrator', role: 'Administrator' },
  { username: 'budi', label: 'Teknisi (Budi)', role: 'Teknisi' },
  { username: 'manager', label: 'Facility Manager', role: 'Manajer Fasilitas' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username dan password harus diisi.');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Login gagal. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUsername: string) => {
    setIsLoading(true);
    setError('');
    setUsername(demoUsername);
    setPassword('password123');

    const result = await login(demoUsername, 'password123');

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Login gagal.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <h1>CampusCare</h1>
          <span className="login-subtitle">Campus Maintenance System</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Masuk ke Akun Anda</h2>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="login-demo">
          <h3>Demo Akun (Password: password123)</h3>
          <div className="demo-grid">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                className="demo-btn"
                onClick={() => handleDemoLogin(acc.username)}
                disabled={isLoading}
              >
                <span className="demo-role">{acc.role}</span>
                <span className="demo-label">{acc.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
