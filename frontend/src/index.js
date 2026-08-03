  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import { GoogleOAuthProvider } from '@react-oauth/google';

  // REPLACE THIS with your actual Client ID from Step 1
  const clientId = "493921603660-kmdtuvgidbn5b9qq51j8maalbfif8tbr.apps.googleusercontent.com";

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <GoogleOAuthProvider clientId={clientId}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GoogleOAuthProvider>
  );