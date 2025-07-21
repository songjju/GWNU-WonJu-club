import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage_Style/ChangePassword.css'
import { Col, Form, Button } from 'react-bootstrap';
import API_BASE_URL from '../config/apiConfig'; // API 설정 임포트

const PasswordChangeForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== repeatPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/club_account/password/change/`, {
        new_password1: newPassword,
        new_password2: repeatPassword
      }, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log(response.data);

      if (response.status === 200) {
        // Success message or redirect to another page
        window.location.replace(`${API_BASE_URL}/login`);
      } else {
        setErrorMessage(response.data.detail);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('An error occurred while changing password');
    }
  };


  return (
   <Form className="form-horizontal" onSubmit={handleSubmit}>
  <Form.Group className="change-password-form-group" controlId="new_password1">
    <Form.Label column sm={4}>현재 비밀번호</Form.Label>
    <Col sm={6}>
      <Form.Control
        className='new-password-input'
        type="password"
        placeholder="Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </Col>
  </Form.Group>

  <Form.Group className="change-password-form-group" controlId="new_password2">
    <Form.Label column sm={4}>현재 비밀번호 확인</Form.Label>
    <Col sm={6}>
      <Form.Control
        className='new-password-input'
        type="password"
        placeholder="Repeat password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        required
      />
    </Col>
  </Form.Group>

  <Form.Group  className='new-password-btn'>
    <Button type="submit" className="btn btn-default">새 비밀번호 설정</Button>
  </Form.Group>

  {errorMessage && <Form.Group>{errorMessage}</Form.Group>}
</Form>
  );
};

export default PasswordChangeForm;
