import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api/axios';
import { useAuth } from '../context/AuthContext';
import { SplitAuthLayout } from '../components/layout/SplitAuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Simple email format check (avoids relying on browser-native type="email" validation)
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // --- Custom JS validation (replaces browser-native `required` tooltips) ---
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    // -------------------------------------------------------------------------

    setLoading(true);
    try {
      await api.post('/api/auth/login', { email, password });
      await checkAuth();
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      navigate(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitAuthLayout
      title="Welcome back"
      subtitle="Log in to access your bookings and listings."
      imageSrc="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
    >
      {/* noValidate suppresses any remaining browser-native validation UI */}
      <form onSubmit={handleLogin} className="space-y-6" noValidate>
        {error && (
          <div className="p-4 bg-stayora-red/10 text-stayora-red rounded-none text-xs font-semibold">
            {error}
          </div>
        )}
        <Input 
          id="email"
          type="email" 
          label="Email address" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Input 
          id="password"
          type="password" 
          label="Password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button 
          type="submit" 
          className="w-full text-xs font-bold uppercase tracking-widest bg-stayora-black text-white hover:bg-stayora-black/85 transition-colors py-4"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In ↗'}
        </Button>
      </form>
      <div className="mt-6 text-center text-xs text-stayora-black/60 font-medium">
        Don't have an account? <Link to="/signup" className="text-stayora-red font-bold hover:underline">Sign up</Link>
      </div>
    </SplitAuthLayout>
  );
};
