import { useEffect, useState } from 'react';
import SingleComment from './SingleComment'
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from '@/api/axios'
const MultipleComments = ({ postId }) => {
    const [comments, setComments] = useState([])
    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/v1/posts/${postId}/get-post-comment`,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (response?.data?.data) {
                setComments(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchPost()
    }, [])
    return (
        <div>
            {
                comments.length &&
                comments.map((item, index) => (
                    <SingleComment key={index} username={item.author.username} profilePicture={item.author.profilePicture} comments={item.text} />
                ))
            }
        </div>
    )
}

export default MultipleComments
