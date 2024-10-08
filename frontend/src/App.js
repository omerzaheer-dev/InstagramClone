// import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
import SignInPage from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Unauthorized from "./pages/Unauthorized";
import Unverified from "./pages/Unverified";
import User from "./pages/User";
import Admin from "./pages/Admin";
import LinkPage from "./pages/LinkPage";
import RequireAuth from "./components/RequireAuth";
import PersistentLogin from "./components/PersistentLogin"
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<SignInPage />} />
        <Route path="register" element={<SignUp />} />
        <Route path="" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<PersistentLogin />}>
          <Route element={<RequireAuth allowedRoles={["unverified"]} />}>
            <Route path="unverified" element={<Unverified />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["user","admin"]} />}>
            <Route path="user" element={<User />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>

        {/* catch all */}
        {/* <Route path="*" element={<Missing />} /> */}
      </Route>
    </Routes>
  );
}

export default App;