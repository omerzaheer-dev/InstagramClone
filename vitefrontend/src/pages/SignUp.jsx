
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import instagramsvg from "../assets/instagram.svg"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import {
    Form,
} from "@/components/ui/form"
import Inp from "@/comps/Inp"
import Sel from "@/comps/Sel"
import { useState } from "react"
import axios from "../api/axios"
import PasswordInput from "@/comps/PasswordInput"
import useSendOtpEmail from "@/hooks/useSendOtpEmail"
import useAuth from "@/hooks/useAuth"
import { useDispatch } from "react-redux"
import { reset } from "@/redux/postSlice"

const usernameRegex = /^[a-z](?!.*[_.]{2})[a-z0-9._]{2,29}$/;
const uppercase = /(?=.*[A-Z])/;
const lowercase = /(?=.*[a-z])/;
const number = /(?=.*\d)/;
const specialCharacter = /(?=.*[\W_])/;




const FormSchema = z.object({
    username: z.string().min(4, 'Username is required').refine((text) =>
        usernameRegex.test(text), {
        message: "Invalid Username"
    }
    ),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').refine((text) => uppercase.test(text), {
        message: 'Password must include at least 1 uppercase letter',
    })
        .refine((text) => lowercase.test(text), {
            message: 'Password must include at least 1 lowercase letter',
        })
        .refine((text) => number.test(text), {
            message: 'Password must include at least 1 number',
        })
        .refine((text) => specialCharacter.test(text), {
            message: 'Password must include at least 1 special character',
        }),
    confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters'),
    fullName: z.string().min(3, {
        message: "fullname must be at least of 3 characters.",
    }),
    gender: z.string().min(1, {
        message: "Please provide gender.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Confirm password and pssword dosent match',
    path: ['confirmPassword'],
});

const SignUp = () => {
    const dispatch = useDispatch();
    const { setAuth, auth } = useAuth()
    const [loading, setLoading] = useState(false);
    const sendOtp = useSendOtpEmail();
    const location = useLocation()
    let from = location?.state?.from?.pathname || "/";
    const navigate = useNavigate()

    const [files, setFiles] = useState(null);
    const [profile, setProfile] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [error, setError] = useState("");
    const handleUploadPhoto = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setFileError(false);
            setProfile(file);
            setFiles(URL.createObjectURL(file))
        }
    }
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            fullName: "",
            gender: "",
            password: "",
            confirmPassword: "",
        },
    })
    const subm = () => {
        if (!profile) {
            setFileError(true);
        }
    }
    const onSubmit = async (data) => {
        if (profile) {
            console.log("pro", profile)
            setLoading(true);
            setFileError(false);
            try {
                setError("")
                const formData = new FormData();
                const data = {
                    username: form.getValues('username'),
                    email: form.getValues('email'),
                    fullName: form.getValues('fullName'),
                    gender: form.getValues('gender'),
                    bio: form.getValues('bio'),
                    password: form.getValues('password'),
                    confirmPassword: form.getValues('confirmPassword')
                };

                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });

                if (profile) {
                    formData.append('profilePicture', profile);
                }
                console.log(formData.entries());
                const response = await axios.post('/api/v1/users/register',
                    formData, {
                    headers: { 'Content-Type': 'multipart/form-data', },
                    withCredentials: true
                }
                )
                dispatch(reset());
                const accesstoken = response?.data?.data?.accesstoken;
                const { username, role, isVerified, email, _id, profilePicture, fullName, bookmarks, bio, gender } = response?.data?.data?.user;
                setAuth({ username, role, isVerified, bookmarks, email, bio, gender, "following": response?.data?.data?.user?.following, accesstoken, _id, profilePicture, fullName })
                await sendOtp(email)
                setLoading(false);
                navigate("/unverified")
            } catch (error) {
                setLoading(false);
                if (!error.response) {
                    setError("no server response")
                } else if (error.response.status === 409) {
                    setError("User with email or username already exists")
                } else {
                    setError("Registration Failed")
                }
            }
        }
    }
    return (
        <div className='flex items-center justify-center max-w-[100%] w-auto h-[100%] my-8 md:my-5'>
            <Form {...form}>
                <form className='flex shadow-2xl flex-col w-[90%] md:w-[68%] lg:w-[34%] p-4 md:p-7 gap-1' onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <div className="text-center text-lg font-bold">
                            <h1 className="text-2xl tracking-widest text-[#c13584]">Instagram</h1>
                        </div>
                        <div className="text-sm text-slate-500 text-center">Login to see photos & videos from your friends and family</div>
                    </div>
                    <p className="text-red-500 text-center font-semibold">{error}</p>
                    <div>
                        <div className="mb-4 mt-1">
                            <div className='w-20 h-20 shadow-lg mx-auto border-[#c13584] border-[1px] relative rounded-full overflow-hidden'>
                                <div>
                                    {
                                        files && <img src={files || instagramsvg} alt="upload icon" />
                                    }
                                    {
                                        !files && <div className="flex items-center justify-center mt-3">
                                            <img src={instagramsvg} alt="upload icon" />
                                        </div>
                                    }
                                </div>
                                <div>
                                    <form>
                                        <label>
                                            <div className='px-1 cursor-pointer pb-[7px] pt-[1px] bg-opacity-[70%] leading-[14px] bg-slate-200 absolute text-xs text-center bottom-[-2px]'>
                                                Upload Photo
                                            </div>
                                            <input type="file" name='profilePicture' className='hidden' onChange={handleUploadPhoto} />
                                        </label>
                                    </form>
                                </div>
                            </div>
                            {fileError && <p className="text-[13px] leading-[19px] font-medium text-red-500 dark:text-red-900 text-center mt-[3px]">please select an image</p>}
                            <Inp label={"FullName"} placeholder={"fullName"} control={form.control} />
                            <Sel
                                label="Gender"
                                control={form.control}
                                placeholder="Select Gender"
                                name="gender"
                            />
                            <Inp label={"Username"} placeholder={"username"} control={form.control} />
                            <Inp label={"Email"} placeholder={"email"} control={form.control} />
                            <PasswordInput label={"Password"} placeholder={"password"} control={form.control} />
                            <PasswordInput label={"Confirm Password"} placeholder={"confirmPassword"} control={form.control} />
                        </div>
                        <Button className="w-full" type="submit" onClick={subm}>SignUp
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        </Button>
                        <p className="text-center mt-2 mr-[3px]">
                            <blockquote className="mt-2 border-l-2 pl-6 leading-7 [&:not(:first-child)]:mt-6">
                                Already have an account <Link to={"/login"} className=" cursor-pointer text-[#c13584] font-semibold">SignIn</Link>
                            </blockquote>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SignUp
