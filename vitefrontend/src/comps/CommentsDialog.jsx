import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CommentPostInput from "./commentPostInput"
import MultipleComments from "./MultipleComments"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CommentsDialog({ text, username, profile }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {text}
            </DialogTrigger>
            <DialogContent className="lg:max-w-[55%] max-w-[100%] overflow-y-scroll max-h-[80%] rounded-t-xl min-h-[80%] top-[101%] md:top-[98%] translate-y-[-100%]">
                <div className="relative">
                    <div className="mb-7 min-h-[83%]">
                        <DialogHeader>
                            <DialogTitle className="text-left flex items-center gap-4 justify-start border-b-1">
                                <div className='flex items-center cursor-pointer text-slate-800 justify-start gap-3 mb-[5px]'>
                                    <div>
                                        <Avatar className='w-7 h-7'>
                                            <AvatarImage src={profile} alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <h2 className='text-base font-medium'>{username}</h2>
                                    </div>
                                </div>
                            </DialogTitle>
                            <DialogDescription className="text-left border-slate-400 border-b-[1px]">
                                All Comments Related to the posts
                            </DialogDescription>
                        </DialogHeader>
                        <div className="h-auto">
                            <MultipleComments />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center items-center sm:space-x-0 pb-7 pt-2 sticky min-w-[100%] w-auto rounded-b-xl max-w-[100%] left-0 bg-white -bottom-10">
                        <div className="max-w-[100%] min-w-[100%] h-full px-1 mx-auto pt-[1px]">
                            <CommentPostInput />
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
