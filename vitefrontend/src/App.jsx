import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import Unauthorized from "./pages/Unauthorized";
// import Unverified from "./pages/Unverified";
// import User from "./pages/User";
// import Admin from "./pages/Admin";
// import LinkPage from "./pages/LinkPage";
// import RequireAuth from "./comps/RequireAuth";
import Layout from './comps/Layout';
import { Routes, Route } from 'react-router-dom';
import Main from "./pages/Main";
import Home from "./pages/Home"
import PersistentLogin from "./comps/PersistentLogin";
import { useGetAllPosts } from "./hooks/useGetAllPosts";
import Profile from "./pages/Profile";

function App() {
  const getAllPosts = useGetAllPosts();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
        <Route element={<PersistentLogin />}>
          <Route element={<Main />}>
            <Route path="" element={<Home />} />
          </Route>
          <Route path="profile/:userId" element={<Profile />} />
        </Route>
        {/* <Route path="" element={<LinkPage />} /> */}
        {/* <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<PersistentLogin />}>
          <Route element={<RequireAuth allowedRoles={["unverified"]} />}>
            <Route path="unverified" element={<Unverified />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
            <Route path="user" element={<User />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="admin" element={<Admin />} />
          </Route> */}
      </Route>

      {/* catch all */}
      {/* <Route path="*" element={<Missing />} /> */}
      {/* </Route> */}
    </Routes>
  );
}

export default App;