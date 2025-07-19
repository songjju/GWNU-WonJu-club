// src/components/user/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // CSS 파일 임포트
import API_BASE_URL from '../config/apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const goToResetPassword = () => {
    navigate('/reset-password');
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/club_account/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.key) {
        localStorage.setItem('token', data.key);
        dispatch(loginSuccess({ email: email, token: data.key }));
        navigate('/');
      } else {
        throw new Error('로그인 실패');
      }
    } catch (error) {
      setEmail('');
      setPassword('');
      localStorage.clear();
      setErrors(true);
      dispatch(logout());
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-form">
            <h1>Login</h1>
            {loading === false && (
              <form onSubmit={onSubmit}>
                <div className="login-form-group">
                  <label htmlFor='email'>Email</label>
                  <input
                    name='email'
                    type='email'
                    className="login-form-control"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="login-form-group">
                  <label htmlFor='password'>Password</label>
                  <input
                    name='password'
                    type='password'
                    className="login-form-control"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                {errors === true && <h2 className="text-danger">Cannot log in with provided credentials</h2>}
                <button type="submit" className="btn btn-primary">Sign In</button>
                <button type="button" className="btn btn-secondary" onClick={goToResetPassword}>Forgot Password?</button>
              </form>
            )}
          </div>
          <div className="login-image"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
