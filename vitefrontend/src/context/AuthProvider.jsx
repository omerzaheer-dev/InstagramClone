import { createContext, useState } from "react";
const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [following, setFollowing] = useState([]);
    const [suggestedUser, setSuggestedUser] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    // const [persist,setPersist]= useState(JSON.parse(localStorage.getItem("persist")) || false);
    return (
        <AuthContext.Provider value={{ auth, setAuth, suggestedUser, following, setFollowing, setSuggestedUser, userProfile, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext;