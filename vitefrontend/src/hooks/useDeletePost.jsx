import React, { useEffect } from 'react'
import useAxiosPrivate from './useAxiosPrivate'
import { useToast } from './use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

export const useDeletePost = () => {
    const axiosPrivate = useAxiosPrivate()
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);

    const { toast } = useToast();
    const deletePost = async (postId) => {
        try {
            const response = await axiosPrivate.delete(`/api/v1/posts/${postId}/delete-post`,
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                const newPosts = posts.filter(post => post._id.toString() !== postId.toString());
                dispatch(setPosts(newPosts));
                toast({
                    title: "Post Deleted",
                    description: "You post has been deleted",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to delete post Try again.",
            })
        }
    }
    // useEffect(() => {
    //     deletePost();
    // }, [])
    return deletePost
}
