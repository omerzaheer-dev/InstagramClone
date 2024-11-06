import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import useRefreshToken from "../hooks/useRefreshToken"

const PersistentLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()
  const refresh = useRefreshToken()
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
      } finally {
        setIsLoading(false)
        // console.clear();
      }
    }
    !auth?.accesstoken ? verifyRefreshToken() : setIsLoading(false)
  }, [])
  return (
    <>
      {
        isLoading ?
          <p>Is Loading...</p>
          :
          <Outlet />
      }
    </>
  )
}

export default PersistentLogin
