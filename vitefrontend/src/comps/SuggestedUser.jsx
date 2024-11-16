import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SuggestedSingleUser from './SuggestedSingleUser'
import { useDispatch } from 'react-redux';
import axios from '@/api/axios';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
const SuggestedUser = () => {
    const dispatch = useDispatch();
    const { auth } = useAuth();
    const { setSuggestedUser, suggestedUser } = useAuth();
    const setSuggestedUsers = async () => {
        try {
            let id;
            id = auth?._id ? auth?._id : "";
            const response = await axios.get(`/api/v1/users/get-suggested-users?id=${id}`, {
                withCredentials: true
            });
            setSuggestedUser(response.data.data);
        } catch (error) {
            // toast.error("Error while logging out user");
        }
    }
    useEffect(() => {
        if (suggestedUser.length) {
            return;
        }
        setSuggestedUsers();
    }, [])
    return (
        <div className='pl-3 border-l-[1px] min-w-full min-h-full h-full rounded w-full py-5'>
            {
                auth?._id &&
                <div className='flex items-start pl-4 justify-center flex-col '>
                    <Link to={"/profile/" + auth?._id} className='flex items-center cursor-pointer justify-start w-full lg:gap-4 gap-3'>
                        <div>
                            <Avatar className='w-11 h-11'>
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex items-center mb-1 flex-col justify-center'>
                            <div>
                                <h2 className='text-lg'>{auth?.username}</h2>
                            </div>
                            <div>
                                <p className='text-xs'>You'r Profile</p>
                            </div>
                        </div>
                    </Link>
                </div>
            }
            <div className='mt-10'>
                <div className='flex px-4 items-center font-medium justify-between'>
                    <div>
                        <h1 className='cursor-pointer'>Suggested Accounts</h1>
                    </div>
                    <div>
                        <a className='cursor-pointer'>See all</a>
                    </div>
                </div>
                <div className='mt-6 lg:w-full max-w-full md:w-1/2'>
                    {
                        suggestedUser.length &&
                        suggestedUser.map((user, index) => (
                            <SuggestedSingleUser username={user.username} profilePicture={user.profilePicture} userId={user._id} key={index} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SuggestedUser