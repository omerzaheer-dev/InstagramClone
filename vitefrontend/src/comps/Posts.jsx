import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "react-js-loader";
import Post from './Post'
import { useGetAllPosts } from '@/hooks/useGetAllPosts';
import { useSelector } from 'react-redux';
import "../index.css"
const Posts = () => {
    const getAllPosts = useGetAllPosts();
    const { posts, hasmore } = useSelector(store => store.post);
    return (
        <InfiniteScroll
            className='example'
            dataLength={posts.length}
            next={getAllPosts}
            hasMore={hasmore}
            loader={<Loader type="spinner-cub" bgColor={"transparent"} color={"#0F172A"} size={100} />}
        >
            <div className=' min-h-[105vh] w-full example'>
                {posts.length > 0 &&
                    posts.map((post, index) => (
                        <Post key={index} authorId={post?.author?._id} likes={post?.likes} commentsLength={post?.comments?.length} captions={post?.caption} post={post?.image} username={post?.author?.username} profile={post?.author?.profilePicture} postId={post?._id} />
                    ))
                }
            </div>
        </InfiniteScroll>
    )
}

export default Posts
