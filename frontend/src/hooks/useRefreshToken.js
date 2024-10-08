import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const {setAuth} = useAuth()
    const refreshToken = async () => {
        const response = await axios.get('/api/v1/users/refresh-token',{
            withCredentials:true,
        })
        const {username,role,isVerified,email,_id}=response?.data?.data?.user;
        const {accesstoken}=response?.data?.data;
        setAuth({username,role,isVerified,email,_id,accesstoken})
        // console.log("new",response?.data?.data?.accesstoken)
        return response?.data?.data?.accesstoken;
    }
  return refreshToken
}

export default useRefreshToken
