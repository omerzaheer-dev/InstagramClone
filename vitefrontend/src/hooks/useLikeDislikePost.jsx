import useAxiosPrivate from './useAxiosPrivate'
import { useToast } from './use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, toggleLike } from '@/redux/postSlice';
import useAuth from './useAuth';
import { useState } from 'react';

export const useLikeDislikePost = () => {
    const { auth } = useAuth();
    const { posts } = useSelector(store => store.post);
    const axiosPrivate = useAxiosPrivate()
    const dispatch = useDispatch();
    const { toast } = useToast();
    const likeDislikePost = async (postId) => {
        try {
            if (auth?._id) {
                const response = await axiosPrivate.post(`/api/v1/posts/${postId}/like-or-dislike-post`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    const userId = auth._id;
                    let updatedPost;
                    if (response?.data?.data?.type === 'liked') {
                        updatedPost = posts.map((p) =>
                            p._id === postId ? {
                                ...p,
                                likes: [...p.likes, userId]
                            } : { ...p }
                        );
                        toast({
                            title: "Post Liked",
                            description: "Post has been liked",
                        })
                    } else {
                        updatedPost = posts.map((p) =>
                            p._id === postId ? {
                                ...p,
                                likes: p.likes.filter((id) => id !== userId)
                            } : { ...p }
                        );
                        toast({
                            title: "Post Unliked",
                            description: "Post has been unliked",
                        })
                    }
                    dispatch(setPosts(updatedPost));
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Login to like post.",
                    description: "You'r not logged in yet",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to like post Try again.",
            })
        }
    }
    return likeDislikePost;
}
