import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api/axios';
import { useAuth } from '../context/AuthContext';
import { SplitAuthLayout } from '../components/layout/SplitAuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Simple email format check (avoids relying on browser-native type="email" validation)
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // --- Custom JS validation (replaces browser-native `required` / `minLength` tooltips) ---
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please create a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    // -------------------------------------------------------------------------

    setLoading(true);
    try {
      await api.post('/api/auth/signup', { name, email, password });
      await checkAuth();
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      navigate(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitAuthLayout
      title="Create an account"
      subtitle="Join Stayora to curate your exclusive travel experiences."
      imageSrc="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop"
    >
      {/* noValidate suppresses any remaining browser-native validation UI */}
      <form onSubmit={handleSignup} className="space-y-6" noValidate>
        {error && (
          <div className="p-4 bg-stayora-red/10 text-stayora-red rounded-none text-xs font-semibold">
            {error}
          </div>
        )}
        <Input 
          id="name"
          type="text" 
          label="Full name" 
          placeholder="Enter your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          placeholder="Create a password (min. 6 characters)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button 
          type="submit" 
          className="w-full text-xs font-bold uppercase tracking-widest bg-stayora-black text-white hover:bg-stayora-black/85 transition-colors py-4" 
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up ↗'}
        </Button>
      </form>
      <div className="mt-6 text-center text-xs text-stayora-black/60 font-medium">
        Already have an account? <Link to="/login" className="text-stayora-red font-bold hover:underline">Log in</Link>
      </div>
    </SplitAuthLayout>
  );
};
