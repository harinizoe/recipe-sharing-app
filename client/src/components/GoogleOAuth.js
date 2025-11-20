import React, { useEffect } from 'react';

const GoogleOAuth = ({ onSuccess, onError }) => {
  useEffect(() => {
    // Initialize Google Identity Services
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signup_with',
          logo_alignment: 'left',
          width: '100%',
        }
      );
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      const userData = {
        googleId: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        token: response.credential
      };

      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  return (
    <div className="google-oauth-container">
      <div className="text-center mb-3">
        <span className="text-muted">or</span>
      </div>
      <div id="google-signin-button" className="d-flex justify-content-center"></div>
    </div>
  );
};

export default GoogleOAuth;
