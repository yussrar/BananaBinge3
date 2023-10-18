import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
    } else if (formData.name.length > 15) {
      setErrorMessage('Name should be less than 15 characters');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage('Invalid email format');
    } else if (formData.password.length > 20) {
      setErrorMessage('Password should be less than 20 characters');
    } else {
      try {
        const response = await fetch('https://banana-binge2.vercel.app/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.status === 200) {
            const successMessage = 'Registration successful! You can now log in.';
            navigate('/login?message=' + encodeURIComponent(successMessage));
        } else {
            setErrorMessage('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
    <div className="w-100" style={{ maxWidth: "300px" }}>
      <h2 style={{ margin: "50px" }}>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ marginBottom: "30px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ marginBottom: "30px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRegister}

          style={{ margin: "30px" }}
        >
          Register
        </button>
      </form>
      <p>
        Already a user? <a href="/login">Log in</a>
      </p>
    </div>
    </div>
  );
};

export default Register;
