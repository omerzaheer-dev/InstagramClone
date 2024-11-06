import { toast } from "./use-toast"
import axios from "../api/axios"
import useAuth from "./useAuth"
const useLogout = () => {
    const { setAuth } = useAuth()
    const logout = async () => {
        setAuth({})
        try {
            const response = await axios.get('/api/v1/users/log-out-user', {
                withCredentials: true
            });
            console.log(response);
        } catch (error) {
            toast.error("Error while logging out user");
        }
    }
    return logout;
}
export default useLogout