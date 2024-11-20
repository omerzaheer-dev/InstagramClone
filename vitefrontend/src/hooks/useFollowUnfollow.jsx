import useAxiosPrivate from './useAxiosPrivate'
import { useToast } from './use-toast';
import useAuth from './useAuth';

export const useFollowUnfollow = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const { toast } = useToast();
    const followUnfollowUser = async (userId) => {
        // e.preventDefault();
        // e.stopPropagation();
        try {
            if (auth?._id) {
                const response = await axiosPrivate.post(`/api/v1/users/${userId}/follow-or-unfollow`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    let updatedFollowing;
                    if (response?.data?.data?.type === 'followed') {
                        updatedFollowing = [...auth.following, userId]
                        toast({
                            title: "Followed",
                            description: "User has been Followed",
                        })
                    } else {
                        updatedFollowing = auth.following.filter((us) => us !== userId);
                        toast({
                            title: "Unfollowed",
                            description: "User has been Unfollowed",
                        })
                    }
                    setAuth((prev) => ({
                        ...prev,
                        following: updatedFollowing
                    }))
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Login to Follow User.",
                    description: "You'r not logged in yet",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to Follow User Try again.",
            })
        }
    }
    return followUnfollowUser;
}
