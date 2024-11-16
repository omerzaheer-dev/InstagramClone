import axios from '@/api/axios';
import { useEffect, useState } from 'react'
import useAuth from './useAuth';

export const useGetUserProfile = (userId) => {
    const { setUserProfile, userProfile } = useAuth()
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/v1/users/${userId}/profile`);
                setUserProfile(response?.data?.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile()
    }, [userId])
}
