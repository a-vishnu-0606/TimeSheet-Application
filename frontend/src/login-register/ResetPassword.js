import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; 

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing token.');
    }
  }, []);

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 15;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isValidLength = password.length >= minLength && password.length <= maxLength;

    setPasswordValid(hasUpperCase && hasLowerCase && hasDigit && isValidLength);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      alert('Please enter a valid password that meets the requirements.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password reset successful!');
        navigate('/');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to connect to the server.');
      alert('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handlePasswordReset}>
        <div className="input-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            required
            className={`password-input ${passwordValid ? 'valid' : 'invalid'}`}
          />
          {!passwordValid && newPassword && (
            <p className="password-requirements">
              Password must:
              <ul>
                <li>Be between 8 and 15 characters long</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one lowercase letter</li>
                <li>Contain at least one digit</li>
              </ul>
            </p>
          )}
        </div>
        <button type="submit" className="submit-button" disabled={!passwordValid}>Set Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
