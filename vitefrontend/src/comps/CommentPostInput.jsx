import { Input } from "@/components/ui/input"
import { useState } from "react"

const commentPostInput = () => {
    const [comment, setComment] = useState("")
    const postComment = async () => {
        if (comment.length > 0) {
            console.log("comm", comment)
            setComment("")
        }
    }
    return (
        <div className='flex items-center justify-between mt-1'>
            <Input type="text" value={comment} onChange={(e) => { setComment(e.target.value); }} placeholder="Post a comment" className="w-full px-[-8px] h-6 text-[17px] focus-visible:ring-0 focus-visible:ring-offset-0  border-none " />
            <div onClick={postComment} className={`pr-2 font-medium  ${comment.length > 0 ? "text-blue-600 cursor-pointer" : "text-blue-300"} `}>
                Post
            </div>
        </div >
    )
}

export default commentPostInput
