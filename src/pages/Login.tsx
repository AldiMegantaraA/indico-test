import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, AlertCircle } from 'lucide-react';
import { Toast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const setAuth = useStore((state) => state.setAuth);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setStep('verify');
  };

  const handleVerify = () => {
    try {
      const token = Math.random().toString(36).substring(2);
      setAuth({
        isAuthenticated: true,
        token,
        email,
      });
      setShowToast(true)
      setTimeout(() => {
        navigate('/inventory')
      }, 2000)
      
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <Toast 
        message="Authentication successful!" 
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {step === 'email' ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Sign in with Magic Link</h2>
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Magic Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Check your email</h2>
            <p className="text-gray-600 mb-8">
              We've sent a magic link to {email}
            </p>
            <button
              onClick={handleVerify}
              disabled={showToast}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showToast ? 'Loading...' : 'Simulate Magic Link Click'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}