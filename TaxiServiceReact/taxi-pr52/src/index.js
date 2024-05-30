// index.js ili App.js (ulazna tačka vaše aplikacije)

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <BrowserRouter>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT}>
    <App />
  </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
