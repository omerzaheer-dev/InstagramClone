import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"

const commentPostInput = ({ postId }) => {
    const axiosPrivate = useAxiosPrivate();
    const { toast } = useToast();
    const [comment, setComment] = useState("")
    const { auth } = useAuth();
    const postComment = async (comm) => {
        if (comm.length > 0) {
            try {
                if (auth._id) {
                    const response = await axiosPrivate.post(`/api/v1/posts/${postId}/add-comment`,
                        { "text": comm },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true,
                        }
                    );
                    if (response) {
                        console.log("res", response);
                        toast({
                            title: "Comment Added",
                            description: "You posted a comment Successfully",
                        })
                        setComment("");
                    }
                } else {
                    toast({
                        description: "Loggin to add comment on Post.",
                    })
                }

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Failed to post comment Try again.",
                })
                console.log(error);
            }
        }
    }
    return (
        <div className='flex items-center justify-between mt-1'>
            <Input type="text" value={comment} onChange={(e) => { setComment(e.target.value); }} placeholder="Post a comment" className="w-full px-[-8px] h-6 text-[17px] focus-visible:ring-0 focus-visible:ring-offset-0  border-none " />
            <div onClick={async () => { await postComment(comment.trim()) }} className={`pr-2 font-medium  ${comment.trim().length > 0 ? "text-blue-600 cursor-pointer" : "text-blue-300"} `}>
                Post
            </div>
        </div >
    )
}

export default commentPostInput
