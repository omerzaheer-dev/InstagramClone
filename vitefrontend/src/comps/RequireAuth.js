// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { useEffect, useRef } from "react";




// const RequireAuth = ({ allowedRoles }) => {
//     const { auth } = useAuth()
//     const location = useLocation()
//     // const pathname = location?.state?.from?.pathname || "/";
//     return (
//         auth?.role?.find(role => allowedRoles.includes(role))
//             ?
//             <Outlet />
//             :
//             auth?._id
//                 ?
//                 <Navigate to="/unauthorized" replace={true} />
//                 :
//                 <Navigate to="/login" state={{ from: location }} replace />
//     )
// }
// export default RequireAuth;