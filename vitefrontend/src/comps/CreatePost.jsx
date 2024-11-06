import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/useAuth"
import { useRef, useState } from "react"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useToast } from "@/hooks/use-toast"



export function CreatePost({ open, setOpen }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false)
    const axiosPrivate = useAxiosPrivate();
    const [caption, setCaption] = useState("")
    const imageRef = useRef()
    const { auth } = useAuth();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState("");
    const changeFile = (e) => {
        e.preventDefault();
        const filey = e.target.files[0];
        if (filey) {
            setFile(filey);
            setImage(URL.createObjectURL(filey));
        }
    }
    const upload = async () => {
        setLoading(true)
        if (!file) {
            toast.error("Please select a file before posting.");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("postImage", file);
        try {
            const response = await axiosPrivate.post('/api/v1/posts/add-new-post',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );
            if (response.data.data) {
                toast({
                    title: "Post added Successfully",
                    description: "You can now view your post",
                })
                setCaption("")
                setFile(null);
                setImage("");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to upload post Try again.",
            })
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => { setOpen(false); setFile(null); setImage(""); setCaption(""); }} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <div className='flex items-center cursor-pointer justify-start lg:gap-4 gap-3'>
                    <div>
                        <Avatar className='w-9 h-9'>
                            <AvatarImage src={auth.profilePicture || "https://github.com/shadcn.png"} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className='text-lg font-medium text-slate-800'>{auth.username}</h2>
                    </div>
                </div>
                <form className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <Label className="text-xl text-slate-700 my-auto">Captions: </Label>
                        </div>
                        <div>
                            {
                                image && (
                                    <Button className="w-fit px-4 py-[6px] h-[26px] border-none mx-auto" type="button">{loading ? <div className="flex items-center justify-center gap-2"><div>Posting </div> <div> <Loader2 className="animate-spin" /></div></div> : <div onClick={upload}>Post</div>}</Button>
                                )
                            }
                        </div>
                    </div>
                    <Textarea placeholder="Add captions to your post..." value={caption} onChange={(e) => { setCaption(e.target.value) }} />
                    <Label className="text-xl text-slate-700">Post: </Label>
                    {
                        image && (
                            <div>
                                <img className="mx-auto" src={image} alt="" />
                            </div>
                        )
                    }
                    <input ref={imageRef} onChange={changeFile} type="file" accept="image/*" className="hidden" />
                    <Button onClick={() => imageRef.current.click()} className="w-fit -mt-2 border-none mx-auto" type="button">Select from Device</Button>
                </form>
            </DialogContent>
        </Dialog >
    )
}
