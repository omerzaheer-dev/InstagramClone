import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignInPage from "../pages/SignInPage";
import SignUp from "../pages/SignUpPage";
import Unauthorized from "../pages/Unauthorized";
import Unverified from "../pages/Unverified";
import User from "../pages/User";
import Admin from "../pages/Admin";
import Layout from "../Layout";
import LinkPage from "../pages/LinkPage";
import RequireAuth from "../components/RequireAuth";
import PersistentLogin from "../components/PersistentLogin"
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "login",
          element: <SignInPage />,
        },
        {
            path: "register",
            element: <SignUp />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
        {
          path: "",
          element: <LinkPage />,
        },
        {
          path: "",
          element: <PersistentLogin />,
          children: [
            {
              path: "",
              element: <RequireAuth allowedRoles={["unverified"]} />,
              children: [
                {
                  path: "unverified",
                  element: <Unverified />,
                },
                {
                    path: "user",
                    element: <User />,
                },
              ]
            },
            {
              path: "",
              element: <RequireAuth allowedRoles={["admin"]} />,
              children: [
                {
                  path: "admin",
                  element: <Admin />,
                },
              ]
            },  
          ]
        },
      ],
    },
  ]);
  export default router;