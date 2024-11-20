import useAxiosPrivate from './useAxiosPrivate'
import { useToast } from './use-toast';
import useAuth from './useAuth';

export const useBookmarkPosts = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const { toast } = useToast();
    const BookmarkPosts = async (postId) => {
        try {
            if (auth?._id) {
                const response = await axiosPrivate.post(`/api/v1/posts/${postId}/bookmark-post`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    let updatedSaved;
                    if (response?.data?.data?.type === 'saved') {
                        updatedSaved = [...auth?.bookmarks, postId];
                        toast({
                            title: "Post Saved",
                            description: "Post has been saved",
                        })
                    } else {
                        updatedSaved = auth?.bookmarks?.filter((pid) => pid !== postId)
                        toast({
                            title: "Post Unsaved",
                            description: "Post has been unsaved",
                        })
                    }
                    setAuth((prev) => {
                        return { ...prev, bookmarks: updatedSaved }
                    })
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Login to like post.",
                    description: "You'r not logged in yet",
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to Save post Try again.",
            })
        }
    }
    return BookmarkPosts;
}
