import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const SingleComment = ({ comments, profilePicture, username }) => {
    const [showComment, setShowComment] = useState(false)
    const maxChars = 97;
    const comment = comments.length > maxChars && !showComment ? comments.slice(0, maxChars) + " " : comments;
    return (
        <div className="my-3">
            <div className='flex items-center cursor-pointer text-slate-800 justify-start gap-3 mb-[5px]'>
                <div>
                    <Avatar className='w-7 h-7'>
                        <AvatarImage src={profilePicture} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h2 className='text-base font-medium'>{username}</h2>
                </div>
            </div>
            <p className="text-sm leading-4">
                {comment}
                {
                    comments.length > maxChars &&
                    <button onClick={() => { setShowComment((prev) => !prev); }} className="font-medium border-0 outline-none">
                        {showComment ? 'Show Less' : 'Read More...'}
                    </button>
                }
            </p>
        </div>
    )
}

export default SingleComment
