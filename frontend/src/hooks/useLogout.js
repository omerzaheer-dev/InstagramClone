import axios from "../api/axios"
import useAuth from "./useAuth"
const useLogout = () => {
    const {setAuth}= useAuth()
    const logout = async () => {
        setAuth({})
        try {
            const response = await axios.get('/api/v1/users/log-out-user',{
                withCredentials:true
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
  return logout;
}
export default useLogout