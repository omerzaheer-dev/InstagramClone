import {Outlet} from "react-router-dom"
import { useState , useEffect } from "react"
import useAuth from "../hooks/useAuth"
import useRefreshToken from "../hooks/useRefreshToken"
import useLocalStorage from "../hooks/useLocalStorage"

const PersistentLogin = () => {
    const [isLoading,setIsLoading] = useState(true)
    const {auth} = useAuth()
    const [persist] = useLocalStorage('persist',false);
    const refresh = useRefreshToken()
    useEffect(()=>{
        const verifyRefreshToken = async () => {
            try{
                await refresh()
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false)
            }
        }
        !auth.accesstoken ? verifyRefreshToken() : setIsLoading(false)
    },[])
  return (
    <>
      {
        !persist ?
        <Outlet/>
        :
        isLoading ?
        <p>Is Loading...</p>
        :
        <Outlet/>
      }
    </>
  )
}

export default PersistentLogin
