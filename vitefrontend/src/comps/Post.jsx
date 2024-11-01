import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { BsThreeDots } from "react-icons/bs";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa";
import { useState } from "react";
import CommentPostInput from "./commentPostInput"
import CommentsDialog from "./CommentsDialog";
const Post = ({ username, post, profile, captions }) => {
    const [showCaption, setShowCaption] = useState(false)
    const maxChars = 100;
    const caption = captions.length > maxChars && !showCaption ? captions.slice(0, maxChars) + " " : captions;
    return (
        <div className="w-full mb-5">
            <div className='flex lg:max-w-[88%] max-w-[100%] text-slate-900 hover:bg-slate-50 items-center justify-between lg:py-[7px] py-[5px] rounded lg:mx-auto px-[6px]'>
                <div className='flex items-center cursor-pointer justify-start lg:gap-4 gap-3'>
                    <div>
                        <Avatar className='w-9 h-9'>
                            <AvatarImage src={profile} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className='text-lg'>{username}</h2>
                    </div>
                </div>
                <div className='text-xl font-bold'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="cursor-pointer">
                                <BsThreeDots />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="md:max-w-[425px] max-w-[200px] rounded py-[15px] px-[18px] md:py-[11px] md:px-[25px]">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="cursor-pointer py-[1px] text-center w-full rounded hover:bg-slate-100 text-slate-900 font-medium">Abc</div>
                                <div className="cursor-pointer py-[1px] text-center w-full rounded hover:bg-slate-100 text-slate-900 font-medium">Abc</div>
                                <DialogClose className="cursor-pointer py-[1px] text-center w-full rounded hover:bg-slate-100 text-slate-900 font-medium  ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-white  disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
                                    Close
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="lg:max-w-[88%] max-w-[100%] lg:min-w-[88%] min-w-[100%] min-h-[120px] h-auto flex items-center justify-center lg:mx-auto overflow-hidden bg-slate-100 object-fit">
                <img src={post} alt="" className="w-full rounded-sm bg-cover h-auto" />
            </div>
            <div className="flex items-start justify-between text-[24px] px-2 pt-3 lg:max-w-[88%] max-w-[100%] text-slate-900 lg:mx-auto hover:bg-slate-50">
                <div className="flex items-center justify-center gap-7">
                    <div>
                        <FaRegHeart className="cursor-pointer" />
                    </div>
                    <div>
                        <CommentsDialog text={<FaRegComment className="cursor-pointer" />} username={"yuaftyd"} profile={profile} />
                    </div>
                    <div>
                        <FaRegPaperPlane className="cursor-pointer" />
                    </div>
                </div>
                <div>
                    <FaRegBookmark className="cursor-pointer text-" />
                </div>
            </div>
            <div className="px-2 pt-[3px] lg:max-w-[88%] w-auto max-w-[100%] text-slate-900 lg:mx-auto ">
                <span className="text-[16px] font-medium">1 likes</span>
                <div>
                    <p className="text-sm leading-4">{caption}
                        {
                            captions.length > maxChars &&
                            <button onClick={() => { setShowCaption((prev) => !prev); }} className="font-medium">
                                {showCaption ? 'Show Less' : ' Read More...'}
                            </button>
                        }
                    </p>
                </div>
            </div>
            <div className="px-2 pt-[3px] lg:max-w-[88%] w-auto max-w-[100%] text-slate-900 lg:mx-auto ">
                <CommentsDialog text={<span className="text-[16px] font-medium text-slate-400 cursor-pointer">See 100 Comments</span>} />
                <div>
                    <CommentPostInput />
                </div>
            </div>
        </div>
    )
}

export default Post

