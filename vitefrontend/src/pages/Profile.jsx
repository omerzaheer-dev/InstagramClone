import useAuth from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetUserProfile } from '@/hooks/useGetUserProfile'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useFollowUnfollow } from '@/hooks/useFollowUnfollow'
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
const Profile = () => {
    const [tab, setTab] = useState("posts")
    const params = useParams()
    const { userId } = params
    useGetUserProfile(userId)
    const { userProfile, auth, setUserProfile } = useAuth()
    const displayPosts = tab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
    const followUnfollowUser = useFollowUnfollow();
    const handleFollowUnfollow = async () => {
        await followUnfollowUser(userId)
        if (auth.following.includes(userProfile._id)) {
            setUserProfile((prev) => {
                return { ...prev, followers: prev.followers.filter(id => id !== auth._id) }
            })
        } else {
            setUserProfile((prev) => {
                return { ...prev, followers: [...prev.followers, auth._id] }
            })
        }
    }
    const handleTabChange = (tab) => {
        setTab(tab);
    }
    return (
        <>
            <div className='flex px-3 items-center justify-center md:gap-12 gap-1 text-slate-700'>
                <div className='md:w-28 md:h-28 w-20 h-20 overflow-hidden mt-16 rounded-[50%] border-[2px]'>
                    <Avatar className='w-full h-full rounded-[50%]'>
                        <AvatarImage src={userProfile?.profilePicture} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div className='md:mt-12 mt-14'>
                    <div className='md:flex items-center md:gap-5 gap-2 justify-start'>
                        <h1 className='font-semibold text-base md:text-lg pb-[6px] md:pb-0'>@{userProfile.username}</h1>
                        {
                            auth?._id && auth._id === userProfile?._id &&
                            <div className='flex items-center justify-start md:gap-4 gap-[9px]'>
                                <Link to="/profile/edit"><Button className="md:h-[26px] h-[21px] px-[6px] md:px-[9px] bg-slate-200 hover:bg-slate-300 hover:text-slate-700 text-slate-600">Edit Profile</Button></Link>
                                <Button className="md:h-[26px] h-[21px] px-[6px] md:px-[9px] bg-slate-200 hover:bg-slate-300 hover:text-slate-700 text-slate-600">View Archives</Button>
                                <Button className="md:h-[26px] h-[21px] px-[6px] md:px-[9px] bg-slate-200 hover:bg-slate-300 hover:text-slate-700 text-slate-600">Ad tools</Button>
                            </div>
                        }
                        {
                            !auth._id || auth._id !== userProfile?._id &&
                            <div className='flex items-center justify-start md:gap-5 gap-4'>
                                <div onClick={async () => { await handleFollowUnfollow() }}>
                                    {
                                        auth?._id ? auth?.following?.includes(userId) ? <Button className="md:h-[28px] h-[26px] px-[7px] md:px-[10px] bg-slate-200 hover:bg-blue-500 hover:text-white text-sm md:text-base text-slate-700">Unfollow</Button> : <Button className="md:h-[28px] h-[26px] px-[7px] md:px-[10px]  bg-blue-500 hover:bg-blue-600 text-sm md:text-base hover:text-white text-white">Follow</Button> : <Button className="md:h-[28px] h-[26px] px-[7px] md:px-[10px] text-sm md:text-base bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Follow</Button>
                                    }
                                </div>
                                <Button className="md:h-[28px] text-sm md:text-base h-[26px] px-[7px] md:px-[10px] bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Message</Button>
                            </div>
                        }
                    </div>
                    <div className='md:mt-3 mt-[6px] font-medium flex text-sm md:text-base items-center justify-start gap-[14px] md:gap-6'>
                        <p>{userProfile?.posts?.length} Posts</p>
                        <p>{userProfile?.followers?.length} Followers</p>
                        <p>{userProfile?.following?.length} Following</p>
                    </div>
                    <div className='md:mt-2 mt-[3px]'>
                        <h2 className='font-medium'>{userProfile?.fullName}</h2>
                        <p>{userProfile?.bio?.length > 0 ? userProfile?.bio : "No bio available"}</p>
                    </div>
                </div>
            </div>
            <div className='md:px-36 lg:px-48 px-7 mt-20'>
                <div className='flex text-lg items-center justify-between text-slate-700'>
                    <span onClick={() => { handleTabChange("posts") }} style={{ fontWeight: tab === 'posts' ? '600' : 'normal' }} className='cursor-pointer'>Posts</span>
                    <span onClick={() => { handleTabChange("saved") }} style={{ fontWeight: tab === 'saved' ? '600' : 'normal' }} className='cursor-pointer'>Saved</span>
                    <span onClick={() => { handleTabChange("reels") }} style={{ fontWeight: tab === 'reels' ? '600' : 'normal' }} className='cursor-pointer'>Reels</span>
                    <span onClick={() => { handleTabChange("tags") }} style={{ fontWeight: tab === 'tags' ? '600' : 'normal' }} className='cursor-pointer'>Tags</span>
                </div>
                <div className='my-3 grid place-items-start overflow-hidden place-content-between grid-flow-row grid-cols-3 gap-3'>
                    {
                        displayPosts &&
                        displayPosts.map((post, index) => {
                            return (
                                <div key={index} className='w-auto md:h-[180px] relative h-[115px] rounded-sm bg-slate-200 flex items-center justify-center'>
                                    <div className='md:max-w-[650px] max-w-[550px] overflow-hidden max-h-[115px] md:max-h-[180px]'>
                                        <img className="w-[100%] h-[100%] overflow-hidden" src={post?.image} alt="" />
                                        <div className='flex text-white inset-0 absolute opacity-0 items-center justify-center bg-black hover:opacity-75 transition-opacity duration-200'>
                                            <div className='flex items-center md:text-lg md:gap-4 gap-2 justify-center'>
                                                <div className='flex items-center justify-center gap-1'>
                                                    <FaHeart className="text-white" />
                                                    <span>{post.likes.length}</span>
                                                </div>
                                                <div className='flex items-center justify-center gap-1'>
                                                    <FaComment />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
        // <div>{userProfile?.username}</div>
    )
}

export default Profile