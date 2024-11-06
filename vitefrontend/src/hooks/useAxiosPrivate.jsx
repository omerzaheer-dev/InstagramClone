import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  useEffect(() => {
    const requestInterceptors = axiosPrivate.interceptors.request.use(
      config => {
        console.log("Request config:", config);
        if (!config.headers["Authorization"]) {
          config.headers['Authorization'] = `Bearer ${auth?.accesstoken}`;
        }
        return config;
      }, (error) => Promise.reject(error)
    );

    const responseInterceptors = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?._retry) {
          prevRequest._retry = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error)
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptors);
      axiosPrivate.interceptors.response.eject(responseInterceptors);
    }
  }, [auth, refresh])

  return axiosPrivate;

}

export default useAxiosPrivate
