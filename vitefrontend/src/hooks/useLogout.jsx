import { toast } from "./use-toast"
import axios from "../api/axios"
import useAuth from "./useAuth"
import { useDispatch } from "react-redux"
import { reset } from "@/redux/postSlice"
const useLogout = () => {
    const { setAuth, setFollowing } = useAuth()
    const dispatch = useDispatch();
    const logout = async () => {
        try {
            const response = await axios.get('/api/v1/users/log-out-user', {
                withCredentials: true
            });
            setAuth({})
            setFollowing([]);
            dispatch(reset());
        } catch (error) {
            toast.error("Error while logging out user");
        }
    }
    return logout;
}
export default useLogout