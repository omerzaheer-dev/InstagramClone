import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import { useFollowUnfollow } from "@/hooks/useFollowUnfollow";
import { Link } from "react-router-dom";
const SuggestedSingleUser = ({ username, profilePicture, userId }) => {
    const { auth } = useAuth();
    const followUnfollowUser = useFollowUnfollow();
    return (
        <div className='flex hover:bg-slate-50 pl-4 pr-2 md:pr-8 lg:pr-5 rounded w-[90%] items-center mt-4 text-slate-800 justify-between gap-3 mb-[5px]'>
            <Link to={"/profile/" + userId} className="flex cursor-pointer items-center justify-center gap-2" onClick={() => { console.log("hhh"); }}>
                <div>
                    <Avatar className='w-9 h-9'>
                        <AvatarImage src={profilePicture} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex items-start justify-center flex-col mb-[3px]'>
                    <div>
                        <p className='text-base'>{username}</p>
                    </div>
                    <div>
                        <p className='text-xs text-slate-500'>Suggested for you</p>
                    </div>
                </div>
            </Link>
            <div onClick={() => { followUnfollowUser(userId) }}>
                {
                    auth?._id ? auth?.following?.includes(userId) ? <Button className="text-sm h-4 w-4 py-3 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500 px-8">Unfollow</Button> : <Button className="text-sm h-4 w-4 py-3 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500 px-7">Follow</Button> : <Button className="text-sm h-4 w-4 py-3 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500 px-7">Follow</Button>
                }
            </div>
        </div>
    )
}

export default SuggestedSingleUser