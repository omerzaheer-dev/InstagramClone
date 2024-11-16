import useAuth from '@/hooks/useAuth'
import { useGetUserProfile } from '@/hooks/useGetUserProfile'
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Profile = () => {
    const params = useParams()
    const { userId } = params
    useGetUserProfile(userId)
    const { userProfile } = useAuth()
    useEffect(() => {
        console.log("u", userProfile)
    }, [])
    return (
        <div>{userProfile?.username}</div>
    )
}

export default Profile