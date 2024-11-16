import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { store, persistor } from "./redux/store"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider } from './context/AuthProvider'
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
          <Toaster />
        </Provider>
      </PersistGate>
    </AuthProvider>
  </BrowserRouter>
  // </StrictMode>,
)
