import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../utils/firebase';

const OTPPage = ({ onVerified }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {},
    }, auth);
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setupRecaptcha();
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmation(confirmationResult);
      setSuccess('OTP sent!');
    } catch (err) {
      setError('Failed to send OTP');
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await confirmation.confirm(otp);
      setSuccess('Phone verified!');
      if (onVerified) onVerified();
    } catch (err) {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        {!confirmation ? (
          <form onSubmit={sendOTP}>
            <input
              type="tel"
              placeholder="Phone Number (+1234567890)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <div id="recaptcha-container"></div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPPage;
