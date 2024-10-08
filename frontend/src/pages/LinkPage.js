import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useLogout from '../hooks/useLogout';
const LinkPage = () => {
  const navigate = useNavigate();
  const logout = useLogout()
  const handleLogout = async () => {
    await logout();
    navigate('/')
  }
  return (
    <div className='px-6 mt-4 flex gap-7 items-center justify-center'>
      <div>
      <Link className='text-white no-underline' to="/unverified">Unverified</Link>
      </div>
      <div>
      <Link className='text-white no-underline' to="/user">User</Link>
      </div>
      <div>
      <Link className='text-white no-underline' to="/admin">Admin</Link>
      </div>
      <button onClick={async()=>await handleLogout()}>Loggout</button>
    </div>
  )
}
export default LinkPage
