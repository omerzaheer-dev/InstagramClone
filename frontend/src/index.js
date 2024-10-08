import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import { RouterProvider } from 'react-router-dom';
// import router from "./routes/index"
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material/styles';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
// }

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
        {/* <RouterProvider router={router} /> */}
    </StyledEngineProvider>
  // </React.StrictMode>
);
reportWebVitals();
