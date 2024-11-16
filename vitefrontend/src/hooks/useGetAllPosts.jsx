import { setHasmore, setPage, setPosts } from '@/redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '@/api/axios'
import { useEffect } from 'react';
export const useGetAllPosts = () => {
    const { posts, hasmore, page, pageSize } = useSelector(store => store.post);
    const dispatch = useDispatch();
    const fetchPost = async () => {
        try {
            const response = await axios.post('/api/v1/posts/get-all-post',
                {
                    page,
                    pageSize
                }
                , {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (response?.data?.data) {
                dispatch(setPosts([...posts, ...response?.data?.data?.posts]))
                dispatch(setPage(page + 1));
                dispatch(setHasmore(response?.data?.data?.hasMorePosts));
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!hasmore) {
            return;
        }
        fetchPost();
    }, [])
    return fetchPost;
}
