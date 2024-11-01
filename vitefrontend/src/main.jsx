import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import store from "./redux/store"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        </Provider>
    </BrowserRouter>
  </StrictMode>,
)
