import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Login = () => {
  const API_URL = "http://localhost:8000/";
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const sanitizedUserName = sanitizeInput(name);
    const sanitizedPassword = sanitizeInput(password);

    setname('');
    setpassword('');

    try {
      const response = await fetch(`${API_URL}user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: sanitizedUserName, password: sanitizedPassword })
      });
      const data = await response.json();

      if (response.ok) {
        alert("success login");
        localStorage.setItem('user', JSON.stringify(data.user)); 
        if (data.user.role === "admin") {
          navigate('/dashboard');
        } else {
          navigate('/employee/newlog');
        }
      } else {
        alert("invalid details");
      }
    } catch (error) {
      alert('Failed to connect to the server.');
      console.error(error);
    }
  };

  return (
    <form className='login' onSubmit={(e) => e.preventDefault()}>
      <div className='container'>
        <label className='heading'>Login</label>
        <label>Enter Email: </label>
        <input 
          type='text'
          maxLength={50} 
          required
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder='Enter Email'
          className='input'
        />
        <label>Enter Password: </label>
        <input
          type='password'
          maxLength={20}
          required
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          placeholder='Enter Password'
          className='input'
        />
        <div className='button'>
          <button
            type='submit'
            onClick={handlesubmit} 
          >Login</button>
        </div>
      </div>
    </form>
  );
};

export default Login;
