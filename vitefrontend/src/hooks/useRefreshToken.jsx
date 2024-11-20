import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()
    const refreshToken = async () => {
        const response = await axios.get('/api/v1/users/refresh-token', {
            withCredentials: true,
        })
        if (response?.data) {
            const { username, role, isVerified, bio, gender, bookmarks, email, _id, following, profilePicture, fullName } = response?.data?.data?.user;
            const { accesstoken } = response?.data?.data;
            setAuth({ username, role, bio, gender, following, isVerified, bookmarks, email, _id, accesstoken, profilePicture, fullName })
            return response?.data?.data?.accesstoken;
        }
    }
    return refreshToken
}
export default useRefreshToken
