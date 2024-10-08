import React , {useEffect, useState} from 'react'
import {useLocation , useNavigate} from "react-router-dom"
import useLogout from '../hooks/useLogout'
// import axios from "../api/axios"
// import useRefreshToken from "../hooks/useRefreshToken"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
const Unverified = () => {
  const logout = useLogout()
  const [users,setUsers]= useState([])
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()
  const navigate = useNavigate()
  // const refresh = useRefreshToken()
  useEffect(()=>{
    let isMounted = true;
    let controller = new AbortController()
    const getUsersFunction = async () => {
      try {
        const response = await axiosPrivate.get('/api/v1/try/users',{
          signal:controller.signal,
        })
        if (isMounted && response?.data?.data) {
          setUsers(response.data.data);
          console.log(response);
        }
      } catch (error) {
        console.log("errooooo",error)
        await logout()
        navigate("/login",{state:{from:location},replace:true})
      }
    }
    getUsersFunction()
    return () => {
      isMounted=false;
      controller.abort()
    }
  },[])
  return (
    <div className='p-4'>
      {
        users.length ? 
        (
          <div>
            {
              users.map((item,index)=>{
                return (
                  <div key={index}>
                    {item.username}
                  </div>
                )
              })
            }
            {/* <button onClick={()=>refresh()}>ref</button> */}
          </div>
        )
        :
        <p>no user found</p>
      }
    </div>
  )
}

export default Unverified
