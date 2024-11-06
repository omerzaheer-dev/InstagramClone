import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { store } from "./redux/store"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {
  persistStore,
} from 'redux-persist'
import { AuthProvider } from './context/AuthProvider'
import { Toaster } from "@/components/ui/toaster"

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
          <Toaster />
        </PersistGate>
      </Provider>
    </AuthProvider>
  </BrowserRouter>
  // </StrictMode>,
)
