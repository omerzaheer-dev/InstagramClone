import useAuth from '@/hooks/useAuth'
import { Label } from "@/components/ui/label"
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Sel from '@/comps/Sel'


const FormSchema = z.object({
    bio: z.string().min(0, {
        message: "",
    }),
    gender: z.string().min(0, {
        message: "Please provide gender.",
    }),
})



const EditProfile = () => {
    const { auth } = useAuth()
    const imageRef = useRef();
    const [files, setFiles] = useState(auth?.profilePicture);
    const [profile, setProfile] = useState(null);
    const [btn, setBtn] = useState(false);
    const handleUploadPhoto = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setProfile(file);
            setFiles(URL.createObjectURL(file))
        }
    }
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            bio: auth?.bio,
            gender: auth?.gender
        },
    })
    const allFormValues = form.getValues();
    useEffect(() => {
        if (profile === null && allFormValues.bio === auth?.bio && allFormValues.gender === auth?.gender) {
            setBtn(false)
        } else {
            setBtn(true)
        }
    }, [allFormValues.bio, allFormValues.gender, profile])
    function onSubmit(data) {
        if (btn === true) {
            console.log("g", data);
        } else {
            return;
        }
    }
    return (
        <>
            {
                auth._id &&
                <div className='px-10 py-9 text-slate-700'>
                    <div className='w-[90%] mx-auto px-5 rounded py-2 bg-slate-200 flex items-center justify-between'>
                        <div className='flex items-center justify-start gap-4'>
                            <Avatar className='w-11 h-11 rounded-[50%]'>
                                <AvatarImage src={auth?.profilePicture || files} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className='md:text-lg text-base text-slate-600 font-medium'>@{auth.username}</span>
                        </div>
                        <div>
                            <input ref={imageRef} accept="image/*" type="file" name='profilePicture' className='hidden' onChange={handleUploadPhoto} />
                            <Button onClick={() => imageRef.current.click()} className="text-white h-7 px-[10px] bg-blue-500 hover:bg-blue-600 hover:text-white">Change Photo</Button>
                        </div>
                    </div>
                    <div className='w-[90%] mx-auto rounded py-2 mt-3'>
                        <div>
                            <Label className="md:text-lg text-base text-slate-600 my-auto">Bio: </Label>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-t-6">
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little bit about yourself"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='mt-2 flex w-full items-end justify-between'>
                                    <div>
                                        <div>
                                            <Label className="md:text-lg text-base text-slate-600 my-auto">Gender: </Label>
                                        </div>
                                        <Sel
                                            className="w-[104px]"
                                            label=""
                                            control={form.control}
                                            placeholder="Select Gender"
                                            name="gender"
                                        />
                                    </div>
                                    <div>
                                        <Button style={{
                                            backgroundColor: btn === true ? "#2563eb" : " #60a5fa",
                                        }} className="text-white h-8 px-3 hover:bg-blue-700 hover:text-white">Save Changes</Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                        {/* <Textarea placeholder="Add Your bio here..." value={bio} onChange={(e) => { setBio(e.target.value) }} /> */}
                    </div>
                </div>
            }
        </>
    )
}

export default EditProfile